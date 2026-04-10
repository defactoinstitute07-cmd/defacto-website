import {
  createDefaultCourseChapterCatalog,
  normalizeCourseChapterCatalog,
} from "./course-chapters-schema";
import {
  getLocalCourseChapterCatalog,
  saveLocalCourseChapterCatalog,
} from "./local-course-chapters-store";
import {
  createSupabasePublicClient,
  createSupabaseServiceClient,
  isSupabaseConfigured,
} from "./supabase/server";
import type { CourseChapterCatalog } from "./course-chapters.types";

const COURSE_CHAPTER_STORAGE_KEY = "courseChapterCatalog";

type SiteContentRow = {
  value: string | null;
};

export async function getPublicCourseChapterCatalog(): Promise<CourseChapterCatalog> {
  if (!isSupabaseConfigured()) {
    return getLocalCourseChapterCatalog();
  }

  try {
    const supabase = createSupabasePublicClient();
    const { data, error } = await supabase
      .from("site_content")
      .select("value")
      .eq("key", COURSE_CHAPTER_STORAGE_KEY)
      .maybeSingle();

    if (error || !data || typeof (data as SiteContentRow).value !== "string") {
      return getLocalCourseChapterCatalog();
    }

    return normalizeCourseChapterCatalog(JSON.parse((data as SiteContentRow).value || "{}"));
  } catch {
    return getLocalCourseChapterCatalog();
  }
}

export async function saveCourseChapterCatalog(
  catalog: CourseChapterCatalog,
  userId: string,
): Promise<{ catalog: CourseChapterCatalog; storage: "local" | "supabase" }> {
  const normalized = normalizeCourseChapterCatalog(catalog);

  if (!isSupabaseConfigured() || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    const localCatalog = await saveLocalCourseChapterCatalog(normalized);
    return { catalog: localCatalog, storage: "local" };
  }

  const supabase = createSupabaseServiceClient();
  const { error } = await supabase.from("site_content").upsert(
    {
      key: COURSE_CHAPTER_STORAGE_KEY,
      value: JSON.stringify(normalized),
      updated_by: userId,
    },
    { onConflict: "key" },
  );

  if (error) {
    const lowerMessage = error.message.toLowerCase();
    if (lowerMessage.includes("site_content") || error.code === "42P01") {
      const localCatalog = await saveLocalCourseChapterCatalog(normalized);
      return { catalog: localCatalog, storage: "local" };
    }

    throw new Error(`Failed to update chapter tracker: ${error.message}`);
  }

  return { catalog: normalized, storage: "supabase" };
}

export function getDefaultCourseChapterCatalog() {
  return createDefaultCourseChapterCatalog();
}
