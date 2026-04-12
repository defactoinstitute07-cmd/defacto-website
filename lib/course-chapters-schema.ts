import { COURSES_DATA } from "./course-data";
import {
  type CourseChapterCatalog,
  type CourseChapterRecord,
  type SubjectChapterRecord,
  type CourseResultsRecord,
} from "./course-chapters.types";

function sanitizeText(value: string) {
  return value.replace(/\s+/g, " ").replace(/[<>]/g, "").trim();
}

function cleanText(value: unknown, maxLength: number) {
  if (typeof value !== "string") {
    return "";
  }

  return sanitizeText(value).slice(0, maxLength);
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
      assignedTeacherIds: [],
      subjects: course.subjects.map<SubjectChapterRecord>((subjectName) => ({
        subjectName,
        assignedTeacherId: null,
      })),
      results: course.results,
    })),
  };
}

export function normalizeCourseChapterCatalog(value: unknown): CourseChapterCatalog {
  const defaults = createDefaultCourseChapterCatalog();

  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return defaults;
  }

  const rawCourses = (value as { courses?: unknown }).courses;
  const catalogMap = new Map(
    Array.isArray(rawCourses)
      ? rawCourses
          .filter((c): c is Record<string, unknown> => !!c && typeof c === "object")
          .map((c) => [c.courseSlug, c])
      : [],
  );

  return {
    courses: defaults.courses.map((defaultCourse) => {
      const rawCourse = catalogMap.get(
        defaultCourse.courseSlug,
      ) as Record<string, unknown>;

      return {
        courseSlug: defaultCourse.courseSlug,
        assignedTeacherIds: Array.isArray(rawCourse?.assignedTeacherIds)
          ? rawCourse.assignedTeacherIds.filter(
              (id): id is string => typeof id === "string",
            )
          : [],
        subjects: defaultCourse.subjects.map((defaultSubject) => {
          const rawSubject = getRawSubjectRecord(
            rawCourse?.subjects,
            defaultSubject.subjectName,
          );

          return {
            subjectName: defaultSubject.subjectName,
            assignedTeacherId: cleanText(
              (rawSubject as Record<string, unknown>)?.assignedTeacherId,
              120,
            ) || null,
          };
        }),
        results: (rawCourse?.results as CourseResultsRecord) || defaultCourse.results,
      };
    }),
  };
}
