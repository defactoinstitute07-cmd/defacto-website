"use client";

import { useEffect, useState } from "react";
import { getCloudinarySrcSet, getOptimizedImageUrl } from "../lib/image-utils";

type Faculty = {
  id: string;
  name: string;
  designation: string;
  experience?: string;
  imageUrl: string;
};

export default function FacultySection() {
  const [faculty, setFaculty] = useState<Faculty[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFaculty() {
      try {
        const res = await fetch("/api/faculty");
        const data = await res.json();
        setFaculty(data.faculty || []);
      } finally {
        setLoading(false);
      }
    }
    fetchFaculty();
  }, []);

  if (loading) return null;
  if (!faculty.length) return null;

  return (
    <section className="relative py-16 md:py-24 bg-gradient-to-b from-slate-50 to-slate-150 px-4 sm:px-6 md:px-8 overflow-hidden">

      {/* Background Ambient Glow (Scaled down slightly for mobile) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[250px] md:h-[400px] bg-amber-200/30 rounded-full blur-[80px] md:blur-[120px] pointer-events-none"></div>

      <div className="relative mx-auto max-w-6xl">

        {/* Section Header */}
        <div className="text-center mb-10 md:mb-16 px-2">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
            Our Distinguished {" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-500">
              Faculty
            </span>
          </h2>

        </div>

        {/* Faculty Grid - Adjusted gaps for mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {faculty.map((f) => (
            <div
              key={f.id}
              // Added rounded-2xl for mobile, keeping sharp edges (rounded-[0px]) for desktop
              // Added padding (p-4) to give elements room to breathe
              className="group w-full relative rounded-2xl md:rounded-[0px] bg-white border border-slate-200 p-4 flex flex-col items-center text-center transition-all duration-300 hover:shadow-xl hover:shadow-slate-200/60 hover:-translate-y-1 md:hover:-translate-y-2"
            >

              {/* Image Container - CRITICAL FIX: Added aspect ratio */}
              {/* Mobile par square (aspect-square), badi screen par thoda lamba (aspect-[4/5]) */}
              <div className="relative mb-5 w-full aspect-square overflow-hidden rounded-xl md:rounded-[0px]">
                <img
                  src={getOptimizedImageUrl(f.imageUrl, { width: 640 })}
                  srcSet={getCloudinarySrcSet(f.imageUrl, [320, 480, 640, 800])}
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                  alt={f.name}
                  className="w-full h-full object-cover border-2 border-transparent group-hover:border-amber-400 transition-all duration-300"
                  loading="lazy"
                  decoding="async"
                />
              </div>

              {/* Name */}
              <h3 className="text-lg md:text-xl font-bold text-slate-800">
                {f.name}
              </h3>

              {/* Designation */}
              <p className="text-xs md:text-sm font-semibold text-slate-500 mt-1 uppercase tracking-wider">
                {f.designation}
              </p>

              {/* Experience */}
              {f.experience && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-600 rounded-full border border-amber-100 mt-3 group-hover:bg-amber-100 transition-colors duration-300 mb-1">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-[10px] md:text-xs font-bold whitespace-nowrap italic">
                    {f.experience} Experience
                  </span>
                </div>
              )}

              {/* Divider - Added interactive hover effect */}
              <div className="w-8 h-[3px] bg-amber-400 mt-4 mb-2 rounded-full opacity-80 transition-all duration-300 group-hover:w-16 group-hover:opacity-100"></div>

              {/* Optional Icons */}

            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
