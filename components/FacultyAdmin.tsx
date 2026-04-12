"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import {
  CLOUDINARY_MAX_IMAGE_BYTES,
  getCloudinaryAllowedFormatsValue,
  isAllowedImageFile,
} from "../lib/media-upload";

const uploadConstraintsMessage = `Only ${getCloudinaryAllowedFormatsValue().toUpperCase().replace(/,/g, ", ")} files up to ${Math.round(CLOUDINARY_MAX_IMAGE_BYTES / (1024 * 1024))} MB are allowed.`;

type Faculty = {
  id: string;
  name: string;
  designation: string;
  imageUrl: string;
};

export default function FacultyAdmin() {
  const [faculty, setFaculty] = useState<Faculty[]>([]);
  const [name, setName] = useState("");
  const [designation, setDesignation] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    fetchFaculty();
  }, []);

  async function fetchFaculty() {
    const res = await fetch("/api/faculty", { cache: "no-store" });
    const data = await res.json();
    setFaculty(data.faculty || []);
  }

  async function handleAddFaculty(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!imageUrl) {
      setStatus("Please upload an image.");
      return;
    }

    setIsSaving(true);
    setStatus("");

    const res = await fetch("/api/faculty", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, designation, imageUrl }),
    });

    const data = await res.json();
    if (res.ok) {
      setFaculty(data.faculty || []);
      setName("");
      setDesignation("");
      setImageUrl("");
      setStatus("Faculty added.");
    } else {
      setStatus(data.error || "Failed to add faculty.");
    }

    setIsSaving(false);
  }

  async function handleImageUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!isAllowedImageFile(file)) {
      setStatus(uploadConstraintsMessage);
      event.target.value = "";
      return;
    }

    setIsUploading(true);
    setStatus("Uploading...");

    try {
      const signatureRes = await fetch("/api/cloudinary-signature", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ folder: "faculty" }),
      });
      const signature = await signatureRes.json();
      if (!signatureRes.ok) throw new Error(signature.error || "Signature failed");

      const formData = new FormData();
      formData.append("file", file);
      formData.append("api_key", signature.apiKey);
      formData.append("timestamp", String(signature.timestamp));
      formData.append("signature", signature.signature);
      formData.append("folder", signature.folder);
      formData.append("allowed_formats", (signature.allowedFormats || []).join(","));

      const uploadRes = await fetch(
        `https://api.cloudinary.com/v1_1/${signature.cloudName}/image/upload`,
        { method: "POST", body: formData },
      );
      const uploadData = await uploadRes.json();
      if (!uploadData.secure_url) throw new Error("Upload failed");

      setImageUrl(uploadData.secure_url);
      setStatus("Upload successful.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Upload error.");
    } finally {
      setIsUploading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Remove this faculty profile?")) return;

    const res = await fetch("/api/faculty", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    const data = await res.json();
    if (res.ok) {
      setFaculty(data.faculty || []);
    } else {
      setStatus(data.error || "Failed to delete faculty.");
    }
  }

  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 py-8 text-slate-900">
      <div className="bg-white/80 backdrop-blur-xl border border-slate-200 rounded-[2rem] p-6 sm:p-8 mb-12 shadow-xl transition-all hover:bg-white">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-10">
          <div className="p-3 bg-amber-100 text-amber-600 rounded-2xl w-fit">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Faculty Management</h2>
            <p className="text-slate-500 text-sm">Update your team of expert educators.</p>
          </div>
        </div>

        <form onSubmit={handleAddFaculty} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">
                Full Name
              </label>
              <input
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 text-slate-900 text-sm outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-400/20 transition-all font-medium placeholder-slate-400"
                placeholder="e.g., Dr. John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">
                Designation
              </label>
              <input
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 text-slate-900 text-sm outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-400/20 transition-all font-medium placeholder-slate-400"
                placeholder="e.g., Senior Maths Faculty"
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">
              Profile Photo
            </label>
            <div className="flex flex-col sm:flex-row sm:items-center gap-6">
              <label className="cursor-pointer bg-slate-900 text-white px-8 py-3 rounded-xl font-black text-xs shadow-lg hover:bg-slate-800 transition-all uppercase tracking-wider text-center w-full sm:w-auto">
                {isUploading ? "Uploading..." : "Choose Photo"}
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/avif"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </label>
              {imageUrl && (
                <div className="flex items-center gap-4 animate-in fade-in slide-in-from-left-4 duration-300">
                  <img
                    src={imageUrl}
                    className="h-16 w-16 rounded-2xl object-cover ring-2 ring-amber-400"
                    alt="Faculty preview"
                  />
                  <span className="text-xs font-bold text-emerald-600">Photo Ready</span>
                </div>
              )}
            </div>
          </div>

          {status && <div className="text-sm font-bold text-amber-600 drop-shadow-sm">{status}</div>}

          <button
            type="submit"
            disabled={isSaving || isUploading || !imageUrl}
            className="w-full bg-amber-400 hover:bg-amber-500 text-slate-900 font-black py-4 rounded-[1.5rem] transition-all shadow-xl shadow-amber-400/20 disabled:opacity-50 disabled:grayscale"
          >
            {isSaving ? "Saving Profile..." : "Add to Faculty Team"}
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {faculty.map((f) => (
          <div
            key={f.id}
            className="bg-white border border-slate-200 rounded-[2rem] p-6 shadow-sm hover:shadow-xl relative group overflow-hidden transition-all hover:border-slate-300"
          >
            <div className="flex flex-col items-center text-center relative z-10">
              <div className="relative mb-4">
                <img
                  src={f.imageUrl}
                  alt={f.name}
                  className="h-24 w-24 object-cover rounded-3xl ring-4 ring-slate-50 transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute -bottom-2 -right-2 bg-amber-400 p-1.5 rounded-lg shadow-md">
                  <svg className="w-3 h-3 text-slate-900" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3z" />
                    <path d="M7.667 10.844l1.837.787a2 2 0 001.592 0l7-3V14a1 1 0 01-.606.919l-7 3a1 1 0 01-.788 0l-7-3A1 1 0 013 14V8.631l4.667 2.213z" />
                  </svg>
                </div>
              </div>
              <h3 className="font-bold text-slate-900 text-lg tracking-tight mb-1">{f.name}</h3>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">
                {f.designation}
              </p>

              <button
                className="mt-6 text-[10px] font-black tracking-widest text-slate-400 hover:text-rose-600 transition-colors uppercase"
                onClick={() => handleDelete(f.id)}
              >
                Remove Profile
              </button>
            </div>
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-slate-100 to-transparent blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        ))}
      </div>
    </section>
  );
}