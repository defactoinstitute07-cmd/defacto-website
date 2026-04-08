import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { AuthenticationError, ValidationError, handleRouteError } from "@/lib/api-errors";
import { requireAdminUser } from "@/lib/auth-session";
import connectDB from "@/lib/mongodb";
import { assertRateLimit, assertTrustedOrigin, getClientIp } from "@/lib/security";
import {
  createTwoFactorSetup,
  encryptTwoFactorSecret,
  hashBackupCodes,
} from "@/lib/two-factor";
import { parseJsonObject, readPassword } from "@/lib/validation";
import User from "@/models/User";

export async function POST(request: NextRequest) {
  try {
    assertTrustedOrigin(request);
    const sessionUser = await requireAdminUser(request);
    const clientIp = getClientIp(request);

    await assertRateLimit({
      scope: "admin-2fa-setup",
      key: `${sessionUser.id}:${clientIp}`,
      limit: 5,
      windowSeconds: 60 * 60,
      blockSeconds: 60 * 60,
      message: "Too many two-factor setup attempts. Try again in 1 hour.",
    });

    await connectDB();

    const body = await parseJsonObject(request);
    const password = readPassword(body.password);
    const user = await User.findOne({
      _id: sessionUser.id,
      role: "admin",
      is_active: true,
    }).select("+password_hash email two_factor_enabled");

    if (!user) {
      throw new AuthenticationError();
    }

    const passwordMatches = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatches) {
      throw new AuthenticationError("Current password is incorrect.");
    }

    if (user.two_factor_enabled) {
      throw new ValidationError("Two-factor authentication is already enabled.");
    }

    const setup = createTwoFactorSetup(user.email);
    user.two_factor_pending_secret = encryptTwoFactorSecret(setup.secret);
    user.two_factor_backup_code_hashes = await hashBackupCodes(setup.backupCodes);
    await user.save();

    return NextResponse.json({
      ok: true,
      secretKey: setup.secretKey,
      otpauthUrl: setup.otpauthUrl,
      backupCodes: setup.backupCodes,
    });
  } catch (error) {
    return handleRouteError(error, "Failed to start two-factor setup.");
  }
}
