import { createHash } from "node:crypto";
import type { NextRequest } from "next/server";
import { ForbiddenError, RateLimitError } from "./api-errors";
import connectDB from "./mongodb";
import RateLimitRecord from "../models/RateLimitRecord";

type RateLimitOptions = {
  scope: string;
  key: string;
  limit: number;
  windowSeconds: number;
  blockSeconds: number;
  message?: string;
};

function normalizeKey(value: string) {
  return value.trim().toLowerCase();
}

function hashKey(scope: string, key: string) {
  return createHash("sha256").update(`${scope}:${normalizeKey(key)}`).digest("hex");
}

function getExpiryDate(now: Date, windowSeconds: number, blockSeconds: number) {
  const keepForSeconds = Math.max(windowSeconds, blockSeconds, 60) * 2;
  return new Date(now.getTime() + keepForSeconds * 1000);
}

function getSafeOrigin(value: string | null) {
  if (!value) {
    return null;
  }

  try {
    return new URL(value).origin;
  } catch {
    return null;
  }
}

function getEnvOrigins() {
  const configured = process.env.ALLOWED_ORIGINS?.split(",") ?? [];
  return configured
    .map((origin) => origin.trim())
    .filter(Boolean)
    .map((origin) => getSafeOrigin(origin))
    .filter((origin): origin is string => Boolean(origin));
}

export function getClientIp(request: NextRequest) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    const [firstIp] = forwardedFor.split(",");
    if (firstIp?.trim()) {
      return firstIp.trim();
    }
  }

  const realIp =
    request.headers.get("cf-connecting-ip") ??
    request.headers.get("x-real-ip") ??
    request.headers.get("x-client-ip");

  if (realIp?.trim()) {
    return realIp.trim();
  }

  return "unknown";
}

export function getAllowedOrigins(request: NextRequest) {
  const allowedOrigins = new Set<string>([request.nextUrl.origin]);
  const siteOrigin = getSafeOrigin(process.env.NEXT_PUBLIC_SITE_URL ?? null);
  const vercelOrigin = process.env.VERCEL_URL?.trim()
    ? getSafeOrigin(`https://${process.env.VERCEL_URL.trim()}`)
    : null;

  if (siteOrigin) {
    allowedOrigins.add(siteOrigin);
  }

  if (vercelOrigin) {
    allowedOrigins.add(vercelOrigin);
  }

  for (const origin of getEnvOrigins()) {
    allowedOrigins.add(origin);
  }

  return allowedOrigins;
}

export function assertTrustedOrigin(request: NextRequest) {
  if (["GET", "HEAD", "OPTIONS"].includes(request.method)) {
    return;
  }

  const allowedOrigins = getAllowedOrigins(request);
  const origin = getSafeOrigin(request.headers.get("origin"));
  const refererOrigin = getSafeOrigin(request.headers.get("referer"));

  if (origin && allowedOrigins.has(origin)) {
    return;
  }

  if (!origin && refererOrigin && allowedOrigins.has(refererOrigin)) {
    return;
  }

  throw new ForbiddenError("Cross-site requests are not allowed.");
}

export async function assertRateLimit(options: RateLimitOptions) {
  const normalizedKey = normalizeKey(options.key);
  const now = new Date();
  const keyHash = hashKey(options.scope, normalizedKey);
  const expiresAt = getExpiryDate(now, options.windowSeconds, options.blockSeconds);

  await connectDB();

  const record = await RateLimitRecord.findOne({
    scope: options.scope,
    key_hash: keyHash,
  });

  if (!record) {
    await RateLimitRecord.create({
      scope: options.scope,
      key_hash: keyHash,
      hits: 1,
      window_started_at: now,
      blocked_until: null,
      expires_at: expiresAt,
    });
    return;
  }

  if (record.blocked_until && record.blocked_until.getTime() > now.getTime()) {
    const retryAfterSeconds = Math.max(
      1,
      Math.ceil((record.blocked_until.getTime() - now.getTime()) / 1000),
    );
    throw new RateLimitError(options.message, retryAfterSeconds);
  }

  const windowExpiresAt = record.window_started_at.getTime() + options.windowSeconds * 1000;
  if (windowExpiresAt <= now.getTime()) {
    record.hits = 1;
    record.window_started_at = now;
    record.blocked_until = null;
    record.expires_at = expiresAt;
    await record.save();
    return;
  }

  record.hits += 1;
  record.expires_at = expiresAt;

  if (record.hits > options.limit) {
    record.blocked_until = new Date(now.getTime() + options.blockSeconds * 1000);
    await record.save();
    throw new RateLimitError(options.message, options.blockSeconds);
  }

  await record.save();
}

export async function resetRateLimit(scope: string, key: string) {
  const normalizedKey = normalizeKey(key);
  const keyHash = hashKey(scope, normalizedKey);

  await connectDB();
  await RateLimitRecord.deleteOne({ scope, key_hash: keyHash });
}
