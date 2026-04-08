import { TextEncoder } from "node:util";
import { SignJWT, jwtVerify } from "jose";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import connectDB from "./mongodb";
import { AuthenticationError, ConfigurationError } from "./api-errors";
import User from "../models/User";

export const AUTH_SESSION_COOKIE = "defacto_admin_session";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 12;

type SessionPayload = {
  sub: string;
  email: string;
  role: "admin";
  version: number;
};

function getJwtSecret() {
  const secret = process.env.JWT_SECRET?.trim();

  if (!secret) {
    throw new ConfigurationError(
      "Missing JWT_SECRET environment variable. Add JWT_SECRET to your .env file.",
    );
  }

  return new TextEncoder().encode(secret);
}

export function ensureAuthSessionConfigured() {
  getJwtSecret();
}

export async function signAdminSession(payload: SessionPayload) {
  return new SignJWT({ email: payload.email, role: payload.role, version: payload.version })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE_SECONDS}s`)
    .sign(getJwtSecret());
}

export async function verifyAdminSession(token: string) {
  const { payload } = await jwtVerify(token, getJwtSecret());
  const sub = payload.sub;
  const email = payload.email;
  const role = payload.role;
  const version = payload.version;

  if (
    typeof sub !== "string" ||
    typeof email !== "string" ||
    role !== "admin" ||
    typeof version !== "number" ||
    !Number.isInteger(version) ||
    version < 0
  ) {
    throw new AuthenticationError();
  }

  return {
    id: sub,
    email,
    role: "admin" as const,
    version,
  };
}

export async function getAdminUserFromRequest(request: NextRequest) {
  const token = request.cookies.get(AUTH_SESSION_COOKIE)?.value;

  if (!token) {
    return null;
  }

  try {
    const session = await verifyAdminSession(token);

    await connectDB();
    const user = await User.findOne({
      _id: session.id,
      role: "admin",
      is_active: true,
      session_version: session.version,
    })
      .select("_id email role is_active session_version two_factor_enabled")
      .lean();

    if (!user) {
      return null;
    }

    return {
      id: String(user._id),
      email: user.email,
      role: user.role,
      twoFactorEnabled: Boolean(user.two_factor_enabled),
    };
  } catch {
    return null;
  }
}

export async function requireAdminUser(request: NextRequest) {
  const user = await getAdminUserFromRequest(request);

  if (!user) {
    throw new AuthenticationError();
  }

  return user;
}

export async function buildAuthenticatedResponse(
  payload: SessionPayload,
  body: Record<string, unknown>,
  init?: ResponseInit,
) {
  const token = await signAdminSession(payload);
  const response = NextResponse.json(body, init);

  response.cookies.set({
    name: AUTH_SESSION_COOKIE,
    value: token,
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
  response.headers.set("Cache-Control", "no-store");

  return response;
}

export function clearAuthenticatedResponse(body: Record<string, unknown> = { ok: true }) {
  const response = NextResponse.json(body);

  response.cookies.set({
    name: AUTH_SESSION_COOKIE,
    value: "",
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: new Date(0),
  });
  response.headers.set("Cache-Control", "no-store");

  return response;
}

export async function revokeAdminSession(request: NextRequest) {
  const token = request.cookies.get(AUTH_SESSION_COOKIE)?.value;

  if (!token) {
    return;
  }

  try {
    const session = await verifyAdminSession(token);
    await connectDB();
    await User.updateOne(
      { _id: session.id, role: "admin" },
      { $inc: { session_version: 1 } },
    );
  } catch {
    // Ignore invalid or already-expired sessions during logout.
  }
}
