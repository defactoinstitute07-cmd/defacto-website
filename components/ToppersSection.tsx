"use client";

import React, { useEffect, useState } from "react";
import { getOptimizedImageUrl } from "../lib/image-utils";

type Topper = {
  _id: string;
  name: string;
  classExam: string;
  achievement: string;
  year: string;
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
          <p className="text-slate-500 max-w-2xl mx-auto text-lg leading-relaxed">
            Celebrating the extraordinary dedication and success of our brightest students who have made us proud.
          </p>
        </div>

        {/* Toppers Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
          {toppers.map((topper, idx) => (
            <div
              key={topper._id}
              className="group relative flex flex-col bg-white rounded-[2.5rem] border border-slate-100 p-4 shadow-xl shadow-slate-200/40 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-200/50 hover:-translate-y-2 overflow-hidden"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              {/* Achievement Badge */}
              <div className="absolute top-6 left-6 z-20 bg-white/90 backdrop-blur-md border border-slate-200 px-3 py-1 rounded-full shadow-sm">
                <span className="text-[10px] font-black uppercase tracking-widest text-blue-600">
                  Batch {topper.year}
                </span>
              </div>

              {/* Photo Container */}
              <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden bg-slate-100 mb-6">
                <img
                  src={getOptimizedImageUrl(topper.imageUrl, { width: 640 })}
                  alt={topper.name}
                  className="h-full w-full object-cover transition-all duration-700 group-hover:scale-110"
                  loading="lazy"
                />
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>

              {/* Content */}
              <div className="text-center space-y-2 pb-2">
                <h3 className="text-2xl font-black text-slate-900 group-hover:text-blue-600 transition-colors">
                  {topper.name}
                </h3>
                <p className="text-sm font-bold text-slate-500 uppercase tracking-[0.1em]">
                  {topper.classExam}
                </p>
                <div className="pt-3">
                  <span className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black text-lg rounded-2xl shadow-lg shadow-blue-500/30 inline-block transform group-hover:scale-105 transition-transform">
                    {topper.achievement}
                  </span>
                </div>
              </div>

              {/* Decorative Corner Glow */}
              <div className="absolute -bottom-12 -right-12 w-24 h-24 rounded-full bg-blue-400 blur-[40px] opacity-0 group-hover:opacity-20 transition-opacity duration-500" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
