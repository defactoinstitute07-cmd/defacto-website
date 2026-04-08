import { NextRequest } from "next/server";
import { AuthenticationError, ValidationError, handleRouteError } from "@/lib/api-errors";
import { buildAuthenticatedResponse, requireAdminUser } from "@/lib/auth-session";
import connectDB from "@/lib/mongodb";
import { assertRateLimit, assertTrustedOrigin, getClientIp } from "@/lib/security";
import {
  decryptTwoFactorSecret,
  verifyTotpCode,
} from "@/lib/two-factor";
import { parseJsonObject, readText } from "@/lib/validation";
import User from "@/models/User";

export async function POST(request: NextRequest) {
  try {
    assertTrustedOrigin(request);
    const sessionUser = await requireAdminUser(request);
    const clientIp = getClientIp(request);

    await assertRateLimit({
      scope: "admin-2fa-enable",
      key: `${sessionUser.id}:${clientIp}`,
      limit: 8,
      windowSeconds: 60 * 60,
      blockSeconds: 60 * 60,
      message: "Too many two-factor verification attempts. Try again in 1 hour.",
    });

    await connectDB();

    const body = await parseJsonObject(request);
    const code = readText(body.code, {
      field: "Authenticator code",
      min: 6,
      max: 12,
    });
    const user = await User.findOne({
      _id: sessionUser.id,
      role: "admin",
      is_active: true,
    }).select("email role session_version two_factor_enabled +two_factor_pending_secret");

    if (!user) {
      throw new AuthenticationError();
    }

    if (user.two_factor_enabled) {
      throw new ValidationError("Two-factor authentication is already enabled.");
    }

    if (!user.two_factor_pending_secret) {
      throw new ValidationError("Start the two-factor setup before verifying a code.");
    }

    const secret = decryptTwoFactorSecret(user.two_factor_pending_secret);
    if (!verifyTotpCode(secret, code)) {
      throw new AuthenticationError("Invalid authenticator code.");
    }

    user.two_factor_secret = user.two_factor_pending_secret;
    user.two_factor_pending_secret = null;
    user.two_factor_enabled = true;
    user.two_factor_enabled_at = new Date();
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
        enabled: true,
      },
    );
  } catch (error) {
    return handleRouteError(error, "Failed to enable two-factor authentication.");
  }
}
