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

function mapTopper(t: any) {
  return {
    _id: String(t._id),
    name: t.name,
    board: t.board,
    studentClass: t.studentClass,
    percentage: t.percentage ?? null,
    imageUrl: t.imageUrl,
    created_at: t.created_at,
  };
}

export async function GET() {
  try {
    await connectDB();
    const toppers = await Topper.find()
      .sort({ percentage: -1, created_at: -1 })
      .lean();
    return NextResponse.json({ toppers: toppers.map(mapTopper) });
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
    const percentage =
      body.percentage !== undefined && body.percentage !== null && body.percentage !== ""
        ? Number(body.percentage)
        : undefined;

    await connectDB();
    const topper = await Topper.create({
      name,
      board,
      studentClass,
      percentage,
      imageUrl,
    });

    const all = await Topper.find().sort({ percentage: -1, created_at: -1 }).lean();
    return NextResponse.json({ topper: mapTopper(topper), toppers: all.map(mapTopper) }, { status: 201 });
  } catch (error) {
    return handleRouteError(error, "Failed to add topper.");
  }
}

export async function PUT(request: NextRequest) {
  try {
    assertTrustedOrigin(request);
    await requireAdminUser(request);

    const body = await parseJsonObject(request);
    const id = readMongoId(body.id);
    const name = readText(body.name, { field: "Name", max: 100 });
    const board = readText(body.board, { field: "Board", max: 50 });
    const studentClass = readText(body.studentClass, { field: "Class", max: 50 });
    const imageUrl = readManagedImageUrl(body.imageUrl);
    const percentage =
      body.percentage !== undefined && body.percentage !== null && body.percentage !== ""
        ? Number(body.percentage)
        : undefined;

    await connectDB();

    // Build update: explicitly $unset percentage if not provided, so clearing works
    const updateDoc: Record<string, any> = {
      $set: { name, board, studentClass, imageUrl },
    };
    if (percentage !== undefined) {
      updateDoc.$set.percentage = percentage;
    } else {
      updateDoc.$unset = { percentage: "" };
    }

    const updated = await Topper.findByIdAndUpdate(id, updateDoc, { new: true });

    if (!updated) {
      throw new NotFoundError("Topper not found.");
    }

    const all = await Topper.find().sort({ percentage: -1, created_at: -1 }).lean();
    return NextResponse.json({ toppers: all.map(mapTopper) });
  } catch (error) {
    return handleRouteError(error, "Failed to update topper.");
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

    const all = await Topper.find().sort({ percentage: -1, created_at: -1 }).lean();
    return NextResponse.json({ toppers: all.map(mapTopper), ok: true });
  } catch (error) {
    return handleRouteError(error, "Failed to delete topper.");
  }
}
