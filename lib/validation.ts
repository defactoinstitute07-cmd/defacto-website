import mongoose from "mongoose";
import { ValidationError } from "./api-errors";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CLOUDINARY_FOLDER_REGEX = /^[a-zA-Z0-9/_-]{1,80}$/;
const IMAGE_EXT_REGEX = /\.(avif|gif|jpe?g|png|svg|webp)(\?.*)?$/i;
const CLOUDINARY_HOST_REGEX = /^res\.cloudinary\.com$/i;

type TextOptions = {
  field: string;
  min?: number;
  max?: number;
  allowEmpty?: boolean;
  preserveLineBreaks?: boolean;
};

export function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (!value || typeof value !== "object") {
    return false;
  }

  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

export async function parseJsonObject(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    throw new ValidationError("Invalid JSON body.");
  }

  if (!isPlainObject(body)) {
    throw new ValidationError("Request body must be a JSON object.");
  }

  return body;
}

export function sanitizeText(value: string, preserveLineBreaks = false) {
  const normalized = preserveLineBreaks
    ? value.replace(/\r\n/g, "\n").replace(/[<>]/g, "").trim()
    : value.replace(/\s+/g, " ").replace(/[<>]/g, "").trim();

  return normalized;
}

export function readText(value: unknown, options: TextOptions) {
  if (typeof value !== "string") {
    throw new ValidationError(`${options.field} must be a string.`);
  }

  const normalized = sanitizeText(value, options.preserveLineBreaks);

  if (!options.allowEmpty && normalized.length === 0) {
    throw new ValidationError(`${options.field} is required.`);
  }

  if (options.min && normalized.length < options.min) {
    throw new ValidationError(`${options.field} must be at least ${options.min} characters.`);
  }

  if (options.max && normalized.length > options.max) {
    throw new ValidationError(`${options.field} must be at most ${options.max} characters.`);
  }

  return normalized;
}

export function readOptionalText(value: unknown, options: Omit<TextOptions, "allowEmpty">) {
  if (value === undefined || value === null || value === "") {
    return "";
  }

  return readText(value, { ...options, allowEmpty: true });
}

export function readEmail(value: unknown, field = "Email") {
  const email = readText(value, { field, min: 5, max: 160 }).toLowerCase();

  if (!EMAIL_REGEX.test(email)) {
    throw new ValidationError(`${field} must be a valid email address.`);
  }

  return email;
}

export function readPassword(value: unknown) {
  const password = readText(value, { field: "Password", min: 8, max: 72 });

  if (!/[A-Za-z]/.test(password) || !/\d/.test(password)) {
    throw new ValidationError("Password must include at least one letter and one number.");
  }

  return password;
}

export function readImageUrl(value: unknown, field = "Image URL", allowEmpty = false) {
  if (allowEmpty && (value === "" || value === null || value === undefined)) {
    return "";
  }

  if (typeof value !== "string") {
    throw new ValidationError(`${field} must be a string.`);
  }

  const urlValue = value.trim();

  let parsed: URL;
  try {
    parsed = new URL(urlValue);
  } catch {
    throw new ValidationError(`${field} must be a valid URL.`);
  }

  const isLocalDevUrl =
    parsed.protocol === "http:" &&
    ["localhost", "127.0.0.1"].includes(parsed.hostname);

  if (!isLocalDevUrl && parsed.protocol !== "https:") {
    throw new ValidationError(`${field} must use HTTPS.`);
  }

  if (
    !/res\.cloudinary\.com$/i.test(parsed.hostname) &&
    !IMAGE_EXT_REGEX.test(parsed.pathname)
  ) {
    throw new ValidationError(`${field} must point to an image file.`);
  }

  return parsed.toString();
}

export function readManagedImageUrl(value: unknown, field = "Image URL", allowEmpty = false) {
  const imageUrl = readImageUrl(value, field, allowEmpty);

  if (!imageUrl) {
    return imageUrl;
  }

  const parsed = new URL(imageUrl);
  if (!CLOUDINARY_HOST_REGEX.test(parsed.hostname)) {
    throw new ValidationError(`${field} must be a Cloudinary image URL.`);
  }

  return parsed.toString();
}

export function readMongoId(value: unknown, field = "ID") {
  if (typeof value !== "string" || !mongoose.isValidObjectId(value)) {
    throw new ValidationError(`${field} is invalid.`);
  }

  return value;
}

export function readTag(value: unknown) {
  const tag = readText(value ?? "trip", { field: "Tag", min: 3, max: 40 }).toLowerCase();
  const allowed = new Set(["trip", "social", "institute", "institute events"]);

  if (!allowed.has(tag)) {
    throw new ValidationError("Tag is invalid.");
  }

  return tag;
}

export function readCloudinaryFolder(value: unknown, fallbackFolder: string) {
  if (value === undefined || value === null || value === "") {
    return fallbackFolder;
  }

  const folder = readText(value, { field: "Folder", min: 1, max: 80 });

  if (!CLOUDINARY_FOLDER_REGEX.test(folder)) {
    throw new ValidationError("Folder contains invalid characters.");
  }

  return folder;
}

export function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
