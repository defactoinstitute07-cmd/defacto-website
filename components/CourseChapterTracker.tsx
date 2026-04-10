"use client";

import { useEffect, useMemo, useState } from "react";
import type {
  ChapterStatus,
  SubjectChapterRecord,
} from "../lib/course-chapters.types";

type StatusFilter = ChapterStatus | "all";

type CourseChapterTrackerProps = {
  subjects: SubjectChapterRecord[];
};

function getInitialSubject(subjects: SubjectChapterRecord[]) {
  return (
    subjects.find((subject) => subject.chapters.some((chapter) => chapter.status === "ongoing"))
      ?.subjectName ??
    subjects.find((subject) => subject.chapters.length > 0)?.subjectName ??
    subjects[0]?.subjectName ??
    ""
  );
}

export default function CourseChapterTracker({ subjects }: CourseChapterTrackerProps) {
  const [selectedSubjectName, setSelectedSubjectName] = useState(() => getInitialSubject(subjects));
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ongoing");

  useEffect(() => {
    if (!subjects.some((subject) => subject.subjectName === selectedSubjectName)) {
      setSelectedSubjectName(getInitialSubject(subjects));
    }
  }, [selectedSubjectName, subjects]);

  const selectedSubject = useMemo(
    () =>
      subjects.find((subject) => subject.subjectName === selectedSubjectName) ?? subjects[0] ?? null,
    [selectedSubjectName, subjects],
  );

  const totalChapters = useMemo(
    () => subjects.reduce((count, subject) => count + subject.chapters.length, 0),
    [subjects],
  );

  const ongoingCount = useMemo(
    () =>
      subjects.reduce(
        (count, subject) =>
          count + subject.chapters.filter((chapter) => chapter.status === "ongoing").length,
        0,
      ),
    [subjects],
  );

  const completedCount = totalChapters - ongoingCount;

  const filteredChapters = useMemo(() => {
    if (!selectedSubject) {
      return [];
    }

    return selectedSubject.chapters.filter((chapter) =>
      statusFilter === "all" ? true : chapter.status === statusFilter,
    );
  }, [selectedSubject, statusFilter]);

  if (!subjects.length) {
    return null;
  }

  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-2xl">
          <div className="mb-4 inline-flex rounded-full bg-slate-900 px-3 py-1 text-[10px] font-black uppercase tracking-[0.24em] text-white">
            Chapter Progress
          </div>
          <h2 className="text-3xl font-bold text-slate-900">Track Subject-Wise Chapters</h2>
          <p className="mt-3 text-sm leading-6 text-slate-500">
            Use the subject filter and the chapter status filter to see what is currently ongoing
            and what has already been completed.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3 rounded-[1.5rem] border border-slate-200 bg-slate-50 p-3 text-center text-sm">
          <div className="rounded-2xl bg-white px-4 py-3">
            <div className="text-2xl font-extrabold text-slate-900">{totalChapters}</div>
            <div className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
              Total
            </div>
          </div>
          <div className="rounded-2xl bg-amber-50 px-4 py-3">
            <div className="text-2xl font-extrabold text-amber-600">{ongoingCount}</div>
            <div className="text-[10px] font-black uppercase tracking-[0.18em] text-amber-500">
              Ongoing
            </div>
          </div>
          <div className="rounded-2xl bg-emerald-50 px-4 py-3">
            <div className="text-2xl font-extrabold text-emerald-600">{completedCount}</div>
            <div className="text-[10px] font-black uppercase tracking-[0.18em] text-emerald-500">
              Completed
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 space-y-6">
        <div>
          <div className="mb-3 text-xs font-black uppercase tracking-[0.18em] text-slate-400">
            Subject Filter
          </div>
          <div className="flex flex-wrap gap-3">
            {subjects.map((subject) => {
              const isActive = subject.subjectName === selectedSubject?.subjectName;

              return (
                <button
                  key={subject.subjectName}
                  type="button"
                  onClick={() => setSelectedSubjectName(subject.subjectName)}
                  className={`rounded-full border px-4 py-2 text-sm font-bold transition ${
                    isActive
                      ? "border-slate-900 bg-slate-900 text-white"
                      : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900"
                  }`}
                >
                  {subject.subjectName}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <div className="mb-3 text-xs font-black uppercase tracking-[0.18em] text-slate-400">
            Chapter Status
          </div>
          <div className="flex flex-wrap gap-3">
            {[
              { id: "ongoing", label: "Ongoing" },
              { id: "completed", label: "Completed" },
              { id: "all", label: "All Chapters" },
            ].map((filter) => {
              const isActive = filter.id === statusFilter;

              return (
                <button
                  key={filter.id}
                  type="button"
                  onClick={() => setStatusFilter(filter.id as StatusFilter)}
                  className={`rounded-full border px-4 py-2 text-sm font-bold transition ${
                    isActive
                      ? filter.id === "completed"
                        ? "border-emerald-200 bg-emerald-500 text-white"
                        : filter.id === "ongoing"
                          ? "border-amber-200 bg-amber-400 text-slate-950"
                          : "border-slate-900 bg-slate-900 text-white"
                      : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900"
                  }`}
                >
                  {filter.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50/80 p-6">
          <div className="mb-5 flex flex-col gap-3 border-b border-slate-200 pb-5 md:flex-row md:items-end md:justify-between">
            <div>
              <h3 className="text-2xl font-bold text-slate-900">
                {selectedSubject?.subjectName || "Chapter Tracker"}
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                {statusFilter === "all"
                  ? "Showing every chapter for this subject."
                  : `Showing ${statusFilter} chapters for this subject.`}
              </p>
            </div>
            <div className="inline-flex rounded-full bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-slate-500 shadow-sm">
              {filteredChapters.length} chapter{filteredChapters.length === 1 ? "" : "s"}
            </div>
          </div>

          {filteredChapters.length ? (
            <div className="grid gap-4 md:grid-cols-2">
              {filteredChapters.map((chapter, index) => (
                <div
                  key={chapter.id}
                  className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <span className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
                      Chapter {index + 1}
                    </span>
                    <span
                      className={`rounded-full px-3 py-1 text-[11px] font-black uppercase tracking-[0.16em] ${
                        chapter.status === "completed"
                          ? "bg-emerald-50 text-emerald-600"
                          : "bg-amber-50 text-amber-600"
                      }`}
                    >
                      {chapter.status}
                    </span>
                  </div>
                  <p className="text-base font-bold leading-7 text-slate-900">{chapter.title}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-[1.5rem] border border-dashed border-slate-300 bg-white px-5 py-8 text-sm leading-6 text-slate-500">
              {selectedSubject?.chapters.length
                ? `No ${statusFilter} chapters are marked for ${selectedSubject.subjectName} right now.`
                : `No chapters have been added for ${selectedSubject?.subjectName || "this subject"} yet.`}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
