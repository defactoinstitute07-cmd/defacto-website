import React from "react";

export default function Loading() {
  return (
    <div className="w-full max-w-[1400px] mx-auto px-6 sm:px-8 py-16">
      <div className="text-center mb-16 md:mb-24 space-y-4">
        <div className="mx-auto h-6 w-32 bg-slate-100 animate-pulse rounded-full" />
        <div className="mx-auto h-12 md:h-16 w-3/4 max-w-2xl bg-slate-100 animate-pulse rounded-xl" />
        <div className="mx-auto h-6 w-1/2 max-w-lg bg-slate-50 animate-pulse rounded-lg" />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 md:gap-8">
        {[...Array(10)].map((_, i) => (
          <div key={i} className="flex flex-col bg-slate-50 border border-gray-100 rounded-[0px] overflow-hidden">
            <div className="aspect-[4/5] bg-slate-200 animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}
