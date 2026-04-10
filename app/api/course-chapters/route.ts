import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { handleRouteError, ValidationError } from "../../../lib/api-errors";
import { requireAdminUser } from "../../../lib/auth-session";
import { saveCourseChapterCatalog, getPublicCourseChapterCatalog } from "../../../lib/course-chapters";
import { COURSES_DATA } from "../../../lib/course-data";
import { assertTrustedOrigin } from "../../../lib/security";
import { parseJsonObject } from "../../../lib/validation";

export async function GET() {
  try {
    const catalog = await getPublicCourseChapterCatalog();
    return NextResponse.json({ catalog });
  } catch (error) {
    return handleRouteError(error, "Failed to load chapter tracker.");
  }
}

export async function PUT(request: NextRequest) {
  try {
    assertTrustedOrigin(request);
    const user = await requireAdminUser(request);
    const body = await parseJsonObject(request);

    if (!body.catalog || typeof body.catalog !== "object" || Array.isArray(body.catalog)) {
      throw new ValidationError("Missing chapter tracker payload.");
    }

    const result = await saveCourseChapterCatalog(body.catalog as never, user.id);

    revalidatePath("/courses");

    for (const course of COURSES_DATA) {
      revalidatePath(`/courses/${course.slug}`);
    }

    return NextResponse.json({
      ok: true,
      storage: result.storage,
      catalog: result.catalog,
    });
  } catch (error) {
    return handleRouteError(error, "Failed to update chapter tracker.");
  }
}
