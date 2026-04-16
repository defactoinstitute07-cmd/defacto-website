"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import {
  CLOUDINARY_MAX_IMAGE_BYTES,
  getCloudinaryAllowedFormatsValue,
  isAllowedImageFile,
} from "../lib/media-upload";

type Topper = {
  _id: string;
  name: string;
  board: string;
  studentClass: string;
  imageUrl: string;
  created_at: string;
};

export default function ToppersAdmin() {
  const [items, setItems] = useState<Topper[]>([]);
  const [name, setName] = useState("");
  const [board, setBoard] = useState("CBSE");
  const [studentClass, setStudentClass] = useState("Class 12");
  const [imageUrl, setImageUrl] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    fetchToppers();
  }, []);

  async function fetchToppers() {
    try {
      const res = await fetch("/api/toppers", { cache: "no-store" });
      const data = await res.json();
      setItems(data.toppers || []);
    } catch (err) {
      setStatus("Failed to load toppers.");
    }
  }

  async function handleAdd(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!imageUrl) {
      setStatus("Please upload a topper photo first.");
      return;
    }
    
    if (!name.trim()) {
      setStatus("Please enter the student's name.");
      return;
    }

    setIsSaving(true);
    setStatus("");

    try {
      const res = await fetch("/api/toppers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, board, studentClass, imageUrl }),
      });

      const data = await res.json();

      if (res.ok) {
        setItems([data.topper, ...items]);
        setName("");
        setBoard("CBSE");
        setStudentClass("Class 12");
        setImageUrl("");
        setStatus("Topper added successfully.");
      } else {
        setStatus(data.error || "Failed to add topper.");
      }
    } catch (err) {
      setStatus("Network error. Please try again.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleImageUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!isAllowedImageFile(file)) {
      setStatus(`Unsupported format. Use JPG, PNG or WEBP.`);
      event.target.value = "";
      return;
    }

    setIsUploading(true);
    setStatus("Uploading to Cloudinary...");

    try {
      const sigRes = await fetch("/api/cloudinary-signature", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ folder: "toppers" }),
      });

      if (!sigRes.ok) throw new Error("Signature failed.");
      const signature = await sigRes.json();

      const formData = new FormData();
      formData.append("file", file);
      formData.append("api_key", signature.apiKey);
      formData.append("timestamp", String(signature.timestamp));
      formData.append("signature", signature.signature);
      formData.append("folder", signature.folder);
      formData.append("allowed_formats", (signature.allowedFormats || []).join(","));

      const uploadRes = await fetch(
        `https://api.cloudinary.com/v1_1/${signature.cloudName}/image/upload`,
        { method: "POST", body: formData }
      );

      const uploadData = await uploadRes.json();
      if (!uploadData.secure_url) throw new Error("Upload failed.");

      setImageUrl(uploadData.secure_url);
      setStatus("Photo ready.");
    } catch (error) {
      setStatus("Image upload failed.");
    } finally {
      setIsUploading(false);
    }

    event.target.value = "";
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this topper record?")) return;

    try {
      const res = await fetch("/api/toppers", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (res.ok) {
        setItems(items.filter((item) => item._id !== id));
        setStatus("Record deleted.");
      } else {
        setStatus("Delete failed.");
      }
    } catch (err) {
      setStatus("Network error.");
    }
  }

  return (
    <section className="max-w-4xl mx-auto py-8 px-4 sm:px-6 text-slate-900">
      <div className="bg-white border border-slate-200 rounded-[2rem] p-6 sm:p-8 mb-12 shadow-xl shadow-slate-200/50">
        <div className="flex items-center gap-4 mb-10">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-2xl">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-7.714 2.143L11 21l-2.286-6.857L1 12l7.714-2.143L11 3z" />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-bold">Toppers Management</h2>
            <p className="text-slate-500 text-sm">Update the Hall of Fame with new achievements.</p>
          </div>
        </div>

        <form onSubmit={handleAdd} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Student Name</label>
              <input
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-blue-400 focus:ring-4 focus:ring-blue-400/10 outline-none transition-all"
                placeholder="e.g. Rahul Sharma"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Board</label>
              <select
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-blue-400 focus:ring-4 focus:ring-blue-400/10 outline-none transition-all text-slate-700"
                value={board}
                onChange={(e) => setBoard(e.target.value)}
              >
                <option value="CBSE">CBSE</option>
                <option value="ICSE">ICSE</option>
                <option value="UP Board">UP Board</option>
                <option value="Bihar Board">Bihar Board</option>
                <option value="State Board">State Board</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Class</label>
              <select
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-blue-400 focus:ring-4 focus:ring-blue-400/10 outline-none transition-all text-slate-700"
                value={studentClass}
                onChange={(e) => setStudentClass(e.target.value)}
              >
                <option value="Class 10">Class 10</option>
                <option value="Class 11">Class 11</option>
                <option value="Class 12">Class 12</option>
                <option value="Dropper">Dropper</option>
                <option value="Foundation">Foundation</option>
                <option value="Alumni">Alumni</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Photo Upload</label>
            <div className="flex items-center gap-6">
              <label className="flex-1 cursor-pointer group bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-6 flex flex-col items-center justify-center hover:border-blue-400 hover:bg-white transition-all">
                <svg className="w-8 h-8 text-slate-300 group-hover:text-blue-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                <span className="text-xs font-bold text-slate-400">{isUploading ? "Uploading..." : "Click to upload photo"}</span>
                <input type="file" className="hidden" onChange={handleImageUpload} disabled={isUploading} />
              </label>
              {imageUrl && (
                <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-blue-400 shadow-md flex-shrink-0">
                  <img src={imageUrl} alt="Preview" className="h-full w-full object-cover" />
                </div>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={isSaving || isUploading || !imageUrl}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg transition-all disabled:opacity-50"
          >
            {isSaving ? "Saving..." : "Add Photo to Hall of Fame"}
          </button>
          
          {status && <p className="text-center text-xs font-bold text-blue-600">{status}</p>}
        </form>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {items.map((item) => (
          <div key={item._id} className="relative group bg-white border border-slate-200 rounded-3xl p-2 flex flex-col shadow-sm hover:shadow-md transition-shadow">
            <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-slate-100 relative">
              <img src={item.imageUrl} alt={item.name} className="h-full w-full object-cover" />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 pt-12">
                <p className="text-white font-bold text-sm truncate">{item.name}</p>
                <p className="text-white/70 text-[10px] font-medium tracking-wide mt-0.5">{item.board} • {item.studentClass}</p>
              </div>
            </div>
            {/* Delete button layered on top on hover */}
            <button
              onClick={() => handleDelete(item._id)}
              className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur text-rose-500 hover:bg-rose-50 hover:text-rose-600 rounded-xl shadow-sm opacity-0 group-hover:opacity-100 transition-all"
              aria-label="Delete"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
