import React from "react";
import Link from "next/link";
import { COURSES_DATA } from "../lib/course-data";

type CoursesSectionProps = {
  headingAs?: "h1" | "h2";
};

const SubjectIcon = ({ name }: { name: string }) => {
  switch (name) {
    case "Mathematics":
      return (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <line x1="8" y1="12" x2="16" y2="12" />
          <line x1="12" y1="8" x2="12" y2="16" />
        </svg>
      );
    case "Physics":
      return (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3" />
          <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z" />
          <path d="M12 8v4" />
          <path d="M12 16v.01" />
        </svg>
      );
    case "Chemistry":
      return (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 3v12a6 6 0 0 0 12 0V3" />
          <line x1="3" y1="11" x2="21" y2="11" />
        </svg>
      );
    case "Biology":
      return (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 22c1.25-1.25 2.26-2.5 4.5-5.5.5-1.5 1-4.5 1-4.5s2.5 0 4.5.5c4 5.5 4.5 9 4.5 9s3 0 5-2" />
          <path d="M7 16.5c.5-5 3.5-12.5 12.5-14.5" />
          <circle cx="16" cy="8" r="2" />
        </svg>
      );
    default:
      return null;
  }
};

export default function CoursesSection({ headingAs = "h2" }: CoursesSectionProps) {
  const HeadingTag = headingAs;

  return (
   <section id="courses" className="relative py-16 md:py-24 overflow-hidden bg-slate-50/50">
  {/* Background Decorative Elements */}
  <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
    <div className="absolute top-[-5%] right-[-10%] w-[300px] h-[300px] md:w-[400px] md:h-[400px] bg-amber-200/20 rounded-full blur-[80px] md:blur-[100px]" />
    <div className="absolute bottom-[-5%] left-[-10%] w-[300px] h-[300px] md:w-[400px] md:h-[400px] bg-blue-200/20 rounded-full blur-[80px] md:blur-[100px]" />
  </div>

  <div className="relative z-10 mx-auto max-w-[1400px] px-4 sm:px-6">
    
    {/* Section Header */}
    <div className="text-center mb-10 md:mb-16 space-y-3 md:space-y-4 px-2">
      <span className="inline-block px-3 py-1.5 md:px-4 md:py-1.5 text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase text-amber-600 bg-amber-50 rounded-full border border-amber-100">
        Our Academic Programs
      </span>
      <HeadingTag className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
        Comprehensive Learning <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-500">Packages</span>
      </HeadingTag>
    
    </div>

    {/* Courses Grid */}
    {/* md:gap-8 for desktop, reduced gap-5 for mobile to save space */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 md:gap-8">
      {COURSES_DATA.map((course, idx) => (
        <div
          key={course.id}
          className="group relative flex flex-col bg-white rounded-2xl md:rounded-[0px] border border-slate-200/60 p-6 sm:p-8 shadow-sm transition-all duration-500 hover:shadow-2xl hover:shadow-amber-100/50 hover:-translate-y-1 md:hover:-translate-y-2 overflow-hidden"
        >
          {/* Card Accent */}
          <div className={`absolute top-0 left-0 w-1.5 md:w-2 h-full bg-gradient-to-b ${course.accentColor} opacity-80`} />

          <div className="flex justify-between items-start mb-5 md:mb-6">
            <div>
              {/* Scaled down heading for mobile */}
              <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-1">{course.title} <span className="text-lg md:text-xl text-slate-500 font-medium">({course.variant})</span></h3>
              <span className={`inline-block px-2.5 py-1 text-[10px] md:text-xs font-bold rounded-md md:rounded-lg ${course.lightBg} ${course.iconColor} border border-current opacity-80 uppercase tracking-wider`}>
                {course.variant} Edition
              </span>
            </div>
            {/* Icon size adjusted for mobile */}
            <div className={`p-2.5 md:p-3 rounded-xl md:rounded-2xl ${course.lightBg} ${course.iconColor} transition-transform group-hover:scale-110 duration-300`}>
              <svg className="w-5 h-5 md:w-6 md:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
            </div>
          </div>

          <p className="text-slate-600 text-sm md:text-[0.95rem] leading-relaxed md:leading-7 mb-6 md:mb-8">
            {course.description}
          </p>

          <div className="space-y-3 md:space-y-4 mb-6 md:mb-8">
            <div className="flex items-center gap-2">
              <span className="w-6 md:w-8 h-[1px] bg-slate-200"></span>
              <span className="text-[9px] md:text-[10px] uppercase font-bold text-slate-400 tracking-[0.15em] md:tracking-widest">Core Subjects</span>
              <span className="flex-1 h-[1px] bg-slate-200"></span>
            </div>
            <div className="grid grid-cols-2 gap-2 md:gap-3">
              {course.subjects.map((subject) => (
                <div key={subject} className="flex items-center gap-2 p-2 rounded-lg md:rounded-xl bg-slate-50/50 border border-slate-100 group-hover:bg-white transition-colors">
                  <div className={`${course.iconColor} opacity-70 transform scale-90 md:scale-100`}>
                    <SubjectIcon name={subject} />
                  </div>
                  <span className="text-[11px] md:text-xs font-semibold text-slate-700">{subject}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-auto flex flex-col sm:flex-row md:flex-col gap-2.5 md:gap-3">
            <Link
              href={`/contact?batch=${encodeURIComponent(`${course.title} (${course.variant})`)}`}
              className={`w-full sm:flex-1 md:w-full py-3.5 md:py-4 rounded-xl bg-gradient-to-r ${course.accentColor} text-white font-bold text-sm text-center shadow-lg shadow-blue-500/20 hover:shadow-xl transition-all active:scale-95`}
            >
              Enroll Now
            </Link>
            <Link
              href={`/courses/${course.slug}`}
              className="w-full sm:flex-1 md:w-full py-3 md:py-3 rounded-xl border border-slate-200 text-slate-600 font-semibold text-xs text-center hover:bg-slate-50 transition-colors"
            >
              View Details
            </Link>
          </div>

          {/* Decorative Corner Glow */}
          <div className={`absolute -bottom-10 -right-10 w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br ${course.accentColor} blur-[30px] md:blur-[40px] opacity-0 group-hover:opacity-20 transition-opacity duration-500`} />
        </div>
      ))}
    </div>

    {/* CTA Banner - Mobile optimized */}
    <div className="mt-12 md:mt-20 p-6 sm:p-8 rounded-2xl md:rounded-[0px] bg-slate-900 text-white overflow-hidden relative text-center md:text-left">
      <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(251,191,36,0.15),transparent_60%)] md:bg-[radial-gradient(circle_at_top_right,rgba(251,191,36,0.15),transparent_40%)]" />
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8">
        <div className="max-w-xl">
          <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 md:mb-3">Not sure which program is right?</h3>
          <p className="text-slate-400 text-xs sm:text-sm md:text-base leading-relaxed px-4 md:px-0">
            Book a free counselling session with Mr. Gopal Negi to understand the best path for your academic goals.
          </p>
        </div>
        <Link
          href="/contact"
          className="w-full md:w-auto px-6 py-3.5 md:px-8 md:py-4 bg-amber-400 text-slate-950 font-bold text-sm md:text-base rounded-xl md:rounded-2xl hover:bg-amber-300 transition-all hover:-translate-y-1 shadow-lg shadow-amber-400/20 active:scale-95"
        >
          Book Free Session
        </Link>
      </div>
    </div>
    
  </div>
</section>
  );
}
