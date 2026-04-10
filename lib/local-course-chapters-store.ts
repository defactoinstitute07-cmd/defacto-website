import { promises as fs } from "node:fs";
import path from "node:path";
import {
  createDefaultCourseChapterCatalog,
  normalizeCourseChapterCatalog,
} from "./course-chapters-schema";
import type { CourseChapterCatalog } from "./course-chapters.types";

const localStorePath = path.join(process.cwd(), "data", "course-chapters.json");

type LocalPayload = {
  catalog: CourseChapterCatalog;
};

async function ensureLocalStoreExists() {
  try {
    await fs.access(localStorePath);
  } catch {
    await fs.mkdir(path.dirname(localStorePath), { recursive: true });
    const initialPayload: LocalPayload = {
      catalog: createDefaultCourseChapterCatalog(),
    };

    await fs.writeFile(localStorePath, JSON.stringify(initialPayload, null, 2), "utf-8");
  }
}

export async function getLocalCourseChapterCatalog(): Promise<CourseChapterCatalog> {
  await ensureLocalStoreExists();

  try {
    const raw = await fs.readFile(localStorePath, "utf-8");
    const parsed = JSON.parse(raw) as Partial<LocalPayload>;
    return normalizeCourseChapterCatalog(parsed.catalog);
  } catch {
    return createDefaultCourseChapterCatalog();
  }
}

export async function saveLocalCourseChapterCatalog(
  catalog: CourseChapterCatalog,
): Promise<CourseChapterCatalog> {
  const next = normalizeCourseChapterCatalog(catalog);
  const payload: LocalPayload = { catalog: next };

  await fs.writeFile(localStorePath, JSON.stringify(payload, null, 2), "utf-8");

  return next;
}
