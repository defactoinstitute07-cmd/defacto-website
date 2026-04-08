import bcrypt from "bcryptjs";
import { NextRequest } from "next/server";
import { ForbiddenError, ValidationError, handleRouteError } from "@/lib/api-errors";
import { buildAuthenticatedResponse, ensureAuthSessionConfigured } from "@/lib/auth-session";
import connectDB from "@/lib/mongodb";
import {
  assertRateLimit,
  assertTrustedOrigin,
  getClientIp,
  resetRateLimit,
} from "@/lib/security";
import { parseJsonObject, readEmail, readOptionalText, readPassword } from "@/lib/validation";
import User from "@/models/User";

const REGISTER_IP_SCOPE = "admin-register-ip";
const REGISTER_EMAIL_SCOPE = "admin-register-email";

export async function POST(request: NextRequest) {
  try {
    assertTrustedOrigin(request);
    ensureAuthSessionConfigured();

    const body = await parseJsonObject(request);
    const email = readEmail(body.email);
    const password = readPassword(body.password);
    const clientIp = getClientIp(request);
    const registrationSecret = readOptionalText(body.registrationSecret, {
      field: "Registration secret",
      max: 160,
    });

    await assertRateLimit({
      scope: REGISTER_IP_SCOPE,
      key: clientIp,
      limit: 5,
      windowSeconds: 60 * 60,
      blockSeconds: 60 * 60,
      message: "Too many admin registration attempts. Try again in 1 hour.",
    });
    await assertRateLimit({
      scope: REGISTER_EMAIL_SCOPE,
      key: email,
      limit: 3,
      windowSeconds: 60 * 60,
      blockSeconds: 60 * 60,
      message: "Too many admin registration attempts. Try again in 1 hour.",
    });

    await connectDB();

    const existingAdminCount = await User.countDocuments({ role: "admin" });

    if (existingAdminCount > 0) {
      const expectedSecret = process.env.ADMIN_REGISTRATION_SECRET?.trim();

      if (!expectedSecret || registrationSecret !== expectedSecret) {
        throw new ForbiddenError("Admin registration is locked.");
      }
    }

    const existingUser = await User.findOne({ email }).select("_id").lean();
    if (existingUser) {
      throw new ValidationError("An admin account with this email already exists.");
    }

    const password_hash = await bcrypt.hash(password, 12);
    const user = await User.create({
      email,
      password_hash,
      role: "admin",
      is_active: true,
      session_version: 1,
    });
    await Promise.all([
      resetRateLimit(REGISTER_IP_SCOPE, clientIp),
      resetRateLimit(REGISTER_EMAIL_SCOPE, email),
    ]);

    return buildAuthenticatedResponse(
      {
        sub: String(user._id),
        email: user.email,
        role: "admin",
        version: user.session_version,
      },
      {
        ok: true,
        user: {
          id: String(user._id),
          email: user.email,
          role: user.role,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    return handleRouteError(error, "Failed to create admin account.");
  }
}
