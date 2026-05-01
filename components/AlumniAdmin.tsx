"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import {
  CLOUDINARY_MAX_IMAGE_BYTES,
  getCloudinaryAllowedFormatsValue,
  isAllowedImageFile,
} from "../lib/media-upload";

const uploadConstraintsMessage = `Only ${getCloudinaryAllowedFormatsValue().toUpperCase().replace(/,/g, ", ")} files up to ${Math.round(CLOUDINARY_MAX_IMAGE_BYTES / (1024 * 1024))} MB are allowed.`;

type AlumniItem = {
  id: string;
  name: string;
  achievement: string;
  passingYear?: string;
  sequence?: number;
  imageUrl: string;
};

export default function AlumniAdmin() {
  const [items, setItems] = useState<AlumniItem[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [achievement, setAchievement] = useState("");
  const [passingYear, setPassingYear] = useState("");
  const [sequence, setSequence] = useState("0");
  const [imageUrl, setImageUrl] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    fetchAlumni();
  }, []);

  async function fetchAlumni() {
    try {
      const res = await fetch("/api/alumni", { cache: "no-store" });
      const data = await res.json();
      setItems(data.alumni || []);
    } catch {
      setStatus("Failed to load alumni.");
    }
  }

  function handleEditClick(a: AlumniItem) {
    setEditingId(a.id);
    setName(a.name);
    setAchievement(a.achievement);
    setPassingYear(a.passingYear || "");
    setSequence(String(a.sequence || 0));
    setImageUrl(a.imageUrl);
    setStatus("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function resetForm() {
    setEditingId(null);
    setName("");
    setAchievement("");
    setPassingYear("");
    setSequence("0");
    setImageUrl("");
    setStatus("");
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!imageUrl) {
      setStatus("Please upload a photo first.");
      return;
    }

    setIsSaving(true);
    setStatus("");

    try {
      const method = editingId ? "PUT" : "POST";
      const payload = {
        id: editingId,
        name,
        achievement,
        passingYear,
        sequence: Number(sequence),
        imageUrl,
      };

      const res = await fetch("/api/alumni", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        setItems(data.alumni || []);
        resetForm();
        setStatus(editingId ? "Alumni updated." : "Alumni added successfully.");
      } else {
        setStatus(data.error || `Failed to ${editingId ? "update" : "add"} alumni.`);
      }
    } catch {
      setStatus("An error occurred while saving.");
    } finally {
      setIsSaving(false);
    }
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
        body: JSON.stringify({ folder: "alumni" }),
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
    if (!confirm("Remove this alumni record?")) return;

    const res = await fetch("/api/alumni", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    const data = await res.json();
    if (res.ok) {
      setItems(data.alumni || []);
      setStatus("Alumni deleted.");
    } else {
      setStatus(data.error || "Failed to delete alumni.");
    }
  }

  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 py-8 text-slate-900">
      <div className="bg-white/80 backdrop-blur-xl border border-slate-200 rounded-[2rem] p-6 sm:p-8 mb-12 shadow-xl transition-all hover:bg-white">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-10">
          <div className="p-3 bg-emerald-100 text-emerald-600 rounded-2xl w-fit">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              {editingId ? "Edit Alumni Profile" : "Alumni Management"}
            </h2>
            <p className="text-slate-500 text-sm">
              {editingId
                ? "Modify details for this alumni."
                : "Showcase your successful graduates."}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">
                Full Name
              </label>
              <input
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 text-slate-900 text-sm outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-400/20 transition-all font-medium placeholder-slate-400"
                placeholder="e.g., Priya Sharma"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">
                Achievement / Current Role
              </label>
              <input
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 text-slate-900 text-sm outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-400/20 transition-all font-medium placeholder-slate-400"
                placeholder="e.g., IIT Delhi, 99.5 percentile in JEE"
                value={achievement}
                onChange={(e) => setAchievement(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">
                Passing Year (optional)
              </label>
              <input
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 text-slate-900 text-sm outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-400/20 transition-all font-medium placeholder-slate-400"
                placeholder="e.g., 2024"
                value={passingYear}
                onChange={(e) => setPassingYear(e.target.value)}
              />
            </div>
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">
                Display Sequence
              </label>
              <input
                type="number"
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 text-slate-900 text-sm outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-400/20 transition-all font-medium placeholder-slate-400"
                placeholder="Lower numbers appear first"
                value={sequence}
                onChange={(e) => setSequence(e.target.value)}
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
                    className="h-16 w-16 rounded-2xl object-cover ring-2 ring-emerald-400"
                    alt="Alumni preview"
                  />
                  <span className="text-xs font-bold text-emerald-600">Photo Ready</span>
                </div>
              )}
            </div>
          </div>

          {status && (
            <div className="text-sm font-bold text-emerald-600 drop-shadow-sm">{status}</div>
          )}

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              type="submit"
              disabled={isSaving || isUploading || !imageUrl}
              className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-black py-4 rounded-[1.5rem] transition-all shadow-xl shadow-emerald-500/20 disabled:opacity-50 disabled:grayscale"
            >
              {isSaving
                ? "Saving..."
                : editingId
                ? "Update Alumni Profile"
                : "Add to Alumni Showcase"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="px-8 py-4 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-[1.5rem] transition-all"
              >
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Alumni Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((a) => (
          <div
            key={a.id}
            className="bg-white border border-slate-200 rounded-[2rem] p-6 shadow-sm hover:shadow-xl relative group overflow-hidden transition-all hover:border-slate-300"
          >
            <div className="flex flex-col items-center text-center relative z-10">
              <div className="relative mb-4">
                <img
                  src={a.imageUrl}
                  alt={a.name}
                  className="h-24 w-24 object-cover rounded-3xl ring-4 ring-slate-50 transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute -bottom-2 -right-2 bg-emerald-400 p-1.5 rounded-lg shadow-md">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
              <h3 className="font-bold text-slate-900 text-lg tracking-tight mb-1">{a.name}</h3>
              <p className="text-slate-500 text-xs font-semibold leading-relaxed px-2">
                {a.achievement}
              </p>
              {a.passingYear && (
                <span className="mt-2 inline-block px-3 py-0.5 bg-emerald-50 text-emerald-600 text-[10px] font-bold rounded-full border border-emerald-100">
                  Batch {a.passingYear}
                </span>
              )}
              {a.sequence !== undefined && (
                <p className="text-emerald-500 text-[10px] font-bold mt-1">Seq: {a.sequence}</p>
              )}

              <div className="mt-6 flex items-center gap-4">
                <button
                  className="text-[10px] font-black tracking-widest text-slate-400 hover:text-emerald-600 transition-colors uppercase"
                  onClick={() => handleEditClick(a)}
                >
                  Edit
                </button>
                <div className="w-[1px] h-3 bg-slate-200" />
                <button
                  className="text-[10px] font-black tracking-widest text-slate-400 hover:text-rose-600 transition-colors uppercase"
                  onClick={() => handleDelete(a.id)}
                >
                  Remove
                </button>
              </div>
            </div>
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-emerald-50 to-transparent blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        ))}
      </div>

      {items.length === 0 && (
        <div className="text-center py-16 text-slate-400 text-sm font-medium">
          No alumni added yet. Add your first alumni above.
        </div>
      )}
    </section>
  );
}
