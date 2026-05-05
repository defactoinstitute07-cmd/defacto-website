"use client";

import React, { useEffect, useState } from "react";
import { getOptimizedImageUrl } from "../lib/image-utils";

type AlumniItem = {
  id: string;
  name: string;
  achievement: string;
  passingYear?: string;
  imageUrl: string;
};

export default function AlumniSection() {
  const [alumni, setAlumni] = useState<AlumniItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAlumni() {
      try {
        const res = await fetch("/api/alumni");
        const data = await res.json();
        setAlumni(data.alumni || []);
      } catch (err) {
        console.error("Failed to load alumni", err);
      } finally {
        setLoading(false);
      }
    }
    fetchAlumni();
  }, []);

  if (loading) {
    return (
      <section className="relative py-20 md:py-32 overflow-hidden bg-white">
        <div className="relative z-10 mx-auto max-w-[1400px] px-6 sm:px-8">
          <div className="text-center mb-16 md:mb-24 space-y-4">
            <div className="mx-auto h-6 w-32 bg-slate-100 animate-pulse rounded-full" />
            <div className="mx-auto h-12 md:h-16 w-3/4 max-w-2xl bg-slate-100 animate-pulse rounded-xl" />
          </div>
          <div className="flex gap-6 md:gap-8 overflow-hidden">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="w-[240px] sm:w-[280px] lg:w-[320px] flex-shrink-0 flex flex-col bg-slate-50 rounded-[0px] border border-gray-100 shadow-sm overflow-hidden">
                <div className="aspect-[4/5] bg-slate-200 animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (alumni.length === 0) return null;

  return (
    <section id="alumni" className="relative py-20 md:py-32 overflow-hidden bg-white">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-50 rounded-full blur-[120px] -mr-64 -mt-64 opacity-60" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-teal-50 rounded-full blur-[120px] -ml-64 -mb-64 opacity-60" />

      <div className="relative z-10 mx-auto max-w-[1400px] px-6 sm:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 md:mb-24 space-y-4">
          <span className="inline-block px-4 py-1.5 text-xs font-bold tracking-[0.2em] uppercase text-emerald-600 bg-emerald-50 rounded-full border border-emerald-100">
            Our Proud Alumni
          </span>
          <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight">
            Success{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500">
              Stories
            </span>
          </h2>
        </div>

        {/* Scrolling Marquee Container */}
        <div className="relative flex overflow-hidden group">
          {/* Marquee Track — two identical sets for seamless loop */}
          <div
            className="flex gap-6 md:gap-8 min-w-max hover:[animation-play-state:paused]"
            style={{ animation: "slideMarquee 25s linear infinite" }}
          >
            {[0, 1].map((setIdx) => (
              <React.Fragment key={setIdx}>
                {alumni.map((item, idx) => (
                  <div
                    key={`${item.id}-${setIdx}-${idx}`}
                    className="w-[240px] sm:w-[280px] lg:w-[320px] flex-shrink-0 group/card relative flex flex-col bg-white rounded-[0px] border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden"
                  >
                    {/* Photo Container */}
                    <div className="relative aspect-[4/5] rounded-[0px] overflow-hidden bg-gray-50">
                      <img
                        src={getOptimizedImageUrl(item.imageUrl, { width: 640 })}
                        alt={item.name || "Alumni"}
                        className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover/card:scale-105"
                        loading="lazy"
                      />
                      {/* Subtle Dark Gradient Overlay on Hover for premium feel */}
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-black/20 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                        <h3 className="text-white text-xl md:text-2xl font-black transform translate-y-4 group-hover/card:translate-y-0 opacity-0 group-hover/card:opacity-100 transition-all duration-300 drop-shadow-lg">
                          {item.name}
                        </h3>
                        <p className="text-gray-300 text-sm font-medium transform translate-y-4 group-hover/card:translate-y-0 opacity-0 group-hover/card:opacity-100 transition-all duration-300 delay-75 mt-1 border-t border-white/20 pt-2">
                          {item.achievement}{item.passingYear ? ` • ${item.passingYear}` : ""}
                        </p>
                      </div>
                    </div>

                    {/* Minimalist Bottom Accent Line */}
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-teal-500 transform scale-x-0 group-hover/card:scale-x-100 transition-transform duration-300 origin-left" />
                  </div>
                ))}

                <div
                  className="flex-shrink-0 flex items-center justify-center px-2 sm:px-4 md:px-6 lg:px-8 aspect-[4/5] w-14 sm:w-20 md:w-24 lg:w-28 transition-all duration-300"
                >
                  <div className="flex items-center gap-2 sm:gap-3 md:gap-4 h-full py-4 sm:py-6 md:py-8">
                    {/* Subtle decorative line */}
                    <div className="w-px h-full bg-gradient-to-b from-transparent via-slate-200 to-transparent"></div>

                    {/* Bottom-to-Top Text */}
                    <span
                      className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-light text-emerald-500 select-none whitespace-nowrap transition-all duration-300"
                      style={{
                        writingMode: "vertical-rl",
                        transform: "rotate(180deg)", /* घुमाने के लिए ताकि नीचे से ऊपर पढ़ा जाए */
                        letterSpacing: "0.15em"
                      }}
                    >
                      PROUD <span className="font-semibold text-teal-500">ALUMNI</span>
                    </span>
                  </div>
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>
        {/* View All Button */}
        <div className="mt-16 flex justify-center">
          <a href="/alumni" className="group flex items-center gap-3 px-8 py-4 bg-slate-900 text-white font-bold rounded-full hover:bg-emerald-600 transition-all duration-300 shadow-xl shadow-slate-900/20 hover:shadow-emerald-600/30">
            <span>View All Alumni</span>
            <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
