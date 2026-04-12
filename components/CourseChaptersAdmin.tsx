"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { createDefaultCourseChapterCatalog } from "../lib/course-chapters-schema";
import { COURSES_DATA } from "../lib/course-data";
export type FacultyMember = {
  id: string;
  name: string;
};
import type {
  CourseChapterCatalog,
  SubjectChapterRecord,
} from "../lib/course-chapters.types";

export default function CourseChaptersAdmin() {
  const [catalog, setCatalog] = useState<CourseChapterCatalog>(createDefaultCourseChapterCatalog());
  const [faculty, setFaculty] = useState<FacultyMember[]>([]);
  const [selectedCourseSlug, setSelectedCourseSlug] = useState(COURSES_DATA[0]?.slug ?? "");
  const [statusMessage, setStatusMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function init() {
      await Promise.all([fetchCatalog(), fetchFaculty()]);
      setIsLoading(false);
    }
    void init();
  }, []);

  async function fetchFaculty() {
    try {
      const response = await fetch("/api/faculty", { cache: "no-store" });
      const payload = (await response.json()) as { faculty?: FacultyMember[] };
      if (response.ok && payload.faculty) {
        setFaculty(payload.faculty);
      }
    } catch {
      console.error("Failed to load faculty list for assignments.");
    }
  }

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

  function updateCourse(
    courseSlug: string,
    updater: (course: any) => any,
  ) {
    setCatalog((current) => ({
      courses: current.courses.map((course) =>
        course.courseSlug !== courseSlug ? course : updater(course),
      ),
    }));
  }

  function handleBatchTeacherChange(courseSlug: string, teacherIds: string[]) {
    updateCourse(courseSlug, (course) => ({
      ...course,
      assignedTeacherIds: teacherIds,
    }));
  }

  function updateSubject(
    courseSlug: string,
    subjectName: string,
    updater: (subject: SubjectChapterRecord) => SubjectChapterRecord,
  ) {
    updateCourse(courseSlug, (course) => ({
      ...course,
      subjects: course.subjects.map((subject: SubjectChapterRecord) =>
        subject.subjectName !== subjectName ? subject : updater(subject),
      ),
    }));
  }

  function updateResults(
    courseSlug: string,
    updater: (results: any) => any,
  ) {
    updateCourse(courseSlug, (course) => {
      const currentResults = course.results || { year: "", percentage: "", highlight: "", stats: [] };
      return {
        ...course,
        results: updater(currentResults),
      };
    });
  }

  function handleTeacherChange(courseSlug: string, subjectName: string, teacherId: string) {
    updateSubject(courseSlug, subjectName, (subject) => ({
      ...subject,
      assignedTeacherId: teacherId || null,
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
        payload.storage === "mongodb"
          ? "Assignments saved successfully to MongoDB."
          : "Assignments updated successfully.",
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
    <section className="mx-auto max-w-6xl py-8 px-4 sm:px-6 text-slate-900">
      <form
        onSubmit={handleSave}
        className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white/80 shadow-xl backdrop-blur-xl transition-all hover:bg-white"
      >
        <div className="border-b border-slate-200 px-6 sm:px-8 py-7">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-2xl">
              <div className="mb-4 inline-flex rounded-2xl bg-amber-100 p-3 text-amber-600">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-slate-900">Course Management</h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Manage faculty assignments and academic performance results (Academic Excellence) per course batch.
              </p>
            </div>

            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center justify-center rounded-2xl bg-amber-400 px-6 py-3 text-sm font-black text-slate-900 shadow-lg shadow-amber-400/20 transition hover:bg-amber-500 disabled:cursor-not-allowed disabled:opacity-50 disabled:grayscale"
            >
              {isSaving ? "Saving..." : "Save Assignments"}
            </button>
          </div>

          {statusMessage && (
            <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-bold text-amber-800 shadow-sm">
              {statusMessage}
            </div>
          )}
        </div>

        <div className="border-b border-slate-200 bg-slate-50/50 px-6 sm:px-8 py-6">
          <div className="flex flex-wrap gap-3">
            {COURSES_DATA.map((course) => {
              const isActive = course.slug === selectedCourse?.courseSlug;

              return (
                <button
                  key={course.slug}
                  type="button"
                  onClick={() => setSelectedCourseSlug(course.slug)}
                  className={`rounded-2xl border px-5 py-3 text-left transition-all shadow-sm ${isActive
                    ? "border-amber-400 bg-amber-400 text-slate-900 shadow-md shadow-amber-400/20 scale-[1.02]"
                    : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                >
                  <div className="text-sm font-black">{course.title}</div>
                  <div
                    className={`mt-0.5 text-xs font-bold uppercase tracking-[0.18em] ${isActive ? "text-slate-900/70" : "text-slate-400"
                      }`}
                  >
                    {course.variant}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="px-4 sm:px-8 py-8">
          {selectedCourse && selectedCourseMeta ? (
            <div className="space-y-6">
              <div className="flex flex-col gap-3 rounded-[1.75rem] border border-slate-200 bg-white px-6 py-5 md:flex-row md:items-center md:justify-between shadow-sm">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-slate-900">
                    {selectedCourseMeta.title} {selectedCourseMeta.variant}
                  </h3>
                  <div className="mt-4">
                    <label className="block text-xs font-black uppercase tracking-[0.18em] text-slate-400 mb-2">
                      Batch Faculty Members
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {faculty.map((member) => {
                        const isAssigned = (selectedCourse as any).assignedTeacherIds?.includes(member.id);
                        return (
                          <button
                            key={member.id}
                            type="button"
                            onClick={() => {
                              const currentIds = (selectedCourse as any).assignedTeacherIds || [];
                              const nextIds = isAssigned
                                ? currentIds.filter((id: string) => id !== member.id)
                                : [...currentIds, member.id];
                              handleBatchTeacherChange(selectedCourse.courseSlug, nextIds);
                            }}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${isAssigned
                              ? "bg-amber-400 border-amber-400 text-slate-900"
                              : "bg-white border-slate-200 text-slate-500 hover:border-slate-300"
                              }`}
                          >
                            {member.name}
                          </button>
                        );
                      })}
                      {faculty.length === 0 && (
                        <p className="text-xs text-slate-400 italic">No faculty available to assign.</p>
                      )}
                    </div>
                  </div>
                </div>
                <p className="max-w-xl text-sm leading-6 text-slate-500">
                  Select a faculty member for each individual subject if necessary.
                  These subject-level assignments override the batch-level assignments.
                </p>
              </div>

              <div className="grid gap-6 xl:grid-cols-2">
                {selectedCourse.subjects.map((subject) => {
                  return (
                    <div
                      key={subject.subjectName}
                      className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md"
                    >
                      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div className="flex-1 min-w-0">
                          <h4 className="text-lg font-bold text-slate-900 truncate">{subject.subjectName}</h4>
                        </div>
                        <div className="relative min-w-[200px]">
                          <select
                            value={subject.assignedTeacherId || ""}
                            onChange={(e) =>
                              handleTeacherChange(
                                selectedCourse.courseSlug,
                                subject.subjectName,
                                e.target.value,
                              )
                            }
                            className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 pr-10 text-xs font-bold text-slate-700 outline-none transition hover:border-slate-300 focus:border-amber-400 focus:ring-4 focus:ring-amber-400/10"
                          >
                            <option value="">No specific faculty</option>
                            {faculty.map((member) => (
                              <option key={member.id} value={member.id}>
                                {member.name}
                              </option>
                            ))}
                          </select>
                          <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-400">
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {selectedCourse.results && (
                <div className="mt-10 rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
                  <h3 className="text-xl font-bold text-slate-900 mb-6">Academic Excellence (Results)</h3>
                  
                  <div className="grid gap-6 md:grid-cols-2 mb-6">
                    <div>
                      <label className="block text-xs font-black uppercase tracking-[0.18em] text-slate-400 mb-2">
                        Reporting Year
                      </label>
                      <input
                        value={selectedCourse.results.year}
                        onChange={(e) => updateResults(selectedCourse.courseSlug, r => ({ ...r, year: e.target.value }))}
                        placeholder="e.g. 2024-25"
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-900 outline-none transition focus:border-amber-400 focus:bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-black uppercase tracking-[0.18em] text-slate-400 mb-2">
                        Overall Percentage
                      </label>
                      <input
                        value={selectedCourse.results.percentage}
                        onChange={(e) => updateResults(selectedCourse.courseSlug, r => ({ ...r, percentage: e.target.value }))}
                        placeholder="e.g. 96%"
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-900 outline-none transition focus:border-amber-400 focus:bg-white"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-black uppercase tracking-[0.18em] text-slate-400 mb-2">
                        Highlight Description
                      </label>
                      <textarea
                        value={selectedCourse.results.highlight}
                        onChange={(e) => updateResults(selectedCourse.courseSlug, r => ({ ...r, highlight: e.target.value }))}
                        rows={2}
                        placeholder="e.g. Excellent academic performance..."
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-900 outline-none transition focus:border-amber-400 focus:bg-white resize-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-black uppercase tracking-[0.18em] text-slate-400 mb-3 block">
                      Results Statistics
                    </label>
                    <div className="space-y-3">
                      {selectedCourse.results.stats.map((stat, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                          <input
                            value={stat.label}
                            onChange={(e) => updateResults(selectedCourse.courseSlug, r => {
                              const newStats = [...r.stats];
                              newStats[idx] = { ...newStats[idx], label: e.target.value };
                              return { ...r, stats: newStats };
                            })}
                            placeholder="Stat Label (e.g. Distinctions)"
                            className="flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-900 outline-none focus:border-amber-400 focus:bg-white"
                          />
                          <input
                            value={stat.value}
                            onChange={(e) => updateResults(selectedCourse.courseSlug, r => {
                              const newStats = [...r.stats];
                              newStats[idx] = { ...newStats[idx], value: e.target.value };
                              return { ...r, stats: newStats };
                            })}
                            placeholder="Stat Value (e.g. 25+)"
                            className="w-32 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-900 outline-none focus:border-amber-400 focus:bg-white"
                          />
                          <button
                            type="button"
                            onClick={() => updateResults(selectedCourse.courseSlug, r => ({
                              ...r,
                              stats: r.stats.filter((_: any, i: number) => i !== idx)
                            }))}
                            className="text-xs font-bold text-rose-500 hover:text-rose-600 uppercase tracking-wider p-3"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                      
                      <button
                        type="button"
                        onClick={() => updateResults(selectedCourse.courseSlug, r => ({
                          ...r,
                          stats: [...r.stats, { label: "", value: "" }]
                        }))}
                        className="text-xs mt-2 font-bold text-amber-600 hover:text-amber-700 uppercase tracking-wider"
                      >
                        + Add Statistic
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-8 text-sm text-slate-500 text-center shadow-sm">
              No courses are selected or available for faculty tracking yet.
            </div>
          )}
        </div>
      </form>
    </section>
  );
}
