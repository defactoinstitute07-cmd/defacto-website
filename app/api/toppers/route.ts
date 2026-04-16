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
import Topper from "../../../models/Topper";

export async function GET() {
  try {
    await connectDB();
    const toppers = await Topper.find().sort({ created_at: -1 }).lean();
    return NextResponse.json({ toppers });
  } catch (error) {
    return handleRouteError(error, "Failed to load toppers.");
  }
}

export async function POST(request: NextRequest) {
  try {
    assertTrustedOrigin(request);
    await requireAdminUser(request);

    const body = await parseJsonObject(request);
    const name = readText(body.name, { field: "Name", max: 100 });
    const board = readText(body.board, { field: "Board", max: 50 });
    const studentClass = readText(body.studentClass, { field: "Class", max: 50 });
    const imageUrl = readManagedImageUrl(body.imageUrl);

    await connectDB();
    const topper = await Topper.create({
      name,
      board,
      studentClass,
      imageUrl,
    });

    return NextResponse.json({ topper }, { status: 201 });
  } catch (error) {
    return handleRouteError(error, "Failed to add topper.");
  }
}

export async function DELETE(request: NextRequest) {
  try {
    assertTrustedOrigin(request);
    await requireAdminUser(request);

    const body = await parseJsonObject(request);
    const id = readMongoId(body.id);

    await connectDB();
    const deletedTopper = await Topper.findByIdAndDelete(id);
    if (!deletedTopper) {
      throw new NotFoundError("Topper not found.");
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    return handleRouteError(error, "Failed to delete topper.");
  }
}
