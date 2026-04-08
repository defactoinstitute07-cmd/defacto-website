"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { getCloudinarySrcSet, getOptimizedImageUrl } from "../lib/image-utils";

type GalleryItem = {
  _id: string;
  image_url: string;
  caption: string;
  tag: string;
};

export default function StudentGallery() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    async function fetchGallery() {
      try {
        const res = await fetch("/api/gallery");
        const data = await res.json();
        setItems(data.gallery || []);
      } catch (error) {
        console.error("Failed to fetch gallery:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchGallery();
  }, []);

  // Only show "trip" tagged photos on the homepage
  const tripItems = items.filter((item) => item.tag === "trip");
  const showcaseItems = tripItems.slice(0, 5);
  const rotationCount = showcaseItems.length;
  const activeRotation = rotationCount > 0 ? rotation % rotationCount : 0;

  useEffect(() => {
    if (rotationCount <= 1) return;
    const timer = setInterval(() => {
      setRotation((prev) => (prev + 1) % rotationCount);
    }, 3200);
    return () => clearInterval(timer);
  }, [rotationCount]);

  const visible =
    rotationCount > 0
      ? showcaseItems.map(
          (_, index) => showcaseItems[(index + activeRotation) % rotationCount]
        )
      : [];

  if (isLoading) {
    return (
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-3 gap-4 animate-pulse">
            <div className="col-span-2 row-span-2 h-96 bg-slate-100 rounded-3xl" />
            <div className="h-44 bg-slate-100 rounded-3xl" />
            <div className="h-44 bg-slate-100 rounded-3xl" />
          </div>
        </div>
      </section>
    );
  }

  if (tripItems.length === 0) return null;

  const large = visible[0];
  const small = visible.slice(1, 5);

  return (
<section className="py-16 md:py-24 bg-white overflow-hidden px-4 sm:px-6">
  <div className="mx-auto max-w-7xl">
    
    {/* Header */}
    {/* Mobile pe gap-6, desktop pe gap-8. Button mobile par full width ho jayega */}
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 md:gap-8 mb-10 md:mb-14">
      <div className="space-y-3 md:space-y-4">
        <span className="inline-block px-3 py-1.5 md:px-4 text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase text-amber-600 bg-amber-50 rounded-full border border-amber-100">
          Life at Defacto
        </span>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
          Defacto{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-500">
            Life & Events
          </span>
        </h2>
        <p className="text-slate-500 max-w-xl text-sm sm:text-base md:text-lg leading-relaxed">
          From adventurous student trips to our impactful social initiatives
          and vibrant institute celebrations.
        </p>
      </div>
      
      {/* Button: w-full and justify-center for mobile, w-auto for desktop */}
      <Link
        href="/gallery"
        className="group flex w-full md:w-auto items-center justify-center gap-3 px-6 py-3.5 md:px-8 md:py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm md:text-base rounded-xl md:rounded-2xl shadow-xl shadow-slate-900/10 transition-all duration-300 hover:-translate-y-0.5 shrink-0 active:scale-95"
      >
        View Institute Gallery
        <svg className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6" />
        </svg>
      </Link>
    </div>

    {/* 1 Large + 4 Small Grid */}
    {large && (
      <div className="flex flex-col md:flex-row gap-3 md:gap-4">

        {/* LEFT BIG IMAGE (30-40%) */}
        {/* CRITICAL FIX: Added aspect-[4/3] for mobile, h-full for desktop */}
        <div className="md:w-[50%] group relative rounded-2xl md:rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer aspect-[4/3] sm:aspect-[16/9] md:aspect-auto md:min-h-[400px]">
          <div className="h-full w-full absolute inset-0">
            <img
              src={getOptimizedImageUrl(large.image_url, { width: 1280 })}
              srcSet={getCloudinarySrcSet(large.image_url, [640, 960, 1280, 1600])}
              sizes="(min-width: 768px) 50vw, 100vw"
              alt={large.caption}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
              decoding="async"
            />
          </div>

          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/30 to-transparent pointer-events-none" />

          {/* Adjusted padding and text size for mobile */}
          <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
            <span className="inline-block px-2.5 py-1 bg-amber-400 text-slate-900 text-[9px] md:text-[10px] font-black rounded-md md:rounded-lg uppercase tracking-wider mb-2 md:mb-3">
              {large.tag || "trip"}
            </span>

            <p className="text-white font-bold text-base md:text-lg leading-snug drop-shadow-md">
              {large.caption}
            </p>
          </div>
        </div>

        {/* RIGHT SIDE (60-70%) */}
        {/* Reduced gap for mobile: gap-3 */}
        <div className="md:w-[50%] grid grid-cols-2 gap-3 md:gap-4">
          {small.map((item) => (
            <div
              key={item._id}
              className="group relative rounded-xl md:rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 cursor-pointer"
            >
              {/* Aspect ratio square for mobile to save space, 4/3 for desktop */}
              <div className="aspect-square sm:aspect-[4/3] w-full h-full relative">
                <img
                  src={getOptimizedImageUrl(item.image_url, { width: 720 })}
                  srcSet={getCloudinarySrcSet(item.image_url, [320, 480, 720, 960])}
                  sizes="(min-width: 768px) 25vw, 50vw"
                  alt={item.caption}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                  decoding="async"
                />
              </div>

              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/10 to-transparent pointer-events-none" />

              <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4">
                <span className="inline-block px-2 py-0.5 bg-amber-400 text-slate-900 text-[8px] md:text-[9px] font-bold rounded md:rounded-md uppercase tracking-wider mb-1">
                  {item.tag || "trip"}
                </span>

                <p className="text-white font-bold text-xs md:text-sm line-clamp-2 drop-shadow-md">
                  {item.caption}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    )}

    {/* Rotation dots */}
    {rotationCount > 1 && (
      <div className="flex justify-center gap-2 mt-8 md:mt-10">
        {Array.from({ length: rotationCount }).map((_, i) => (
          <button
            key={i}
            onClick={() => setRotation(i)}
            className={`h-2 rounded-full transition-all duration-300 ${i === activeRotation
              ? "w-8 bg-amber-500"
              : "w-2 bg-slate-200 hover:bg-slate-400"
            }`}
            aria-label={`Show photo ${i + 1} in the featured slot`}
          />
        ))}
      </div>
    )}
  </div>
</section>
  );
}
