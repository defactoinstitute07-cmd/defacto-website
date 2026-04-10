import { COURSES_DATA } from "./course-data";
import {
  type ChapterRecord,
  type ChapterStatus,
  type CourseChapterCatalog,
  type CourseChapterRecord,
  type SubjectChapterRecord,
} from "./course-chapters.types";

function sanitizeChapterText(value: string) {
  return value.replace(/\s+/g, " ").replace(/[<>]/g, "").trim();
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 72);
}

function cleanText(value: unknown, maxLength: number) {
  if (typeof value !== "string") {
    return "";
  }

  return sanitizeChapterText(value).slice(0, maxLength);
}

function buildChapterId(courseSlug: string, subjectName: string, title: string, index: number) {
  const chapterSlug = slugify(title) || `chapter-${index + 1}`;
  return `${courseSlug}-${slugify(subjectName)}-${chapterSlug}`.slice(0, 120);
}

function normalizeChapters(
  value: unknown,
  courseSlug: string,
  subjectName: string,
): ChapterRecord[] {
  if (!Array.isArray(value)) {
    return [];
  }

  const chapters: ChapterRecord[] = [];
  const usedIds = new Set<string>();

  value.slice(0, 80).forEach((item, index) => {
    if (!item || typeof item !== "object" || Array.isArray(item)) {
      return;
    }

    const rawChapter = item as Record<string, unknown>;
    const title = cleanText(rawChapter.title, 120);

    if (!title) {
      return;
    }

    const rawId = cleanText(rawChapter.id, 120);
    let id = slugify(rawId) || buildChapterId(courseSlug, subjectName, title, index);

    while (usedIds.has(id)) {
      id = `${id}-${index + 1}`.slice(0, 120);
    }

    usedIds.add(id);

    const status: ChapterStatus = rawChapter.status === "completed" ? "completed" : "ongoing";

    chapters.push({
      id,
      title,
      status,
    });
  });

  return chapters;
}

function getRawCourseRecord(value: unknown, courseSlug: string) {
  if (!Array.isArray(value)) {
    return null;
  }

  return (
    value.find((item) => {
      if (!item || typeof item !== "object" || Array.isArray(item)) {
        return false;
      }

      return cleanText((item as Record<string, unknown>).courseSlug, 140) === courseSlug;
    }) ?? null
  );
}

function getRawSubjectRecord(value: unknown, subjectName: string) {
  if (!Array.isArray(value)) {
    return null;
  }

  return (
    value.find((item) => {
      if (!item || typeof item !== "object" || Array.isArray(item)) {
        return false;
      }

      return cleanText((item as Record<string, unknown>).subjectName, 120) === subjectName;
    }) ?? null
  );
}

export function createDefaultCourseChapterCatalog(): CourseChapterCatalog {
  return {
    courses: COURSES_DATA.map<CourseChapterRecord>((course) => ({
      courseSlug: course.slug,
      subjects: course.subjects.map<SubjectChapterRecord>((subjectName) => ({
        subjectName,
        chapters: [],
      })),
    })),
  };
}

export function normalizeCourseChapterCatalog(value: unknown): CourseChapterCatalog {
  const defaults = createDefaultCourseChapterCatalog();

  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return defaults;
  }

  const rawCourses = (value as { courses?: unknown }).courses;

  return {
    courses: defaults.courses.map((defaultCourse) => {
      const rawCourse = getRawCourseRecord(rawCourses, defaultCourse.courseSlug) as
        | { subjects?: unknown }
        | null;

      return {
        courseSlug: defaultCourse.courseSlug,
        subjects: defaultCourse.subjects.map((defaultSubject) => {
          const rawSubject = getRawSubjectRecord(
            rawCourse?.subjects,
            defaultSubject.subjectName,
          ) as { chapters?: unknown } | null;

          return {
            subjectName: defaultSubject.subjectName,
            chapters: normalizeChapters(
              rawSubject?.chapters,
              defaultCourse.courseSlug,
              defaultSubject.subjectName,
            ),
          };
        }),
      };
    }),
  };
}
