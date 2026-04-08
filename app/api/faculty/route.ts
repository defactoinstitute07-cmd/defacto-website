import { NextRequest, NextResponse } from "next/server";
import { NotFoundError, handleRouteError } from "../../../lib/api-errors";
import { requireAdminUser } from "../../../lib/auth-session";
import connectDB from "../../../lib/mongodb";
import { assertTrustedOrigin } from "../../../lib/security";
import {
  parseJsonObject,
  readManagedImageUrl,
  readMongoId,
  readText,
} from "../../../lib/validation";
import Faculty from "../../../models/Faculty";

function mapFaculty(docs: any[]) {
  return docs.map((faculty) => ({
    id: String(faculty._id),
    name: faculty.name,
    designation: faculty.designation,
    imageUrl: faculty.image_url,
    createdAt: faculty.created_at,
  }));
}

export async function GET() {
  try {
    await connectDB();
    const docs = await Faculty.find().sort({ created_at: -1 }).lean();
    return NextResponse.json({ faculty: mapFaculty(docs) });
  } catch (error) {
    return handleRouteError(error, "Failed to load faculty.");
  }
}

export async function POST(request: NextRequest) {
  try {
    assertTrustedOrigin(request);
    await requireAdminUser(request);

    const body = await parseJsonObject(request);
    const name = readText(body.name, { field: "Name", min: 2, max: 80 });
    const designation = readText(body.designation, {
      field: "Designation",
      min: 2,
      max: 100,
    });
    const imageUrl = readManagedImageUrl(body.imageUrl);

    await connectDB();
    await Faculty.create({ name, designation, image_url: imageUrl });

    const all = await Faculty.find().sort({ created_at: -1 }).lean();
    return NextResponse.json({ faculty: mapFaculty(all) }, { status: 201 });
  } catch (error) {
    return handleRouteError(error, "Failed to create faculty profile.");
  }
}

export async function DELETE(request: NextRequest) {
  try {
    assertTrustedOrigin(request);
    await requireAdminUser(request);

    const body = await parseJsonObject(request);
    const id = readMongoId(body.id);

    await connectDB();
    const deletedFaculty = await Faculty.findByIdAndDelete(id);
    if (!deletedFaculty) {
      throw new NotFoundError("Faculty profile not found.");
    }

    const all = await Faculty.find().sort({ created_at: -1 }).lean();
    return NextResponse.json({ faculty: mapFaculty(all) });
  } catch (error) {
    return handleRouteError(error, "Failed to delete faculty profile.");
  }
}
