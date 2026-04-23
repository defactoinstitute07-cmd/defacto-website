import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPublicCourseChapterCatalog } from "../../../lib/course-chapters";
import { COURSES_DATA } from "../../../lib/course-data";
import { getCloudinarySrcSet, getOptimizedImageUrl } from "../../../lib/image-utils";
import connectDB from "../../../lib/mongodb";
import { buildMetadata } from "../../../lib/seo";
import Faculty from "../../../models/Faculty";

export function generateStaticParams() {
  return COURSES_DATA.map((course) => ({
    id: course.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const course = COURSES_DATA.find((item) => item.slug === id);

  if (!course) {
    return buildMetadata({
      title: "Course Not Found",
      description: "The requested course page could not be found.",
      path: "/courses",
    });
  }

  return buildMetadata({
    title: `${course.title} ${course.variant} Course`,
    description: `${course.description} Learn ${course.subjects.join(", ")} with expert mentoring at Defacto Institute.`,
    path: `/courses/${course.slug}`,
    keywords: [course.title, course.variant, ...course.subjects, "Defacto Institute course"],
  });
}

export default async function CourseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const course = COURSES_DATA.find((c) => c.slug === id);

  if (!course) {
    notFound();
  }

  const chapterCatalog = await getPublicCourseChapterCatalog();
  const courseChapterRecord =
    chapterCatalog.courses.find((item) => item.courseSlug === course.slug) ?? {
      courseSlug: course.slug,
      subjects: course.subjects.map((subjectName) => ({
        subjectName,
        assignedTeacherId: null,
        chapters: [],
      })),
    };

  // Fetch all assigned faculty members for this batch
  await connectDB();
  const batchTeacherIds = courseChapterRecord.assignedTeacherIds || [];

  let displayTeachers: any[] = [];

  if (batchTeacherIds.length > 0) {
    const facultyDocs = await Faculty.find({ _id: { $in: batchTeacherIds } }).lean();
    if (facultyDocs.length > 0) {
      displayTeachers = facultyDocs.map((doc) => ({
        name: doc.name,
        designation: doc.designation,
        experience: doc.experience,
        imageUrl: doc.image_url,
      }));
    }
  }

  // Create a map for subject-specific teacher display
  const subjectTeacherMap = new Map<string, { name: string }>();
  const subjectTeacherIds = courseChapterRecord.subjects
    .map((s) => s.assignedTeacherId)
    .filter(Boolean) as string[];

  if (subjectTeacherIds.length > 0) {
    const facultyDocs = await Faculty.find({ _id: { $in: subjectTeacherIds } }).lean();
    facultyDocs.forEach(doc => {
      subjectTeacherMap.set(String(doc._id), { name: doc.name });
    });
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section
        className={`relative pt-14 pb-20 text-white overflow-hidden bg-gradient-to-br ${course.accentColor}`}
      >
        {/* Scientific Pattern Overlay */}
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 86c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zm66-3c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zm-46-15c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8zm0-44c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zm35 50c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zm26-58c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8z' fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
            backgroundSize: '120px 120px',
          }}
        />
        {/* Black Overlay */}
        <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[1px]" />
        <div className="relative z-10 mx-auto max-w-[1400px] px-5 sm:px-6 lg:px-8">
          <Link
            href="/#courses"
            className="inline-flex items-center text-white/80 hover:text-white mb-8 transition-colors group"
          >
            <svg className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            Back to All Courses
          </Link>
          <div className="max-w-3xl">
            <span className="inline-block px-4 py-1.5 text-xs font-bold tracking-[0.2em] uppercase bg-white/20 rounded-full border border-white/30 backdrop-blur-sm mb-6">
              {course.variant} Edition / Admissions Open 2026
            </span>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
              {course.title} <span className="text-white/70">Complete Package</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 leading-relaxed mb-10 max-w-2xl">
              {course.description}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href={`/contact?batch=${encodeURIComponent(`${course.title} (${course.variant})`)}`}
                className="px-8 py-4 mt-4 bg-white text-slate-900 font-bold rounded-2xl hover:bg-slate-100 transition-all hover:-translate-y-1 shadow-2xl"
              >
                Enroll in this Batch
              </Link>

            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-[1400px] px-5 py-20 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-16">

            {/* Core Subjects Section */}
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-8 flex items-center gap-3">
                <span className="w-2 h-8 bg-amber-400 rounded-full" />
                Specialized Core Subjects
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {courseChapterRecord.subjects.map((subject) => {
                  const teacherId = subject.assignedTeacherId;
                  const teacher = teacherId ? subjectTeacherMap.get(String(teacherId)) : null;

                  return (
                    <div key={subject.subjectName} className="flex items-center p-6 bg-white rounded-[0px] border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                      <div className={`p-4 rounded-2xl ${course.lightBg} ${course.iconColor} mr-5`}>
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-slate-900">{subject.subjectName}</h3>
                        <p className="text-sm text-slate-500">
                          {teacher ? `Mentored by ${teacher.name}` : "Expert conceptual learning"}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Teaching Faculty */}
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-8 flex items-center gap-3">
                <span className="w-2 h-8 bg-blue-500 rounded-full" />
                Expert Faculty
              </h2>
              {displayTeachers.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  {displayTeachers.map((teacher) => (
                    <div
                      key={teacher.name}
                      className="group flex flex-col sm:flex-row items-center text-center sm:text-left gap-4 sm:gap-6 p-6 bg-white rounded-[2rem] border border-slate-200 shadow-sm transition-all duration-300 hover:border-amber-300 hover:shadow-xl"
                    >
                      <div className="relative shrink-0">
                        <div className="w-24 h-24 rounded-full overflow-hidden ring-4 ring-slate-50 group-hover:ring-amber-100 transition-all duration-300">
                          <img
                            src={getOptimizedImageUrl(teacher.imageUrl, { width: 320 })}
                            srcSet={getCloudinarySrcSet(teacher.imageUrl, [160, 240, 320, 480])}
                            sizes="96px"
                            alt={teacher.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            loading="lazy"
                            decoding="async"
                          />
                        </div>

                      </div>

                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-slate-900 mb-0.5">{teacher.name}</h3>
                        <p className="text-xs font-bold text-amber-600 uppercase tracking-widest mb-1.5">
                          {teacher.designation}
                        </p>
                        {teacher.experience && (
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 text-amber-600 rounded-full border border-amber-100 mb-3 group-hover:bg-amber-100 transition-colors duration-300">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-[10px] font-bold whitespace-nowrap italic">
                              {teacher.experience} Experience
                            </span>
                          </div>
                        )}
                        <p className="text-xs text-slate-500 font-medium">Expert Mentor</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 bg-white border border-slate-200 rounded-2xl text-center text-slate-500 italic">
                  No faculty assigned to this batch yet.
                </div>
              )}
            </div>
          </div>

          {/* Sidebar / Results */}
          <div className="space-y-8">
            <div className="bg-slate-900 text-white rounded-[0px] p-8 relative overflow-hidden sticky top-8">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -tr-16 -rt-16" />
              <div className="relative z-10">
                <span className="text-amber-400 text-xs font-bold uppercase tracking-widest block mb-4">Academic Excellence</span>
                <h2 className="text-3xl font-bold mb-6">Last Year Results ({courseChapterRecord.results?.year})</h2>
                <div className="flex items-center gap-4 mb-8">
                  <div className="text-5xl font-extrabold text-amber-400">{courseChapterRecord.results?.percentage}</div>
                  <div className="text-sm text-slate-400 font-medium leading-tight">Average Board<br />Success Rate</div>
                </div>

                <div className="space-y-6 mb-10">
                  {courseChapterRecord.results?.stats?.map((stat) => (
                    <div key={stat.label} className="flex items-center justify-between border-b border-white/10 pb-4">
                      <span className="text-slate-400 font-medium">{stat.label}</span>
                      <span className="text-xl font-bold">{stat.value}</span>
                    </div>
                  ))}
                </div>

                <div className="bg-white/5 rounded-2xl p-6 border border-white/10 italic text-slate-300 text-sm leading-relaxed mb-8">
                  "{courseChapterRecord.results?.highlight}"
                </div>

                <Link
                  href="/contact"
                  className="w-full flex items-center justify-center p-4 bg-amber-400 text-slate-950 font-bold rounded-2xl hover:bg-amber-300 transition-all shadow-lg shadow-amber-400/20"
                >
                  Book a Consultation
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
