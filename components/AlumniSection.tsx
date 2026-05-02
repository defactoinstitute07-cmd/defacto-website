"use client";

import { useEffect, useState } from "react";
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
      } finally {
        setLoading(false);
      }
    }
    fetchAlumni();
  }, []);

  if (loading || alumni.length === 0) return null;

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

        {/* Responsive Static Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-8 p-4 md:p-0">
          {alumni.map((a) => (
            <div
              key={a.id}
              className="relative aspect-[4/5] bg-gray-50 border border-gray-100 rounded-[0px] shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden group"
            >
              <img
                src={getOptimizedImageUrl(a.imageUrl, { width: 640 })}
                alt={a.name || "Alumni"}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
                decoding="async"
              />
            </div>
          ))}

          {/* Batch label — always after the last image */}
          <div className="col-span-full flex items-center gap-6 pt-4">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-emerald-200 to-transparent" />
            <span className="text-2xl md:text-3xl font-black tracking-tight text-slate-800 whitespace-nowrap">
              2025–26
            </span>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-emerald-200 to-transparent" />
          </div>
        </div>

      </div>
    </section>
  );
}
