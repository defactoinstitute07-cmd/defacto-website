import Link from "next/link";
import type { Metadata } from "next";
import { buildMetadata } from "../../lib/seo";

const legacyMetadata: Metadata = {
  title: "ERP System | Defacto Institute",
  description:
    "Explore Defacto Institute's powerful ERP system — a comprehensive platform for managing student records, attendance, academics, fees, and more.",
};

export const metadata: Metadata = buildMetadata({
  title: "ERP System for Institute Management",
  description:
    "Explore Defacto Institute's ERP system for student records, attendance, fee management, performance reports, scheduling, and academic operations.",
  path: "/erp",
  keywords: ["ERP for institutes", "student management system", "attendance software", "fee management"],
});

const features = [
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
    title: "Student Management",
    description:
      "Complete student lifecycle management — from admission and enrollment to batch assignment. Maintain detailed profiles with contact info, academic history, and more.",
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
      </svg>
    ),
    title: "Attendance Tracking",
    description:
      "Mark and monitor daily attendance for each batch. View reports by date, student, or class — and instantly identify absentee patterns with visual analytics.",
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: "Fee Management",
    description:
      "Track fee payments, generate receipts, and view outstanding dues at a glance. Supports installment-based payments and automated reminders to streamline finances.",
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    title: "Performance & Reports",
    description:
      "Generate detailed academic reports and performance analysis. Track test scores, progress charts, and comparative analytics across batches and subjects.",
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    title: "Batch & Schedule Management",
    description:
      "Organize students into batches, assign teachers, set timetables, and manage class schedules — all from a centralized dashboard with drag-and-drop simplicity.",
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
      </svg>
    ),
    title: "Notifications & Alerts",
    description:
      "Send instant updates to parents and students for fee reminders, schedule changes, exam announcements, and attendance alerts — via in-app notifications.",
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
    title: "Teacher Portal",
    description:
      "Dedicated interfaces for teachers to manage their classes, mark attendance, upload test scores, communicate with parents, and view assigned batch schedules.",
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
    title: "Role-Based Access Control",
    description:
      "Secure, role-based authentication for admins, teachers, and staff. Each user only sees the tools and data relevant to their role, ensuring privacy and accountability.",
  },
];

const stats = [
  { value: "100%", label: "Cloud Based" },
  { value: "24/7", label: "Availability" },
  { value: "Secure", label: "Data Encryption" },
  { value: "Real-time", label: "Sync & Updates" },
];

export default function ERPPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative -mx-4 sm:-mx-6 lg:-mx-8 bg-slate-900 overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0">
          <div className="absolute top-[-30%] right-[-15%] w-[70%] h-[70%] bg-amber-500/8 blur-[150px] rounded-full" />
          <div className="absolute bottom-[-30%] left-[-15%] w-[60%] h-[60%] bg-orange-600/8 blur-[150px] rounded-full" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40%] h-[40%] bg-amber-400/5 blur-[100px] rounded-full" />
          {/* Grid pattern overlay */}
          <div className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>

        <div className="relative mx-auto max-w-7xl px-5 py-10 sm:px-6 md:py-10 lg:px-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-sm font-medium mb-10 transition-colors group"
          >
            <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Home
          </Link>

          <div className="max-w-3xl">
            <span className="inline-block px-4 py-1.5 text-xs font-bold tracking-[0.2em] uppercase text-amber-400 bg-amber-400/10 rounded-full border border-amber-400/20 mb-8">
              Enterprise Resource Planning
            </span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white tracking-tight mb-6 leading-[1.1]">
              Our Integrated{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500">
                ERP System
              </span>
            </h1>
            <p className="text-slate-400 text-lg md:text-xl leading-relaxed max-w-2xl mb-10">
              A comprehensive, cloud-based platform that streamlines every
              aspect of institute management — from student enrollment and
              academics to fees, attendance, and reporting.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-8 py-4 bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold rounded-2xl shadow-xl shadow-amber-400/10 transition-all hover:-translate-y-0.5"
              >
                Request a Demo
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <a
                href="#features"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-bold rounded-2xl border border-white/10 transition-all"
              >
                Explore Features
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </a>
            </div>
          </div>

          {/* Stats bar */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/5">
                <div className="text-2xl md:text-3xl font-extrabold text-amber-400 mb-1">{stat.value}</div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What is ERP Section */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <span className="inline-block px-4 py-1.5 text-xs font-bold tracking-[0.2em] uppercase text-amber-600 bg-amber-50 rounded-full border border-amber-100 mb-6">
                Understanding ERP
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-6">
                What is an{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-500">
                  ERP System?
                </span>
              </h2>
              <p className="text-slate-500 text-lg leading-relaxed mb-6">
                <strong className="text-slate-700">ERP (Enterprise Resource Planning)</strong> is a
                centralized software system that integrates and automates all
                core operations of an organization into one unified platform.
              </p>
              <p className="text-slate-500 leading-relaxed mb-6">
                For an educational institute like ours, this means managing
                students, teachers, classes, attendance, fees, exams, results,
                and communication — all from a single, easy-to-use dashboard
                instead of scattered spreadsheets and registers.
              </p>
              <p className="text-slate-500 leading-relaxed">
                Our ERP eliminates paperwork, reduces human error, saves
                countless hours of administrative effort, and gives parents,
                teachers, and management real-time visibility into every aspect
                of the institute.
              </p>
            </div>

            {/* Visual card */}
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-amber-100 to-orange-100 rounded-[2rem] blur-2xl opacity-50" />
              <div className="relative bg-white rounded-[2rem] border border-slate-200 shadow-2xl shadow-slate-200/50 p-8 md:p-10">
                <h3 className="text-lg font-bold text-slate-800 mb-6">Without ERP vs With ERP</h3>
                <div className="space-y-4">
                  {[
                    { without: "Attendance in paper registers", with: "One-tap digital attendance" },
                    { without: "Fee records in Excel sheets", with: "Automated fee tracking & receipts" },
                    { without: "Exam results on paper", with: "Instant digital report cards" },
                    { without: "Parent updates via phone calls", with: "Real-time app notifications" },
                    { without: "Manual batch scheduling", with: "Automated smart scheduling" },
                  ].map((row, i) => (
                    <div key={i} className="grid grid-cols-2 gap-3">
                      <div className="flex items-start gap-2 p-3 bg-rose-50 rounded-xl">
                        <span className="text-rose-400 mt-0.5 shrink-0">✕</span>
                        <span className="text-sm text-rose-600 font-medium">{row.without}</span>
                      </div>
                      <div className="flex items-start gap-2 p-3 bg-emerald-50 rounded-xl">
                        <span className="text-emerald-500 mt-0.5 shrink-0">✓</span>
                        <span className="text-sm text-emerald-700 font-medium">{row.with}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 md:py-28 bg-slate-50 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 text-xs font-bold tracking-[0.2em] uppercase text-amber-600 bg-amber-50 rounded-full border border-amber-100 mb-6">
              Platform Capabilities
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
              Powerful Features,{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-500">
                Simple Interface
              </span>
            </h2>
            <p className="text-slate-500 max-w-2xl mx-auto text-lg">
              Everything you need to run a modern institute — built into one
              cohesive platform.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <div
                key={i}
                className="group bg-white rounded-2xl border border-slate-200 p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/50 hover:border-amber-200"
              >
                <div className="flex items-center justify-center w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl mb-5 group-hover:bg-amber-400 group-hover:text-white transition-colors duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-amber-600 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-4xl px-5 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-6">
            Ready to{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-500">
              Transform
            </span>{" "}
            Your Institute?
          </h2>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
            Join the growing number of institutes that have streamlined their
            operations with our ERP system. Get in touch to schedule a
            personalized walkthrough.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-10 py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl shadow-xl shadow-slate-900/10 transition-all hover:-translate-y-0.5"
            >
              Schedule a Demo
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-10 py-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl transition-all"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
