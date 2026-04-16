import React from "react";
import connectDB from "../../lib/mongodb";
import Topper from "../../models/Topper";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { getOptimizedImageUrl } from "../../lib/image-utils";

// Make the page dynamic so it fetches the latest toppers on load
export const revalidate = 0; 
export const dynamic = "force-dynamic";

export default async function TopersPage() {
  await connectDB();
  // Fetch all toppers sorted by recent
  const toppers = await Topper.find().sort({ created_at: -1 }).lean();

  return (
    <div className="w-full max-w-[1400px] mx-auto px-6 sm:px-8 py-16">
      <div className="text-center mb-16 md:mb-24 space-y-4">
        <span className="inline-block px-4 py-1.5 text-xs font-bold tracking-[0.2em] uppercase text-blue-600 bg-blue-50 rounded-full border border-blue-100 shadow-sm">
          Our Proud Alumni
        </span>
        <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight">
          Hall of <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Fame</span>
        </h1>
        <p className="text-slate-500 max-w-2xl mx-auto text-lg leading-relaxed">
          Exploring the extraordinary dedication and success of all our brightest students.
        </p>
      </div>

      {toppers.length === 0 ? (
        <div className="text-center text-slate-400 py-20 font-medium">
          No toppers found yet.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 md:gap-8">
          {toppers.map((topper) => {
            // Convert MongoDB object to string fields for reliable rendering
            const name = String(topper.name || "");
            const board = String(topper.board || "");
            const studentClass = String(topper.studentClass || "");
            const imageUrl = String(topper.imageUrl || "");
            
            return (
              <div
                key={String(topper._id)}
                className="group relative flex flex-col bg-white rounded-[0px] border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden"
              >
                <div className="relative aspect-[4/5] rounded-[0px] overflow-hidden bg-gray-50">
                  <img
                    src={getOptimizedImageUrl(imageUrl, { width: 640 })}
                    alt={name}
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
                    <h3 className="text-white text-lg font-black transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300 drop-shadow-lg leading-tight">
                      {name}
                    </h3>
                    <p className="text-gray-300 text-xs font-medium transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300 delay-75 mt-1 border-t border-white/20 pt-1.5">
                      {board} • {studentClass}
                    </p>
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
