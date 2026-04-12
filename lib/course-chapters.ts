import {
  createDefaultCourseChapterCatalog,
  normalizeCourseChapterCatalog,
} from "./course-chapters-schema";
import connectDB from "./mongodb";
import SiteContent from "../models/SiteContent";
import type { CourseChapterCatalog } from "./course-chapters.types";

const COURSE_CHAPTER_STORAGE_KEY = "courseChapterCatalog";

type SiteContentRow = {
  value: string | null;
};

export async function getPublicCourseChapterCatalog(): Promise<CourseChapterCatalog> {
  try {
    await connectDB();
    const doc = await SiteContent.findOne({ key: COURSE_CHAPTER_STORAGE_KEY }).lean();

    if (!doc || typeof doc.value !== "string") {
      return createDefaultCourseChapterCatalog();
    }

    return normalizeCourseChapterCatalog(JSON.parse(doc.value || "{}"));
  } catch {
    return createDefaultCourseChapterCatalog();
  }
}

export async function saveCourseChapterCatalog(
  catalog: CourseChapterCatalog,
  userId: string,
): Promise<{ catalog: CourseChapterCatalog; storage: "mongodb" }> {
  const normalized = normalizeCourseChapterCatalog(catalog);

  try {
    await connectDB();
    await SiteContent.findOneAndUpdate(
      { key: COURSE_CHAPTER_STORAGE_KEY },
      {
        value: JSON.stringify(normalized),
        updated_by: userId,
      },
      { upsert: true, new: true },
    );

    return { catalog: normalized, storage: "mongodb" };
  } catch (error) {
    throw new Error(`Failed to update faculty assignments: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

export function getDefaultCourseChapterCatalog() {
  return createDefaultCourseChapterCatalog();
}
