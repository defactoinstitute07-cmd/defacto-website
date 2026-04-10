import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CourseChapterTracker from "../../../components/CourseChapterTracker";
import { getPublicCourseChapterCatalog } from "../../../lib/course-chapters";
import { COURSES_DATA } from "../../../lib/course-data";
import { getCloudinarySrcSet, getOptimizedImageUrl } from "../../../lib/image-utils";
import { buildMetadata } from "../../../lib/seo";

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
        chapters: [],
      })),
    };

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
                className="px-8 py-4 bg-white text-slate-900 font-bold rounded-2xl hover:bg-slate-100 transition-all hover:-translate-y-1 shadow-2xl"
              >
                Enroll in this Batch
              </Link>
              <button className="px-8 py-4 bg-transparent border-2 border-white/30 text-white font-bold rounded-2xl hover:bg-white/10 transition-all">
                Download Curriculum
              </button>
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
                {course.subjects.map((subject) => (
                  <div key={subject} className="flex items-center p-6 bg-white rounded-[0px] border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className={`p-4 rounded-2xl ${course.lightBg} ${course.iconColor} mr-5`}>
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">{subject}</h3>
                      <p className="text-sm text-slate-500">In-depth conceptual learning</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <CourseChapterTracker subjects={courseChapterRecord.subjects} />

            {/* Teaching Faculty */}
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-8 flex items-center gap-3">
                <span className="w-2 h-8 bg-blue-500 rounded-full" />
                Expert Faculty
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {course.teachers.map((teacher) => (
                  <div key={teacher.name} className="group flex items-center gap-6 p-6 bg-white rounded-[0px] border border-slate-100 shadow-sm transition-all hover:border-blue-100 hover:shadow-xl">
                    <div className="relative">
                      <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-slate-50 group-hover:border-blue-50 transition-colors">
                        <img
                          src={getOptimizedImageUrl(teacher.imageUrl, { width: 320 })}
                          srcSet={getCloudinarySrcSet(teacher.imageUrl, [160, 240, 320, 480])}
                          sizes="96px"
                          alt={teacher.name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                          decoding="async"
                        />
                      </div>
                      <div className="absolute -bottom-2 -right-2 bg-blue-600 text-white p-1.5 rounded-full border-2 border-white">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" /></svg>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">{teacher.name}</h3>
                      <p className="text-sm text-blue-600 font-medium mb-1">{teacher.designation}</p>
                      <p className="text-xs text-slate-400">10+ Years Experience</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar / Results */}
          <div className="space-y-8">
            <div className="bg-slate-900 text-white rounded-[0px] p-8 relative overflow-hidden sticky top-8">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -tr-16 -rt-16" />
              <div className="relative z-10">
                <span className="text-amber-400 text-xs font-bold uppercase tracking-widest block mb-4">Academic Excellence</span>
                <h2 className="text-3xl font-bold mb-6">Last Year Results ({course.results.year})</h2>
                <div className="flex items-center gap-4 mb-8">
                  <div className="text-5xl font-extrabold text-amber-400">{course.results.percentage}</div>
                  <div className="text-sm text-slate-400 font-medium leading-tight">Average Board<br />Success Rate</div>
                </div>

                <div className="space-y-6 mb-10">
                  {course.results.stats.map((stat) => (
                    <div key={stat.label} className="flex items-center justify-between border-b border-white/10 pb-4">
                      <span className="text-slate-400 font-medium">{stat.label}</span>
                      <span className="text-xl font-bold">{stat.value}</span>
                    </div>
                  ))}
                </div>

                <div className="bg-white/5 rounded-2xl p-6 border border-white/10 italic text-slate-300 text-sm leading-relaxed mb-8">
                  "{course.results.highlight}"
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
