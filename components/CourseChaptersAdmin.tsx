"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { createDefaultCourseChapterCatalog } from "../lib/course-chapters-schema";
import { COURSES_DATA } from "../lib/course-data";
import type {
  ChapterStatus,
  CourseChapterCatalog,
  SubjectChapterRecord,
} from "../lib/course-chapters.types";

function createChapterId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `chapter-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export default function CourseChaptersAdmin() {
  const [catalog, setCatalog] = useState<CourseChapterCatalog>(createDefaultCourseChapterCatalog());
  const [selectedCourseSlug, setSelectedCourseSlug] = useState(COURSES_DATA[0]?.slug ?? "");
  const [statusMessage, setStatusMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    void fetchCatalog();
  }, []);

  async function fetchCatalog() {
    try {
      const response = await fetch("/api/course-chapters", { cache: "no-store" });
      const payload = (await response.json()) as {
        catalog?: CourseChapterCatalog;
        error?: string;
      };

      if (!response.ok) {
        setStatusMessage(payload.error || "Failed to load chapter tracker.");
        return;
      }

      if (payload.catalog) {
        setCatalog(payload.catalog);

        if (!selectedCourseSlug && payload.catalog.courses[0]?.courseSlug) {
          setSelectedCourseSlug(payload.catalog.courses[0].courseSlug);
        }
      }
    } catch {
      setStatusMessage("Failed to load chapter tracker.");
    } finally {
      setIsLoading(false);
    }
  }

  const selectedCourse = useMemo(
    () => catalog.courses.find((course) => course.courseSlug === selectedCourseSlug) ?? catalog.courses[0],
    [catalog, selectedCourseSlug],
  );

  const selectedCourseMeta = useMemo(
    () => COURSES_DATA.find((course) => course.slug === selectedCourse?.courseSlug),
    [selectedCourse],
  );

  useEffect(() => {
    if (selectedCourse || !catalog.courses[0]?.courseSlug) {
      return;
    }

    setSelectedCourseSlug(catalog.courses[0].courseSlug);
  }, [catalog.courses, selectedCourse]);

  function updateSubject(
    courseSlug: string,
    subjectName: string,
    updater: (subject: SubjectChapterRecord) => SubjectChapterRecord,
  ) {
    setCatalog((current) => ({
      courses: current.courses.map((course) =>
        course.courseSlug !== courseSlug
          ? course
          : {
              ...course,
              subjects: course.subjects.map((subject) =>
                subject.subjectName !== subjectName ? subject : updater(subject),
              ),
            },
      ),
    }));
  }

  function handleAddChapter(courseSlug: string, subjectName: string) {
    updateSubject(courseSlug, subjectName, (subject) => ({
      ...subject,
      chapters: [
        ...subject.chapters,
        {
          id: createChapterId(),
          title: "",
          status: "ongoing",
        },
      ],
    }));
  }

  function handleChapterTitleChange(
    courseSlug: string,
    subjectName: string,
    chapterId: string,
    title: string,
  ) {
    updateSubject(courseSlug, subjectName, (subject) => ({
      ...subject,
      chapters: subject.chapters.map((chapter) =>
        chapter.id === chapterId ? { ...chapter, title } : chapter,
      ),
    }));
  }

  function handleStatusChange(
    courseSlug: string,
    subjectName: string,
    chapterId: string,
    status: ChapterStatus,
  ) {
    updateSubject(courseSlug, subjectName, (subject) => ({
      ...subject,
      chapters: subject.chapters.map((chapter) =>
        chapter.id === chapterId ? { ...chapter, status } : chapter,
      ),
    }));
  }

  function handleRemoveChapter(courseSlug: string, subjectName: string, chapterId: string) {
    updateSubject(courseSlug, subjectName, (subject) => ({
      ...subject,
      chapters: subject.chapters.filter((chapter) => chapter.id !== chapterId),
    }));
  }

  async function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setStatusMessage("Saving chapter tracker...");

    try {
      const response = await fetch("/api/course-chapters", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ catalog }),
      });

      const payload = (await response.json()) as {
        catalog?: CourseChapterCatalog;
        error?: string;
        storage?: string;
      };

      if (!response.ok) {
        setStatusMessage(payload.error || "Failed to save chapter tracker.");
        return;
      }

      if (payload.catalog) {
        setCatalog(payload.catalog);
      }

      setStatusMessage(
        payload.storage === "local"
          ? "Chapter tracker saved locally."
          : "Chapter tracker updated successfully.",
      );
    } catch {
      setStatusMessage("Failed to save chapter tracker.");
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16 text-sm font-bold text-slate-400">
        Loading chapter tracker...
      </div>
    );
  }

  return (
    <section className="mx-auto max-w-6xl py-8 text-slate-100">
      <form
        onSubmit={handleSave}
        className="overflow-hidden rounded-[2rem] border border-white/5 bg-slate-900/50 shadow-2xl backdrop-blur-xl"
      >
        <div className="border-b border-white/5 px-8 py-7">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-2xl">
              <div className="mb-4 inline-flex rounded-2xl bg-amber-400/10 p-3 text-amber-400">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white">Chapter Tracker</h2>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                Add chapters under each subject and mark every chapter as either ongoing or
                completed. The course pages will use these statuses for the public filters.
              </p>
            </div>

            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center justify-center rounded-2xl bg-amber-400 px-6 py-3 text-sm font-black text-slate-950 shadow-xl shadow-amber-400/10 transition hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {isSaving ? "Saving..." : "Save Chapter Tracker"}
            </button>
          </div>

          {statusMessage && (
            <div className="mt-5 rounded-2xl border border-amber-400/20 bg-amber-400/10 px-4 py-3 text-sm font-bold text-amber-200">
              {statusMessage}
            </div>
          )}
        </div>

        <div className="border-b border-white/5 px-8 py-6">
          <div className="flex flex-wrap gap-3">
            {COURSES_DATA.map((course) => {
              const isActive = course.slug === selectedCourse?.courseSlug;

              return (
                <button
                  key={course.slug}
                  type="button"
                  onClick={() => setSelectedCourseSlug(course.slug)}
                  className={`rounded-2xl border px-4 py-3 text-left transition ${
                    isActive
                      ? "border-amber-400/20 bg-amber-400 text-slate-950 shadow-lg shadow-amber-400/10"
                      : "border-white/5 bg-slate-800/50 text-slate-300 hover:border-white/10 hover:bg-slate-800"
                  }`}
                >
                  <div className="text-sm font-black">{course.title}</div>
                  <div
                    className={`text-xs font-bold uppercase tracking-[0.18em] ${
                      isActive ? "text-slate-900/70" : "text-slate-500"
                    }`}
                  >
                    {course.variant}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="px-8 py-8">
          {selectedCourse && selectedCourseMeta ? (
            <div className="space-y-6">
              <div className="flex flex-col gap-3 rounded-[1.75rem] border border-white/5 bg-slate-950/40 px-6 py-5 md:flex-row md:items-center md:justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white">
                    {selectedCourseMeta.title} {selectedCourseMeta.variant}
                  </h3>
                  <p className="mt-1 text-sm text-slate-400">
                    {selectedCourse.subjects.reduce(
                      (count, subject) => count + subject.chapters.length,
                      0,
                    )}{" "}
                    chapters configured across {selectedCourse.subjects.length} subjects.
                  </p>
                </div>
                <p className="max-w-xl text-sm leading-6 text-slate-500">
                  Keep chapter names short and clear. Visitors will be able to filter these
                  chapters by subject and status on the course details page.
                </p>
              </div>

              <div className="grid gap-6 xl:grid-cols-2">
                {selectedCourse.subjects.map((subject) => {
                  const ongoingCount = subject.chapters.filter(
                    (chapter) => chapter.status === "ongoing",
                  ).length;
                  const completedCount = subject.chapters.length - ongoingCount;

                  return (
                    <div
                      key={subject.subjectName}
                      className="rounded-[1.75rem] border border-white/5 bg-slate-950/40 p-6"
                    >
                      <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                        <div>
                          <h4 className="text-lg font-bold text-white">{subject.subjectName}</h4>
                          <p className="mt-1 text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                            {ongoingCount} ongoing / {completedCount} completed
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            handleAddChapter(selectedCourse.courseSlug, subject.subjectName)
                          }
                          className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-white transition hover:border-white/20 hover:bg-white/10"
                        >
                          Add Chapter
                        </button>
                      </div>

                      <div className="space-y-3">
                        {subject.chapters.length ? (
                          subject.chapters.map((chapter, index) => (
                            <div
                              key={chapter.id}
                              className="rounded-2xl border border-white/5 bg-slate-900/70 p-4"
                            >
                              <div className="mb-3 flex items-center justify-between">
                                <span className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                                  Chapter {index + 1}
                                </span>
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleRemoveChapter(
                                      selectedCourse.courseSlug,
                                      subject.subjectName,
                                      chapter.id,
                                    )
                                  }
                                  className="text-[11px] font-black uppercase tracking-[0.16em] text-rose-400 transition hover:text-rose-300"
                                >
                                  Remove
                                </button>
                              </div>

                              <div className="space-y-3">
                                <input
                                  value={chapter.title}
                                  onChange={(event) =>
                                    handleChapterTitleChange(
                                      selectedCourse.courseSlug,
                                      subject.subjectName,
                                      chapter.id,
                                      event.target.value,
                                    )
                                  }
                                  placeholder="Enter chapter title"
                                  className="w-full rounded-2xl border border-white/5 bg-slate-800/50 px-4 py-3 text-sm font-medium text-white outline-none transition focus:border-amber-400/40 focus:ring-4 focus:ring-amber-400/10"
                                />

                                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                  <select
                                    value={chapter.status}
                                    onChange={(event) =>
                                      handleStatusChange(
                                        selectedCourse.courseSlug,
                                        subject.subjectName,
                                        chapter.id,
                                        event.target.value as ChapterStatus,
                                      )
                                    }
                                    className="rounded-2xl border border-white/5 bg-slate-800/50 px-4 py-3 text-sm font-bold text-white outline-none transition focus:border-amber-400/40 focus:ring-4 focus:ring-amber-400/10"
                                  >
                                    <option value="ongoing">Ongoing</option>
                                    <option value="completed">Completed</option>
                                  </select>

                                  <div
                                    className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-black uppercase tracking-[0.16em] ${
                                      chapter.status === "completed"
                                        ? "bg-emerald-400/10 text-emerald-300"
                                        : "bg-amber-400/10 text-amber-300"
                                    }`}
                                  >
                                    {chapter.status}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="rounded-2xl border border-dashed border-white/10 bg-slate-900/40 px-4 py-5 text-sm text-slate-500">
                            No chapters added yet for {subject.subjectName}. Use "Add Chapter" to
                            create one and set its status.
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-white/10 bg-slate-950/40 px-6 py-8 text-sm text-slate-500">
              No courses are available for chapter tracking yet.
            </div>
          )}
        </div>
      </form>
    </section>
  );
}
