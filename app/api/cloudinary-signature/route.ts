import { createHash } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { ValidationError, handleRouteError } from "../../../lib/api-errors";
import { requireAdminUser } from "../../../lib/auth-session";
import {
  CLOUDINARY_MAX_IMAGE_BYTES,
  getAllowedCloudinaryFolders,
  getCloudinaryAllowedFormatsValue,
} from "../../../lib/media-upload";
import { assertTrustedOrigin } from "../../../lib/security";
import { parseJsonObject, readCloudinaryFolder } from "../../../lib/validation";

export async function POST(request: NextRequest) {
  try {
    assertTrustedOrigin(request);
    await requireAdminUser(request);

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      return NextResponse.json(
        {
          error:
            "Cloudinary is not configured. Add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET.",
        },
        { status: 503 },
      );
    }

    let folder = process.env.CLOUDINARY_UPLOAD_FOLDER || "de-facto";

    try {
      const body = await parseJsonObject(request);
      folder = readCloudinaryFolder(body.folder, folder);
    } catch {
      folder = readCloudinaryFolder(undefined, folder);
    }

    const allowedFolders = getAllowedCloudinaryFolders(process.env.CLOUDINARY_UPLOAD_FOLDER);
    if (!allowedFolders.has(folder)) {
      throw new ValidationError("Uploads to this folder are not allowed.");
    }

    const timestamp = Math.floor(Date.now() / 1000);
    const allowedFormats = getCloudinaryAllowedFormatsValue();
    const signatureBase = [
      ["allowed_formats", allowedFormats],
      ["folder", folder],
      ["max_file_size", String(CLOUDINARY_MAX_IMAGE_BYTES)],
      ["timestamp", String(timestamp)],
    ]
      .sort(([leftKey], [rightKey]) => leftKey.localeCompare(rightKey))
      .map(([key, value]) => `${key}=${value}`)
      .join("&");
    const signature = createHash("sha1").update(signatureBase + apiSecret).digest("hex");

    return NextResponse.json({
      cloudName,
      apiKey,
      allowedFormats: allowedFormats.split(","),
      folder,
      maxFileSize: CLOUDINARY_MAX_IMAGE_BYTES,
      timestamp,
      signature,
    });
  } catch (error) {
    return handleRouteError(error, "Failed to create Cloudinary upload signature.");
  }
}
