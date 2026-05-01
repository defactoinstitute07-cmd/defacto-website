export const CLOUDINARY_ALLOWED_IMAGE_FORMATS = ["jpg", "jpeg", "png", "webp", "avif"] as const;
export const CLOUDINARY_ALLOWED_IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
] as const;
export const CLOUDINARY_MAX_IMAGE_BYTES = 10 * 1024 * 1024;

export function getAllowedCloudinaryFolders(defaultFolder?: string) {
  return new Set(
    [defaultFolder, "de-facto", "faculty", "student_trips", "toppers", "alumni"].filter(
      (value): value is string => Boolean(value),
    ),
  );
}

export function getCloudinaryAllowedFormatsValue() {
  return CLOUDINARY_ALLOWED_IMAGE_FORMATS.join(",");
}

export function isAllowedImageMimeType(mimeType: string) {
  return CLOUDINARY_ALLOWED_IMAGE_MIME_TYPES.includes(
    mimeType as (typeof CLOUDINARY_ALLOWED_IMAGE_MIME_TYPES)[number],
  );
}

export function isAllowedImageFile(file: { type?: string; size?: number }) {
  return (
    typeof file.type === "string" &&
    isAllowedImageMimeType(file.type) &&
    typeof file.size === "number" &&
    file.size > 0 &&
    file.size <= CLOUDINARY_MAX_IMAGE_BYTES
  );
}
