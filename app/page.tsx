import type { Metadata } from "next";
import Link from "next/link";
import { getCloudinarySrcSet, getOptimizedImageUrl } from "../lib/image-utils";
import { getPublicSiteContent } from "../lib/site-content";
import { absoluteUrl, buildMetadata, siteConfig } from "../lib/seo";

const courses = [
  {
    title: "Foundation Program",
    description:
      "Build strong concepts in mathematics, science, and reasoning with structured weekly practice.",
    highlight: "Classes 8-10",
  },
  {
    title: "Board Exam Excellence",
    description:
      "Focused revision modules, test series, and answer-writing strategies for top board results.",
    highlight: "Classes 10-12",
  },
  {
    title: "Competitive Prep",
    description:
      "Intensive mentoring for entrance exams with mock tests, analysis sessions, and doubt clearing.",
    highlight: "JEE / NEET / CUET",
  },
];

const strengths = [
  {
    title: "Experienced Faculty",
    description:
      "Learn from mentors who simplify difficult topics and guide every student with patience and clarity.",
  },
  {
    title: "Personal Attention",
    description:
      "Small batches and regular progress tracking help us support each learner at the right pace.",
  },
  {
    title: "Result-Oriented Strategy",
    description:
      "Daily practice, weekly assessments, and feedback loops keep students focused on measurable improvement.",
  },
];

const testimonials = [
  {
    name: "Ananya Sharma",
    role: "Class 12 Student",
    quote:
      "The teachers made every concept feel easy. My confidence improved with every test, and my scores followed.",
  },
  {
    name: "Rahul Verma",
    role: "Class 10 Student",
    quote:
      "The mock test analysis and personal mentoring helped me identify weak areas quickly and prepare smarter.",
  },
  {
    name: "Pooja Mehta",
    role: "Parent",
    quote:
      "We saw a real change in discipline and understanding. The guidance here feels personal, not mechanical.",
  },
];

import FacultySection from "../components/FacultySection";
import CoursesSection from "../components/CoursesSection";
import StudentGallery from "../components/StudentGallery";

export const metadata: Metadata = buildMetadata({
  title: "Best Coaching Institute in Bhaniawala, Dehradun",
  description:
    "Join Defacto Institute for foundation programs, board exam preparation, competitive exam coaching, and student-focused mentoring in Bhaniawala, Dehradun.",
  path: "/",
  keywords: [
    "best coaching institute in Bhaniawala",
    "Defacto Institute Dehradun",
    "foundation program classes 8 to 10",
    "board exam coaching in Dehradun",
    "competitive exam coaching",
  ],
});

export default async function HomePage() {
  const managedContent = await getPublicSiteContent();
  const homeStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Defacto Institute Home",
    url: absoluteUrl("/"),
    description: siteConfig.description,
    about: {
      "@type": "EducationalOrganization",
      name: siteConfig.name,
    },
  };

  return (
    <div className="pb-20">
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify(homeStructuredData) }}
/>
<section className="relative left-1/2 w-screen -translate-x-1/2 overflow-hidden bg-slate-950 text-white shadow-2xl shadow-slate-900/20 min-h-[100dvh]">
  {/* About Section - Background Image */}
  {/* CHANGE: h-[100vh] hata diya aur inset-0 rehne diya, taaki background hamesha pure container ko cover kare */}
  <div
    className="absolute inset-0 bg-cover bg-center"
    style={{
      backgroundImage: `linear-gradient(
        90deg,
        rgba(0, 0, 0, 0.74) 0%,
        rgba(0, 0, 0, 0.71) 45%,
        rgba(0, 0, 0, 0.53) 100%
      ),
      url('${getOptimizedImageUrl(managedContent.heroImageUrl, { width: 1600 })}')`,
    }}
  />
  
  {/* Gradient Overlay */}
  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(251,191,36,0.18),transparent_32%),radial-gradient(circle_at_bottom_left,rgba(245,158,11,0.22),transparent_28%)]" />

  {/* Content Wrapper */}
  {/* CHANGE: min-h-screen ki jagah min-h-[100dvh] use kiya mobile browsers ke liye, aur mobile pe py-16 padding di */}
  <div className="relative mx-auto grid min-h-[100dvh] w-full max-w-[1500px] items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.3fr_0.7fr] lg:px-8 lg:py-20">
    
    <div className="max-w-3xl">
      {/* Badge */}
      <p className="inline-flex items-center text-center rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-xs font-medium text-amber-200 backdrop-blur sm:text-sm">
        Admissions open for the new academic session 2026
      </p>
      
      {/* Heading */}
      <h1 className="mt-5 max-w-3xl text-3xl font-bold leading-tight tracking-tight sm:mt-6 sm:text-4xl md:text-5xl lg:text-6xl">
        Welcome to Defacto Institute
      </h1>
      
      {/* Description */}
      <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-200 sm:mt-6 sm:text-base md:text-lg">
        Where disciplined learning meets personal mentorship. We help
        students strengthen concepts, perform confidently in exams, and
        move toward their academic goals with clarity.
      </p>

      {/* Buttons Container: Side-by-Side on Mobile */}
      <div className="mt-8 flex flex-row gap-2 sm:gap-4">
        <Link
          href="/courses"
          className="flex-1 inline-flex items-center justify-center text-center rounded-full bg-amber-400 px-3 py-2.5 text-[11px] leading-tight font-semibold text-slate-950 transition hover:bg-amber-300 sm:flex-none sm:px-6 sm:py-3 sm:text-sm"
        >
          Explore Courses
        </Link>
        <Link
          href="/contact"
          className="flex-1 inline-flex items-center justify-center text-center rounded-full border border-white/25 bg-white/10 px-3 py-2.5 text-[11px] leading-tight font-semibold text-white transition hover:bg-white/20 sm:flex-none sm:px-6 sm:py-3 sm:text-sm"
        >
          Book a Counselling Session
        </Link>
      </div>
    </div>

    {/* Note: Aapne yahan lg:grid-cols-[1.3fr_0.7fr] lagaya hai. Agar right side (0.7fr) mein koi image ya form aana hai, toh wo yahan niche aayega. */}
    
  </div>
</section>


<section id="about" className="relative left-1/2 w-screen -translate-x-1/2 overflow-hidden bg-gradient-to-r from-primary-light via-white to-secondary-light">
  {/* Container: Added gap-8 for mobile so text and image don't overlap, py-10 for top/bottom breathing room */}
  <div className="mx-auto flex w-full max-w-[1500px] flex-col-reverse items-center justify-between gap-8 py-10 px-4 sm:px-6 md:flex-row md:gap-0 md:py-0 lg:px-0">
    
    {/* Text Section */}
    {/* Padding adjust ki hai: mobile pe kam (px-2/4), desktop pe zyada (px-16) */}
    <div className="flex flex-1 flex-col items-start justify-center px-2 sm:px-8 md:px-16 md:py-16 lg:px-20">
      
      {/* Heading: text-3xl for mobile, scaling up to text-5xl on desktop */}
      <h2 className="mb-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl md:mb-6 md:text-5xl">
        About <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-500">Defacto Institute</span>
      </h2>
      
      {/* Paragraph: text-sm for mobile for better readability, scaling up to text-lg */}
      <p className="mb-6 max-w-2xl text-sm leading-relaxed text-slate-800 sm:text-base md:text-lg md:leading-8">
        <span className="font-semibold text-slate-900">Defacto Institute</span> is a trusted name in education, committed to nurturing academic excellence and shaping successful careers. With over <span className="font-semibold">13 years of experience (since 2013)</span>, we have guided thousands of students toward achieving their academic and competitive goals.

        <br /><br />

        Under the expert leadership of <span className="font-semibold">Mr. Gopal Negi</span>, the institute focuses on <span className="font-medium">concept-based learning</span> and <span className="font-medium">affordable education</span>, ensuring that every student builds a strong and lasting foundation. We are not just a coaching center—we are a place where students gain confidence, clarity, and direction for their future.

        <br /><br />

        We provide a <span className="font-medium">supportive and student-focused environment</span>, where personalized mentorship and high-quality teaching help learners excel in <span className="font-medium">board exams, competitive entrance exams, and foundational studies</span>.
      </p>
    </div>

    {/* Image Section */}
    {/* Height adjust ki hai: mobile ke liye min-h-[280px] taaki screen pe fit aaye, desktop pe min-h-[420px] */}
    <div className="relative flex w-full min-h-[280px] sm:min-h-[350px] md:min-h-[420px] flex-1 items-center justify-center overflow-hidden">
      <div className="institute-art-bg" aria-hidden="true" />
      <div className="institute-art-orb institute-art-orb--amber" aria-hidden="true" />
      <div className="institute-art-orb institute-art-orb--slate" aria-hidden="true" />

      {/* Added w-full and px-4 for mobile so the image has some margin from screen edges */}
      <div className="institute-image-shell w-full px-4 md:px-0">
        <img
          src={getOptimizedImageUrl(managedContent.aboutImageUrl, { width: 1400 })}
          srcSet={getCloudinarySrcSet(managedContent.aboutImageUrl, [640, 960, 1400, 1800])}
          sizes="(min-width: 768px) 50vw, 100vw"
          alt="Defacto Institute building"
          // Added object-cover and rounded corners for mobile view to make it look premium
          className="institute-image h-full w-full rounded-2xl object-cover shadow-lg md:rounded-none md:shadow-none"
          loading="lazy"
          decoding="async"
        />
      </div>
    </div>
    
  </div>
</section>
{/* ── About Owner / Teacher ────────────────────────────── */}
<section className="owner-section relative overflow-hidden bg-slate-950">
  {/* Animated background */}
  <div className="owner-mesh-bg" aria-hidden="true" />
  <div className="owner-orb owner-orb--gold" aria-hidden="true" />
  <div className="owner-orb owner-orb--violet" aria-hidden="true" />
  <div className="owner-orb owner-orb--slate" aria-hidden="true" />

  {/* Adjusted gap and padding for mobile (gap-10, py-12) */}
  <div className="owner-grid mx-auto grid w-full max-w-[1500px] items-center gap-10 px-4 py-0 sm:px-6 md:grid-cols-[auto_1fr] md:gap-16 lg:px-2 lg:py-2">
    
    {/* Image Column - Centered on mobile with specific width limits */}
    <div className="owner-image-col mx-auto flex justify-center md:mx-0 w-[240px] sm:w-[280px] md:w-auto">
      <div className="owner-image-wrapper">
        <div className="owner-image-ring">
          {/* Added aspect-square and rounded-full utilities to ensure perfect circle on mobile */}
          <div className="owner-image-inner relative aspect-square overflow-hidden rounded-[0px] border-2 border-yellow-400/20 bg-slate-900 p-0 shadow-2xl shadow-yellow-500/10">
            {managedContent.ownerImageUrl ? (
              <img
                src={getOptimizedImageUrl(managedContent.ownerImageUrl, { width: 720 })}
                srcSet={getCloudinarySrcSet(managedContent.ownerImageUrl, [320, 480, 720, 960])}
                sizes="(min-width: 768px) 280px, 240px"
                alt="Mr. Gopal Negi – Founder & Head Teacher, Defacto Institute"
                className="owner-image-photo h-full w-full rounded-[0px]  object-cover"
                loading="lazy"
                decoding="async"
              />
            ) : (
              <div className="owner-image-placeholder flex h-full w-full flex-col items-center justify-center rounded-full bg-slate-800">
                <div className="owner-image-placeholder-icon mb-2">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="rgba(251,191,36,0.6)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
                <span className="owner-image-placeholder-text text-[10px] sm:text-xs text-gray-400 text-center px-4">Photo Coming Soon</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>

    {/* Text Column - Centered on mobile, left-aligned on desktop */}
    <div className="text-gray-200 max-w-2xl space-y-5 md:space-y-6 text-center md:text-left flex flex-col items-center md:items-start">

      {/* Eyebrow - Symmetrical on mobile, left-aligned on desktop */}
      <div className="flex items-center justify-center md:justify-start gap-3 w-full">
        <span className="w-8 h-[2px] bg-gradient-to-r from-yellow-400 to-transparent md:w-10"></span>
        <p className="text-[10px] sm:text-xs tracking-[0.2em] md:tracking-[0.25em] uppercase text-gray-400 font-medium">
          About the Owner
        </p>
        <span className="w-8 h-[2px] bg-gradient-to-l from-yellow-400 to-transparent md:hidden"></span>
      </div>

      {/* Name - Smooth scaling */}
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
        Mr. <span className="text-yellow-400">Gopal Negi</span>
      </h2>

      {/* Title */}
      <p className="text-xs sm:text-sm text-gray-400 tracking-wide">
        Founder & Head Teacher · Defacto Institute
      </p>

      {/* Divider - Center gradient for mobile, left-to-right for desktop */}
      <div className="w-24 md:w-20 h-[1px] bg-gradient-to-r from-transparent via-yellow-400/50 to-transparent md:from-yellow-400/40 md:via-yellow-400/20 md:to-transparent"></div>

      {/* Bio */}
      <p className="text-sm md:text-base leading-relaxed md:leading-7 text-gray-300 px-2 md:px-0">
        With over <strong className="text-white">13 years of dedicated teaching</strong>, Mr. Gopal Negi has shaped the
        academic journeys of thousands of students across Uttarakhand.
        <br className="hidden sm:block" /><br className="hidden sm:block" />
        <span className="block mt-3 sm:mt-0">He specialises in <strong className="text-white">Mathematics, Science, and Competitive Exam preparation</strong>, making complex topics simple and practical.</span>
      </p>

      {/* Stats - REDESIGNED for mobile with flex-between and dividers */}
      <div className="w-full flex justify-between items-center pt-5 md:pt-6 border-t border-gray-800/80 px-2 sm:px-4 md:px-0">
        
        <div className="text-center flex-1">
          <span className="block text-2xl sm:text-3xl font-bold text-yellow-400">13+</span>
          <span className="text-[10px] sm:text-xs text-gray-400 uppercase tracking-wider mt-1 block">Years</span>
        </div>
        
        {/* Vertical Divider */}
        <div className="w-[1px] h-10 bg-gray-800"></div>
        
        <div className="text-center flex-1">
          <span className="block text-2xl sm:text-3xl font-bold text-yellow-400">2K+</span> {/* Changed 2000+ to 2K+ for cleaner mobile look */}
          <span className="text-[10px] sm:text-xs text-gray-400 uppercase tracking-wider mt-1 block">Students</span>
        </div>

        {/* Vertical Divider */}
        <div className="w-[1px] h-10 bg-gray-800"></div>

        <div className="text-center flex-1">
          <span className="block text-2xl sm:text-3xl font-bold text-yellow-400">99%</span>
          <span className="text-[10px] sm:text-xs text-gray-400 uppercase tracking-wider mt-1 block">Success</span>
        </div>

      </div>

      {/* Quote - Kept left aligned even on mobile for better reading, but adjusted borders */}
      <div className="relative border-l-2 md:border-l-4 border-yellow-400 pl-4 md:pl-5 pt-1 md:pt-2 mt-4 text-left w-full">
        <p className="text-xs sm:text-sm italic text-gray-300 leading-relaxed">
          “Education is not about cramming facts — it's about building confidence
          to think, question, and grow.”
        </p>
      </div>

    </div>
  </div>
</section>

      
      <CoursesSection />
      <FacultySection />
      <StudentGallery />

{/* Why Choose Us */}
<section className="relative py-20 md:py-28 bg-slate-900 -mx-4 sm:-mx-6 lg:-mx-8 px-6 sm:px-10 lg:px-12 overflow-hidden">
  {/* Ambient glows */}
  <div className="absolute top-[-10%] left-[-10%] w-[80%] h-[80%] md:w-[50%] md:h-[50%] bg-amber-500/8 blur-[100px] md:blur-[150px] rounded-full pointer-events-none" />
  <div className="absolute bottom-[-10%] right-[-10%] w-[80%] h-[80%] md:w-[40%] md:h-[40%] bg-orange-600/8 blur-[100px] md:blur-[150px] rounded-full pointer-events-none" />
  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50%] h-[50%] md:w-[30%] md:h-[30%] bg-amber-400/5 blur-[80px] md:blur-[100px] rounded-full pointer-events-none" />

  <div className="relative max-w-7xl mx-auto z-10">
    {/* Header */}
    <div className="text-center mb-12 md:mb-20">
      <span className="inline-block px-4 py-2 text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase text-amber-400 bg-amber-400/10 rounded-full border border-amber-400/20 mb-5 md:mb-6">
        Why Choose Us
      </span>
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-5 md:mb-6">
        An Environment Built for{" "}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400 block sm:inline">
          Real Growth
        </span>
      </h2>
      <p className="text-slate-400 max-w-2xl mx-auto text-sm sm:text-base md:text-lg leading-relaxed px-4">
        We combine structured teaching with attentive mentorship so that
        students stay motivated, parents stay informed, and progress stays
        visible.
      </p>
    </div>

    {/* Strength Cards */}
    {/* Gap badhaya aur padding add ki */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-8">
      {[
        {
          icon: (
            <svg className="w-7 h-7 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          ),
          num: "01",
          ...strengths[0],
        },
        {
          icon: (
            <svg className="w-7 h-7 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          ),
          num: "02",
          ...strengths[1],
        },
        {
          icon: (
            <svg className="w-7 h-7 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          ),
          num: "03",
          ...strengths[2],
        },
      ].map((item) => (
        <div
          key={item.title}
          // Yahan andar ki padding p-8 (mobile) aur p-10 (desktop) kardi hai
          className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 md:p-10 transition-all duration-500 hover:bg-white/10 hover:border-amber-400/20 hover:-translate-y-1"
        >
          {/* Number badge - Thoda aur neatly align kiya padding ke hisab se */}
          <span className="absolute top-6 right-6 md:top-8 md:right-8 text-6xl md:text-[80px] font-black text-white/[0.03] leading-none select-none pointer-events-none">
            {item.num}
          </span>

          <div className="flex items-center justify-center w-14 h-14 md:w-16 md:h-16 bg-amber-400/10 text-amber-400 rounded-2xl mb-6 md:mb-8 group-hover:bg-amber-400 group-hover:text-slate-900 transition-colors duration-300">
            {item.icon}
          </div>

          <h3 className="text-xl md:text-2xl font-bold text-white mb-3 md:mb-4 group-hover:text-amber-400 transition-colors relative z-10">
            {item.title}
          </h3>
          <p className="text-slate-400 text-sm md:text-base leading-relaxed relative z-10">
            {item.description}
          </p>

          {/* Bottom accent line */}
          <div className="mt-6 md:mt-8 h-[2px] w-0 group-hover:w-12 md:group-hover:w-16 bg-gradient-to-r from-amber-400 to-orange-400 transition-all duration-500 rounded-full" />
        </div>
      ))}
    </div>

    {/* Stats row */}
    <div className="mt-12 md:mt-20 grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {[
        { value: "13+", label: "Years of Excellence" },
        { value: "2K+", label: "Students Guided" },
        { value: "99%", label: "Success Rate" },
        { value: "15+", label: "Expert Faculty" },
      ].map((stat) => (
        // Yahan stats box me bhi aur padding (p-6 md:p-8) di hai
        <div key={stat.label} className="text-center p-6 md:p-8 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors duration-300">
          <div className="text-3xl sm:text-4xl font-extrabold text-amber-400 mb-2">{stat.value}</div>
          <div className="text-[10px] md:text-[11px] font-bold text-slate-500 uppercase tracking-[0.15em] md:tracking-widest">{stat.label}</div>
        </div>
      ))}
    </div>
  </div>
</section>

<section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-slate-50/50">
  <div className="max-w-7xl mx-auto">
    
    {/* Header */}
    {/* Mobile pe flex-col aur gap-6, desktop pe flex-row aur items-end */}
    <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between mb-10 md:mb-16">
      <div className="max-w-2xl">
        {/* Eyebrow badge (Baaki sections jaisa same consistent style) */}
        <span className="inline-block px-3 py-1.5 md:px-4 md:py-1.5 text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase text-amber-600 bg-amber-50 rounded-full border border-amber-100 mb-4 md:mb-5">
          Testimonials
        </span>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
          What students and parents say about <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-500">Defacto Institute</span>
        </h2>
      </div>
      
      {/* CTA Button - Mobile par full width (w-full), desktop par auto (md:w-auto) */}
      <Link
        href="/contact"
        className="group inline-flex items-center justify-center gap-2 rounded-xl md:rounded-2xl bg-slate-900 px-6 py-3.5 md:px-8 md:py-4 text-sm md:text-base font-bold text-white transition-all hover:bg-slate-800 hover:shadow-xl hover:shadow-slate-900/10 active:scale-95 w-full md:w-auto shrink-0"
      >
        Join our next batch
        <svg className="w-4 h-4 md:w-5 md:h-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
      </Link>
    </div>

    {/* Grid - Tablet ke liye sm:grid-cols-2 add kiya hai taaki 1 se direct 3 par jump na ho */}
    <div className="grid gap-5 md:gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {testimonials.map((testimonial) => (
        <article
          key={testimonial.name}
          // Mobile par padding thodi kam (p-6), desktop par zyada (p-8)
          className="group relative rounded-2xl md:rounded-[2rem] border border-slate-200 bg-white p-6 md:p-8 shadow-sm transition-all duration-300 hover:shadow-xl hover:shadow-amber-100/50 hover:-translate-y-1 overflow-hidden"
        >
          {/* Decorative Background Quote Icon (Premium Touch) */}
          <div className="absolute -top-2 right-4 md:right-6 text-[8rem] md:text-[10rem] leading-none font-serif text-slate-50 select-none pointer-events-none transform group-hover:scale-110 group-hover:text-amber-50/50 transition-all duration-500">
            &rdquo;
          </div>

          <div className="relative z-10 flex items-center gap-3 md:gap-4">
            {/* Avatar - Added gradient and border for a polished look */}
            <div className="flex h-12 w-12 md:h-14 md:w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-100 to-amber-200 text-sm md:text-base font-bold text-amber-800 shadow-inner border border-amber-50">
              {testimonial.name
                .split(" ")
                .map((part) => part[0])
                .join("")}
            </div>
            <div>
              <h3 className="text-base md:text-lg font-bold text-slate-900">
                {testimonial.name}
              </h3>
              <p className="text-xs md:text-sm font-medium text-slate-500 uppercase tracking-wide mt-0.5">{testimonial.role}</p>
            </div>
          </div>
          
          <p className="relative z-10 mt-5 md:mt-6 text-sm md:text-base leading-relaxed md:leading-7 text-slate-600">
            &ldquo;{testimonial.quote}&rdquo;
          </p>
        </article>
      ))}
    </div>
    
  </div>
</section>
    </div>
  );
}
