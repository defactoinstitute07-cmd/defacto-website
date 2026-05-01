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
import Alumni from "../../../models/Alumni";

function mapAlumni(docs: any[]) {
  return docs.map((a) => ({
    id: String(a._id),
    name: a.name,
    achievement: a.achievement,
    passingYear: a.passingYear || "",
    sequence: a.sequence || 0,
    imageUrl: a.imageUrl,
    createdAt: a.created_at,
  }));
}

export async function GET() {
  try {
    await connectDB();
    const docs = await Alumni.find().sort({ sequence: 1, created_at: -1 }).lean();
    return NextResponse.json({ alumni: mapAlumni(docs) });
  } catch (error) {
    return handleRouteError(error, "Failed to load alumni.");
  }
}

export async function POST(request: NextRequest) {
  try {
    assertTrustedOrigin(request);
    await requireAdminUser(request);

    const body = await parseJsonObject(request);
    const name = readText(body.name, { field: "Name", min: 2, max: 100 });
    const achievement = readText(body.achievement, {
      field: "Achievement",
      min: 2,
      max: 200,
    });
    const imageUrl = readManagedImageUrl(body.imageUrl);
    const passingYear = body.passingYear ? String(body.passingYear).trim() : "";
    const sequence = body.sequence ? Number(body.sequence) : 0;

    await connectDB();
    await Alumni.create({ name, achievement, passingYear, sequence, imageUrl });

    const all = await Alumni.find().sort({ sequence: 1, created_at: -1 }).lean();
    return NextResponse.json({ alumni: mapAlumni(all) }, { status: 201 });
  } catch (error) {
    return handleRouteError(error, "Failed to add alumni.");
  }
}

export async function DELETE(request: NextRequest) {
  try {
    assertTrustedOrigin(request);
    await requireAdminUser(request);

    const body = await parseJsonObject(request);
    const id = readMongoId(body.id);

    await connectDB();
    const deleted = await Alumni.findByIdAndDelete(id);
    if (!deleted) {
      throw new NotFoundError("Alumni record not found.");
    }

    const all = await Alumni.find().sort({ sequence: 1, created_at: -1 }).lean();
    return NextResponse.json({ alumni: mapAlumni(all) });
  } catch (error) {
    return handleRouteError(error, "Failed to delete alumni.");
  }
}

export async function PUT(request: NextRequest) {
  try {
    assertTrustedOrigin(request);
    await requireAdminUser(request);

    const body = await parseJsonObject(request);
    const id = readMongoId(body.id);
    const name = readText(body.name, { field: "Name", min: 2, max: 100 });
    const achievement = readText(body.achievement, {
      field: "Achievement",
      min: 2,
      max: 200,
    });
    const imageUrl = readManagedImageUrl(body.imageUrl);
    const passingYear = body.passingYear ? String(body.passingYear).trim() : "";
    const sequence = body.sequence ? Number(body.sequence) : 0;

    await connectDB();
    const updated = await Alumni.findByIdAndUpdate(
      id,
      { name, achievement, passingYear, sequence, imageUrl },
      { new: true },
    );

    if (!updated) {
      throw new NotFoundError("Alumni record not found.");
    }

    const all = await Alumni.find().sort({ sequence: 1, created_at: -1 }).lean();
    return NextResponse.json({ alumni: mapAlumni(all) });
  } catch (error) {
    return handleRouteError(error, "Failed to update alumni.");
  }
}
