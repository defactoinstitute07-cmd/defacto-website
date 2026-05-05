import React from "react";
import connectDB from "../../lib/mongodb";
import Alumni from "../../models/Alumni";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { getOptimizedImageUrl } from "../../lib/image-utils";

// Make the page dynamic so it fetches the latest alumni on load
export const revalidate = 0; 
export const dynamic = "force-dynamic";

export default async function AlumniPage() {
  await connectDB();
  // Fetch all alumni sorted by sequence then by date
  const alumni = await Alumni.find().sort({ sequence: 1, created_at: -1 }).lean();

  return (
    <div className="w-full max-w-[1400px] mx-auto px-6 sm:px-8 py-16">
      <div className="text-center mb-16 md:mb-24 space-y-4">
        <span className="inline-block px-4 py-1.5 text-xs font-bold tracking-[0.2em] uppercase text-emerald-600 bg-emerald-50 rounded-full border border-emerald-100 shadow-sm">
          Success Stories
        </span>
        <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight">
          Our Proud <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500">Alumni</span>
        </h1>
        <p className="text-slate-500 max-w-2xl mx-auto text-lg leading-relaxed">
          Celebrating the achievements and journeys of our students who have gone on to excel in their chosen fields.
        </p>
      </div>

      {alumni.length === 0 ? (
        <div className="text-center text-slate-400 py-20 font-medium">
          No alumni records found yet.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 md:gap-8">
          {alumni.map((item) => {
            // Convert MongoDB object to string fields for reliable rendering
            const name = String(item.name || "");
            const achievement = String(item.achievement || "");
            const passingYear = item.passingYear ? String(item.passingYear) : "";
            const imageUrl = String(item.imageUrl || "");
            
            return (
              <div
                key={String(item._id)}
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
                      {achievement}{passingYear ? ` • ${passingYear}` : ""}
                    </p>
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-teal-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
