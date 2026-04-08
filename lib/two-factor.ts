import bcrypt from "bcryptjs";
import {
  createCipheriv,
  createDecipheriv,
  createHash,
  createHmac,
  randomBytes,
  timingSafeEqual,
} from "node:crypto";
import { ConfigurationError } from "./api-errors";

const BASE32_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
const TOTP_DIGITS = 6;
const TOTP_PERIOD_SECONDS = 30;
const TOTP_WINDOW_STEPS = 1;
const SECRET_BYTE_LENGTH = 20;
const BACKUP_CODE_COUNT = 8;

function getTwoFactorEncryptionKey() {
  const rawSecret =
    process.env.TOTP_ENCRYPTION_KEY?.trim() || process.env.JWT_SECRET?.trim();

  if (!rawSecret) {
    throw new ConfigurationError(
      "Missing TOTP_ENCRYPTION_KEY. Add TOTP_ENCRYPTION_KEY or JWT_SECRET in .env.",
    );
  }

  return createHash("sha256").update(rawSecret).digest();
}

function base32Encode(buffer: Buffer) {
  let output = "";
  let bits = 0;
  let value = 0;

  for (const byte of buffer) {
    value = (value << 8) | byte;
    bits += 8;

    while (bits >= 5) {
      output += BASE32_ALPHABET[(value >>> (bits - 5)) & 31];
      bits -= 5;
    }
  }

  if (bits > 0) {
    output += BASE32_ALPHABET[(value << (5 - bits)) & 31];
  }

  return output;
}

function base32Decode(secret: string) {
  const normalized = secret.replace(/=+$/g, "").replace(/\s+/g, "").toUpperCase();
  let bits = 0;
  let value = 0;
  const output: number[] = [];

  for (const char of normalized) {
    const index = BASE32_ALPHABET.indexOf(char);
    if (index < 0) {
      throw new Error("Invalid base32 secret.");
    }

    value = (value << 5) | index;
    bits += 5;

    if (bits >= 8) {
      output.push((value >>> (bits - 8)) & 255);
      bits -= 8;
    }
  }

  return Buffer.from(output);
}

function createHotp(secret: Buffer, counter: number) {
  const counterBuffer = Buffer.alloc(8);
  counterBuffer.writeUInt32BE(Math.floor(counter / 0x100000000), 0);
  counterBuffer.writeUInt32BE(counter >>> 0, 4);

  const hmac = createHmac("sha1", secret).update(counterBuffer).digest();
  const offset = hmac[hmac.length - 1] & 0x0f;
  const binary =
    ((hmac[offset] & 0x7f) << 24) |
    ((hmac[offset + 1] & 0xff) << 16) |
    ((hmac[offset + 2] & 0xff) << 8) |
    (hmac[offset + 3] & 0xff);

  return String(binary % 10 ** TOTP_DIGITS).padStart(TOTP_DIGITS, "0");
}

function createTotp(secret: string, counter: number) {
  return createHotp(base32Decode(secret), counter);
}

function getTimeStep(date = Date.now()) {
  return Math.floor(date / 1000 / TOTP_PERIOD_SECONDS);
}

export function normalizeTotpCode(value: string) {
  const digitsOnly = value.replace(/\D/g, "");
  return /^\d{6}$/.test(digitsOnly) ? digitsOnly : null;
}

export function normalizeRecoveryCode(value: string) {
  const normalized = value.replace(/[^A-Za-z0-9]/g, "").toUpperCase();
  if (normalized.length !== 10) {
    return null;
  }

  return `${normalized.slice(0, 5)}-${normalized.slice(5)}`;
}

function formatSecretKey(secret: string) {
  return secret.match(/.{1,4}/g)?.join(" ") ?? secret;
}

function generateRecoveryCode() {
  const randomSecret = base32Encode(randomBytes(8)).slice(0, 10);
  return normalizeRecoveryCode(randomSecret) ?? `${randomSecret.slice(0, 5)}-${randomSecret.slice(5)}`;
}

export function createTwoFactorSetup(email: string) {
  const secret = base32Encode(randomBytes(SECRET_BYTE_LENGTH));
  const issuer = process.env.TWO_FACTOR_ISSUER?.trim() || "Defacto Institute Admin";
  const label = encodeURIComponent(`${issuer}:${email}`);
  const otpauthUrl =
    `otpauth://totp/${label}` +
    `?secret=${secret}&issuer=${encodeURIComponent(issuer)}&algorithm=SHA1&digits=${TOTP_DIGITS}&period=${TOTP_PERIOD_SECONDS}`;

  return {
    secret,
    secretKey: formatSecretKey(secret),
    otpauthUrl,
    backupCodes: Array.from({ length: BACKUP_CODE_COUNT }, () => generateRecoveryCode()),
  };
}

export function encryptTwoFactorSecret(secret: string) {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", getTwoFactorEncryptionKey(), iv);
  const encrypted = Buffer.concat([cipher.update(secret, "utf8"), cipher.final()]);
  const authTag = cipher.getAuthTag();

  return [iv.toString("base64"), authTag.toString("base64"), encrypted.toString("base64")].join(".");
}

export function decryptTwoFactorSecret(payload: string) {
  const [ivBase64, tagBase64, encryptedBase64] = payload.split(".");

  if (!ivBase64 || !tagBase64 || !encryptedBase64) {
    throw new Error("Invalid two-factor payload.");
  }

  const decipher = createDecipheriv(
    "aes-256-gcm",
    getTwoFactorEncryptionKey(),
    Buffer.from(ivBase64, "base64"),
  );
  decipher.setAuthTag(Buffer.from(tagBase64, "base64"));

  return Buffer.concat([
    decipher.update(Buffer.from(encryptedBase64, "base64")),
    decipher.final(),
  ]).toString("utf8");
}

export function verifyTotpCode(secret: string, code: string, now = Date.now()) {
  const normalizedCode = normalizeTotpCode(code);
  if (!normalizedCode) {
    return false;
  }

  const step = getTimeStep(now);

  for (let offset = -TOTP_WINDOW_STEPS; offset <= TOTP_WINDOW_STEPS; offset += 1) {
    const candidate = createTotp(secret, step + offset);
    if (
      candidate.length === normalizedCode.length &&
      timingSafeEqual(Buffer.from(candidate), Buffer.from(normalizedCode))
    ) {
      return true;
    }
  }

  return false;
}

export async function hashBackupCodes(codes: string[]) {
  return Promise.all(codes.map((code) => bcrypt.hash(code, 10)));
}

export async function consumeRecoveryCode(code: string, hashes: string[]) {
  const normalizedCode = normalizeRecoveryCode(code);

  if (!normalizedCode || !hashes.length) {
    return {
      matched: false,
      remainingHashes: hashes,
    };
  }

  for (let index = 0; index < hashes.length; index += 1) {
    const currentHash = hashes[index];
    if (await bcrypt.compare(normalizedCode, currentHash)) {
      return {
        matched: true,
        remainingHashes: hashes.filter((_, hashIndex) => hashIndex !== index),
      };
    }
  }

  return {
    matched: false,
    remainingHashes: hashes,
  };
}
