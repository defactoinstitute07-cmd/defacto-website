import { NextRequest, NextResponse } from "next/server";
import { NotFoundError, handleRouteError } from "../../../lib/api-errors";
import { requireAdminUser } from "../../../lib/auth-session";
import connectDB from "../../../lib/mongodb";
import { assertTrustedOrigin } from "../../../lib/security";
import {
  parseJsonObject,
  readManagedImageUrl,
  readMongoId,
  readOptionalText,
  readTag,
} from "../../../lib/validation";
import GalleryItem from "../../../models/GalleryItem";

export async function GET() {
  try {
    await connectDB();
    const items = await GalleryItem.find().sort({ created_at: -1 }).lean();
    return NextResponse.json({ gallery: items });
  } catch (error) {
    return handleRouteError(error, "Failed to load gallery.");
  }
}

export async function POST(request: NextRequest) {
  try {
    assertTrustedOrigin(request);
    await requireAdminUser(request);

    const body = await parseJsonObject(request);
    const imageUrl = readManagedImageUrl(body.imageUrl);
    const caption = readOptionalText(body.caption, {
      field: "Caption",
      max: 160,
    });
    const tag = readTag(body.tag);

    await connectDB();
    const item = await GalleryItem.create({
      image_url: imageUrl,
      caption,
      tag,
    });

    return NextResponse.json({ item }, { status: 201 });
  } catch (error) {
    return handleRouteError(error, "Failed to create gallery item.");
  }
}

export async function DELETE(request: NextRequest) {
  try {
    assertTrustedOrigin(request);
    await requireAdminUser(request);

    const body = await parseJsonObject(request);
    const id = readMongoId(body.id);

    await connectDB();
    const deletedItem = await GalleryItem.findByIdAndDelete(id);
    if (!deletedItem) {
      throw new NotFoundError("Gallery item not found.");
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    return handleRouteError(error, "Failed to delete gallery item.");
  }
}
