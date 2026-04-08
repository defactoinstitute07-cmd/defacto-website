import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { AuthenticationError, handleRouteError } from "@/lib/api-errors";
import { buildAuthenticatedResponse, ensureAuthSessionConfigured } from "@/lib/auth-session";
import connectDB from "@/lib/mongodb";
import {
  assertRateLimit,
  assertTrustedOrigin,
  getClientIp,
  resetRateLimit,
} from "@/lib/security";
import {
  consumeRecoveryCode,
  decryptTwoFactorSecret,
  verifyTotpCode,
} from "@/lib/two-factor";
import {
  parseJsonObject,
  readEmail,
  readOptionalText,
  readPassword,
} from "@/lib/validation";
import User from "@/models/User";

const LOGIN_IP_SCOPE = "admin-login-ip";
const LOGIN_EMAIL_SCOPE = "admin-login-email";

export async function POST(request: NextRequest) {
  try {
    assertTrustedOrigin(request);
    ensureAuthSessionConfigured();

    const body = await parseJsonObject(request);
    const email = readEmail(body.email);
    const password = readPassword(body.password);
    const twoFactorToken = readOptionalText(body.twoFactorToken, {
      field: "Authenticator code",
      max: 32,
    });
    const clientIp = getClientIp(request);

    await assertRateLimit({
      scope: LOGIN_IP_SCOPE,
      key: clientIp,
      limit: 10,
      windowSeconds: 15 * 60,
      blockSeconds: 30 * 60,
      message: "Too many sign-in attempts. Try again in 30 minutes.",
    });
    await assertRateLimit({
      scope: LOGIN_EMAIL_SCOPE,
      key: email,
      limit: 5,
      windowSeconds: 15 * 60,
      blockSeconds: 30 * 60,
      message: "Too many sign-in attempts. Try again in 30 minutes.",
    });

    await connectDB();

    const user = await User.findOne({ email, role: "admin" }).select(
      "+password_hash email role is_active session_version two_factor_enabled +two_factor_secret +two_factor_backup_code_hashes",
    );

    if (!user || !user.is_active) {
      throw new AuthenticationError("Invalid email or password.");
    }

    const passwordMatches = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatches) {
      throw new AuthenticationError("Invalid email or password.");
    }

    if (user.two_factor_enabled) {
      if (!twoFactorToken) {
        return NextResponse.json(
          {
            error: "Enter your 6-digit authenticator code or one recovery code.",
            requiresTwoFactor: true,
          },
          { status: 401 },
        );
      }

      const encryptedSecret = user.two_factor_secret;
      const secret = encryptedSecret ? decryptTwoFactorSecret(encryptedSecret) : "";
      const totpVerified = secret ? verifyTotpCode(secret, twoFactorToken) : false;
      const recoveryAttempt = totpVerified
        ? { matched: false, remainingHashes: user.two_factor_backup_code_hashes ?? [] }
        : await consumeRecoveryCode(
            twoFactorToken,
            user.two_factor_backup_code_hashes ?? [],
          );

      if (!totpVerified && !recoveryAttempt.matched) {
        return NextResponse.json(
          {
            error: "Invalid authenticator or recovery code.",
            requiresTwoFactor: true,
          },
          { status: 401 },
        );
      }

      if (recoveryAttempt.matched) {
        user.two_factor_backup_code_hashes = recoveryAttempt.remainingHashes;
      }
    }

    user.session_version = (user.session_version ?? 0) + 1;
    user.last_login_at = new Date();
    await user.save();
    await Promise.all([
      resetRateLimit(LOGIN_IP_SCOPE, clientIp),
      resetRateLimit(LOGIN_EMAIL_SCOPE, email),
    ]);

    return buildAuthenticatedResponse({
      sub: String(user._id),
      email: user.email,
      role: "admin",
      version: user.session_version,
    }, {
      ok: true,
      user: {
        id: String(user._id),
        email: user.email,
        role: user.role,
        twoFactorEnabled: Boolean(user.two_factor_enabled),
      },
    });
  } catch (error) {
    return handleRouteError(error, "Failed to sign in.");
  }
}
