"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { getCloudinarySrcSet, getOptimizedImageUrl } from "../../lib/image-utils";

type GalleryItem = {
  _id: string;
  image_url: string;
  caption: string;
  tag: string;
  created_at: string;
};

const TAG_OPTIONS = [
  { value: "all", label: "All Photos" },
  { value: "trip", label: "Student Trips" },
  { value: "social", label: "Social / CSR" },
  { value: "institute", label: "Institute" },
  { value: "institute events", label: "Events" },
];

function FilterIcon({ value }: { value: string }) {
  switch (value) {
    case "all":
      return (
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3z"
          />
        </svg>
      );
    case "trip":
      return (
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M3 19h18M4 19l4.5-10 4 5 3.5-8 4 13"
          />
        </svg>
      );
    case "social":
      return (
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M16 11c1.657 0 3-1.567 3-3.5S17.657 4 16 4s-3 1.567-3 3.5 1.343 3.5 3 3.5zM8 13c1.657 0 3-1.567 3-3.5S9.657 6 8 6 5 7.567 5 9.5 6.343 13 8 13zm8 7v-1c0-2.21-1.79-4-4-4h-1c-2.21 0-4 1.79-4 4v1m13 0v-1c0-1.657-1.343-3-3-3h-1"
          />
        </svg>
      );
    case "institute":
      return (
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 20h16M6 20V9l6-4 6 4v11M9 20v-4h6v4M8 9h.01M16 9h.01"
          />
        </svg>
      );
    case "institute events":
      return (
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M8 4v3m8-3v3M4 10h16M7 14h.01M12 14h.01M17 14h.01M7 18h.01M12 18h.01M6 7h12a2 2 0 012 2v9a2 2 0 01-2 2H6a2 2 0 01-2-2V9a2 2 0 012-2z"
          />
        </svg>
      );
    default:
      return null;
  }
}

export default function GalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);

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

  const filtered = useMemo(() => {
    if (activeFilter === "all") return items;
    return items.filter((item) => item.tag === activeFilter);
  }, [items, activeFilter]);

  const tagCounts = useMemo(() => {
    const counts: Record<string, number> = { all: items.length };
    items.forEach((item) => {
      const t = item.tag || "trip";
      counts[t] = (counts[t] || 0) + 1;
    });
    return counts;
  }, [items]);

  return (
    <>
{/* Hero Banner */}
<section className="relative -mx-4 sm:-mx-6 lg:-mx-8 bg-slate-900 overflow-hidden">
  {/* Ambient Glows - Mobile par scale down kiye hain taaki content chup na jaye */}
  <div className="absolute inset-0 pointer-events-none">
    <div className="absolute top-[-10%] right-[-10%] w-[80%] h-[80%] md:w-[60%] md:h-[60%] bg-amber-500/10 blur-[80px] md:blur-[120px] rounded-full" />
    <div className="absolute bottom-[-10%] left-[-10%] w-[70%] h-[70%] md:w-[50%] md:h-[50%] bg-orange-600/10 blur-[80px] md:blur-[120px] rounded-full" />
  </div>

  {/* Main Content Container - Padding adjust ki hai (py-16 mobile, py-28 desktop) */}
  <div className="relative z-10 mx-auto max-w-7xl px-5 py-10 sm:px-6 md:py-28 lg:px-8">
    
    {/* Back to Home Link */}
    <Link
      href="/"
      className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-xs md:text-sm font-medium mb-6 md:mb-8 transition-colors group w-fit"
    >
      <svg
        className="w-3.5 h-3.5 md:w-4 md:h-4 group-hover:-translate-x-1 transition-transform"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2.5"
          d="M15 19l-7-7 7-7"
        />
      </svg>
      Back to Home
    </Link>

    <div className="max-w-3xl">
      {/* Eyebrow Badge */}
      <span className="inline-block px-3 py-1.5 md:px-4 md:py-1.5 text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase text-amber-400 bg-amber-400/10 rounded-full border border-amber-400/20 mb-4 md:mb-6">
        Institute Gallery
      </span>
      
      {/* Main Heading - Responsive text sizes */}
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight mb-4 md:mb-5 leading-[1.1]">
        Capturing{" "}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400 block sm:inline">
          Moments
        </span>
      </h1>
      
      {/* Description */}
      <p className="text-slate-400 max-w-2xl text-sm sm:text-base md:text-lg leading-relaxed md:leading-relaxed">
        A visual journey through the life, events, and memories that make
        Defacto Institute a place of learning and growth.
      </p>
    </div>
    
  </div>
</section>

      {/* Filter Bar */}
      <section className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-slate-100 -mx-4 sm:-mx-6 lg:-mx-8">
        <div className="mx-auto max-w-7xl px-5 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            {TAG_OPTIONS.map((opt) => {
              const count = tagCounts[opt.value] ?? 0;
              const isActive = activeFilter === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => setActiveFilter(opt.value)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 whitespace-nowrap shrink-0 ${
                    isActive
                      ? "bg-slate-900 text-white shadow-lg shadow-slate-900/10"
                      : "bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-800"
                  }`}
                >
                  <span className="flex h-5 w-5 items-center justify-center" aria-hidden="true">
                    <FilterIcon value={opt.value} />
                  </span>
                  {opt.label}
                  <span
                    className={`text-[10px] font-black px-1.5 py-0.5 rounded-md ${
                      isActive
                        ? "bg-amber-400 text-slate-900"
                        : "bg-slate-200 text-slate-400"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-square bg-slate-100 rounded-2xl animate-pulse"
                />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-32 text-center">
              <div className="text-5xl mb-4">📷</div>
              <h3 className="text-xl font-bold text-slate-400 mb-2">
                No photos found
              </h3>
              <p className="text-slate-400 text-sm">
                {activeFilter !== "all"
                  ? "Try a different category filter."
                  : "The gallery is empty. Photos will appear here once uploaded."}
              </p>
              {activeFilter !== "all" && (
                <button
                  onClick={() => setActiveFilter("all")}
                  className="mt-6 px-6 py-2.5 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-slate-800 transition-colors"
                >
                  Show All Photos
                </button>
              )}
            </div>
          ) : (
            <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
              {filtered.map((item) => (
                <div
                  key={item._id}
                  onClick={() => setSelectedImage(item)}
                  className="break-inside-avoid group relative rounded-2xl overflow-hidden cursor-pointer shadow-md shadow-slate-200/50 hover:shadow-2xl hover:shadow-amber-400/10 transition-all duration-500 hover:-translate-y-1"
                >
                  <img
                    src={getOptimizedImageUrl(item.image_url, { width: 960 })}
                    srcSet={getCloudinarySrcSet(item.image_url, [320, 480, 720, 960, 1280])}
                    sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
                    alt={item.caption}
                    className="w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <span className="inline-block px-2 py-0.5 bg-amber-400 text-slate-900 text-[9px] font-black rounded-md uppercase tracking-wider mb-2">
                      {item.tag || "trip"}
                    </span>
                    {item.caption && (
                      <p className="text-white font-bold text-sm leading-snug drop-shadow-lg line-clamp-2">
                        {item.caption}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {!isLoading && filtered.length > 0 && (
            <div className="text-center mt-12">
              <p className="text-slate-400 text-sm font-medium">
                Showing{" "}
                <span className="text-slate-700 font-bold">
                  {filtered.length}
                </span>{" "}
                {filtered.length === 1 ? "photo" : "photos"}
                {activeFilter !== "all" && (
                  <>
                    {" "}in{" "}
                    <span className="text-amber-600 font-bold">
                      {TAG_OPTIONS.find((t) => t.value === activeFilter)?.label}
                    </span>
                  </>
                )}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Lightbox Modal */}
      {selectedImage && (() => {
        const currentIndex = filtered.findIndex((i) => i._id === selectedImage._id);
        const hasPrev = currentIndex > 0;
        const hasNext = currentIndex < filtered.length - 1;
        const goPrev = () => hasPrev && setSelectedImage(filtered[currentIndex - 1]);
        const goNext = () => hasNext && setSelectedImage(filtered[currentIndex + 1]);

        return (
          <div
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
            onKeyDown={(e) => {
              if (e.key === "ArrowLeft") goPrev();
              if (e.key === "ArrowRight") goNext();
              if (e.key === "Escape") setSelectedImage(null);
            }}
            tabIndex={0}
            ref={(el) => el?.focus()}
          >
            {/* Previous Button */}
            {hasPrev && (
              <button
                onClick={(e) => { e.stopPropagation(); goPrev(); }}
                className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-white transition-all border border-white/10 hover:border-white/20"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}

            {/* Next Button */}
            {hasNext && (
              <button
                onClick={(e) => { e.stopPropagation(); goNext(); }}
                className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-white transition-all border border-white/10 hover:border-white/20"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}

            <div
              className="relative max-w-5xl max-h-[90vh] w-full"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close + Counter */}
              <div className="absolute -top-12 left-0 right-0 flex items-center justify-between">
                <span className="text-white/50 text-sm font-bold">
                  {currentIndex + 1} / {filtered.length}
                </span>
                <button
                  onClick={() => setSelectedImage(null)}
                  className="text-white/60 hover:text-white transition-colors"
                >
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <img
                src={getOptimizedImageUrl(selectedImage.image_url, { width: 1600 })}
                srcSet={getCloudinarySrcSet(selectedImage.image_url, [720, 960, 1280, 1600, 2000])}
                sizes="90vw"
                alt={selectedImage.caption}
                className="w-full max-h-[80vh] object-contain rounded-2xl"
                decoding="async"
              />

              {(selectedImage.caption || selectedImage.tag) && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 rounded-b-2xl">
                  <span className="inline-block px-3 py-1 bg-amber-400 text-slate-900 text-[10px] font-black rounded-lg uppercase tracking-wider mb-2">
                    {selectedImage.tag || "trip"}
                  </span>
                  {selectedImage.caption && (
                    <p className="text-white font-bold text-lg">{selectedImage.caption}</p>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })()}
    </>
  );
}
