import bcrypt from "bcryptjs";
import { NextRequest } from "next/server";
import { AuthenticationError, ValidationError, handleRouteError } from "@/lib/api-errors";
import { buildAuthenticatedResponse, requireAdminUser } from "@/lib/auth-session";
import connectDB from "@/lib/mongodb";
import { assertRateLimit, assertTrustedOrigin, getClientIp } from "@/lib/security";
import {
  consumeRecoveryCode,
  decryptTwoFactorSecret,
  verifyTotpCode,
} from "@/lib/two-factor";
import { parseJsonObject, readPassword, readText } from "@/lib/validation";
import User from "@/models/User";

export async function POST(request: NextRequest) {
  try {
    assertTrustedOrigin(request);
    const sessionUser = await requireAdminUser(request);
    const clientIp = getClientIp(request);

    await assertRateLimit({
      scope: "admin-2fa-disable",
      key: `${sessionUser.id}:${clientIp}`,
      limit: 8,
      windowSeconds: 60 * 60,
      blockSeconds: 60 * 60,
      message: "Too many two-factor disable attempts. Try again in 1 hour.",
    });

    await connectDB();

    const body = await parseJsonObject(request);
    const password = readPassword(body.password);
    const token = readText(body.token, {
      field: "Verification code",
      min: 6,
      max: 32,
    });
    const user = await User.findOne({
      _id: sessionUser.id,
      role: "admin",
      is_active: true,
    }).select(
      "+password_hash email role session_version two_factor_enabled +two_factor_secret +two_factor_backup_code_hashes",
    );

    if (!user) {
      throw new AuthenticationError();
    }

    const passwordMatches = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatches) {
      throw new AuthenticationError("Current password is incorrect.");
    }

    if (!user.two_factor_enabled) {
      throw new ValidationError("Two-factor authentication is not enabled.");
    }

    const secret = user.two_factor_secret ? decryptTwoFactorSecret(user.two_factor_secret) : "";
    const totpVerified = secret ? verifyTotpCode(secret, token) : false;
    const recoveryAttempt = totpVerified
      ? { matched: false, remainingHashes: user.two_factor_backup_code_hashes ?? [] }
      : await consumeRecoveryCode(token, user.two_factor_backup_code_hashes ?? []);

    if (!totpVerified && !recoveryAttempt.matched) {
      throw new AuthenticationError("Invalid authenticator or recovery code.");
    }

    user.two_factor_enabled = false;
    user.two_factor_secret = null;
    user.two_factor_pending_secret = null;
    user.two_factor_backup_code_hashes = [];
    user.two_factor_enabled_at = null;
    user.session_version = (user.session_version ?? 0) + 1;
    await user.save();

    return buildAuthenticatedResponse(
      {
        sub: String(user._id),
        email: user.email,
        role: user.role,
        version: user.session_version,
      },
      {
        ok: true,
        enabled: false,
      },
    );
  } catch (error) {
    return handleRouteError(error, "Failed to disable two-factor authentication.");
  }
}
