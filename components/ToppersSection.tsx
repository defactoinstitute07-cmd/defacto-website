"use client";

import React, { useEffect, useState } from "react";
import { getOptimizedImageUrl } from "../lib/image-utils";

type Topper = {
  _id: string;
  name: string;
  board: string;
  studentClass: string;
  imageUrl: string;
};

export default function ToppersSection() {
  const [toppers, setToppers] = useState<Topper[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchToppers() {
      try {
        const res = await fetch("/api/toppers", { cache: "no-store" });
        const data = await res.json();
        setToppers(data.toppers || []);
      } catch (err) {
        console.error("Failed to load toppers", err);
      } finally {
        setLoading(false);
      }
    }
    fetchToppers();
  }, []);

  if (loading || toppers.length === 0) return null;

  return (
    <section id="toppers" className="relative py-20 md:py-32 overflow-hidden bg-white">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-50 rounded-full blur-[120px] -mr-64 -mt-64 opacity-60" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-amber-50 rounded-full blur-[120px] -ml-64 -mb-64 opacity-60" />

      <div className="relative z-10 mx-auto max-w-[1400px] px-6 sm:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 md:mb-24 space-y-4">
          <span className="inline-block px-4 py-1.5 text-xs font-bold tracking-[0.2em] uppercase text-blue-600 bg-blue-50 rounded-full border border-blue-100">
            Hall of Fame
          </span>
          <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight">
            Our Academic <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Champions</span>
          </h2>

        </div>

        {/* Scrolling Marquee Container */}
        <div className="relative flex overflow-hidden group">
          {/* Fading Edges for Marquee */}
          <div className="absolute top-0 left-0 bottom-0 w-12 md:w-24 bg-gradient-to-r from-white/60 to-transparent z-10 pointer-events-none" />
          <div className="absolute top-0 right-0 bottom-0 w-12 md:w-24 bg-gradient-to-l from-white/60 to-transparent z-10 pointer-events-none" />

          {/* Marquee Track */}
          <div
            className="flex gap-6 md:gap-8 min-w-max hover:[animation-play-state:paused]"
            style={{ animation: "slideMarquee 25s linear infinite" }}
          >
            {[...toppers, ...toppers].map((topper, idx) => (
              <div
                key={`${topper._id}-${idx}`}
                className="w-[240px] sm:w-[280px] lg:w-[320px] flex-shrink-0 group/card relative flex flex-col bg-white rounded-[0px] border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden"
              >
                {/* Photo Container */}
                <div className="relative aspect-[4/5] rounded-[0px] overflow-hidden bg-gray-50">
                  <img
                    src={getOptimizedImageUrl(topper.imageUrl, { width: 640 })}
                    alt={topper.name || "Topper"}
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover/card:scale-105"
                    loading="lazy"
                  />
                  {/* Subtle Dark Gradient Overlay on Hover for premium feel */}
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-black/20 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                    <h3 className="text-white text-xl md:text-2xl font-black transform translate-y-4 group-hover/card:translate-y-0 opacity-0 group-hover/card:opacity-100 transition-all duration-300 drop-shadow-lg">
                      {topper.name}
                    </h3>
                    <p className="text-gray-300 text-sm font-medium transform translate-y-4 group-hover/card:translate-y-0 opacity-0 group-hover/card:opacity-100 transition-all duration-300 delay-75 mt-1 border-t border-white/20 pt-2">
                      {topper.board} • {topper.studentClass}
                    </p>
                  </div>
                </div>

                {/* Minimalist Bottom Accent Line */}
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-600 transform scale-x-0 group-hover/card:scale-x-100 transition-transform duration-300 origin-left" />
              </div>
            ))}
          </div>
        </div>

        {/* View All Button */}
        <div className="mt-16 flex justify-center">
          <a href="/toppers" className="group flex items-center gap-3 px-8 py-4 bg-slate-900 text-white font-bold rounded-full hover:bg-blue-600 transition-all duration-300 shadow-xl shadow-slate-900/20 hover:shadow-blue-600/30">
            <span>View All Toppers</span>
            <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
