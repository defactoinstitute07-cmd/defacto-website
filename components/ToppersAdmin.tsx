"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import {
  CLOUDINARY_MAX_IMAGE_BYTES,
  getCloudinaryAllowedFormatsValue,
  isAllowedImageFile,
} from "../lib/media-upload";

const uploadConstraintsMessage = `Only ${getCloudinaryAllowedFormatsValue().toUpperCase().replace(/,/g, ", ")} files up to ${Math.round(CLOUDINARY_MAX_IMAGE_BYTES / (1024 * 1024))} MB are allowed.`;

type Topper = {
  _id: string;
  name: string;
  board: string;
  studentClass: string;
  percentage: number | null;
  imageUrl: string;
  created_at: string;
};

export default function ToppersAdmin() {
  const [items, setItems] = useState<Topper[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [board, setBoard] = useState("CBSE");
  const [studentClass, setStudentClass] = useState("Class 12");
  const [percentage, setPercentage] = useState("");
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
    } catch {
      setStatus("Failed to load toppers.");
    }
  }

  function handleEditClick(t: Topper) {
    setEditingId(t._id);
    setName(t.name);
    setBoard(t.board);
    setStudentClass(t.studentClass);
    setPercentage(t.percentage !== null && t.percentage !== undefined ? String(t.percentage) : "");
    setImageUrl(t.imageUrl);
    setStatus("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function resetForm() {
    setEditingId(null);
    setName("");
    setBoard("CBSE");
    setStudentClass("Class 12");
    setPercentage("");
    setImageUrl("");
    setStatus("");
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
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
      const method = editingId ? "PUT" : "POST";
      const payload = {
        id: editingId,
        name,
        board,
        studentClass,
        percentage: percentage !== "" ? Number(percentage) : null,
        imageUrl,
      };

      const res = await fetch("/api/toppers", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        setItems(data.toppers || []);
        resetForm();
        setStatus(editingId ? "Topper updated successfully." : "Topper added successfully.");
      } else {
        setStatus(data.error || `Failed to ${editingId ? "update" : "add"} topper.`);
      }
    } catch {
      setStatus("Network error. Please try again.");
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
      setStatus(error instanceof Error ? error.message : "Image upload failed.");
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

      const data = await res.json();
      if (res.ok) {
        setItems(data.toppers || items.filter((item) => item._id !== id));
        setStatus("Record deleted.");
      } else {
        setStatus("Delete failed.");
      }
    } catch {
      setStatus("Network error.");
    }
  }

  return (
    <section className="max-w-4xl mx-auto py-8 px-4 sm:px-6 text-slate-900">
      <div className="bg-white border border-slate-200 rounded-[2rem] p-6 sm:p-8 mb-12 shadow-xl shadow-slate-200/50">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-10">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-2xl w-fit">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-7.714 2.143L11 21l-2.286-6.857L1 12l7.714-2.143L11 3z" />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-bold">
              {editingId ? "Edit Topper Profile" : "Toppers Management"}
            </h2>
            <p className="text-slate-500 text-sm">
              {editingId
                ? "Modify details for this topper."
                : "Update the Hall of Fame with new achievements."}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Row 1: Name + Board */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">
                Student Name
              </label>
              <input
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-blue-400 focus:ring-4 focus:ring-blue-400/10 outline-none transition-all"
                placeholder="e.g. Rahul Sharma"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">
                Board
              </label>
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
          </div>

          {/* Row 2: Class + Percentage */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">
                Class
              </label>
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
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">
                Percentage / Score (optional)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                step="0.01"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-blue-400 focus:ring-4 focus:ring-blue-400/10 outline-none transition-all"
                placeholder="e.g. 98.6"
                value={percentage}
                onChange={(e) => setPercentage(e.target.value)}
              />
            </div>
          </div>

          {/* Photo Upload */}
          <div className="space-y-4">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">
              Profile Photo
            </label>
            <div className="flex flex-col sm:flex-row sm:items-center gap-6">
              <label className="cursor-pointer flex-1 group bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-6 flex flex-col items-center justify-center hover:border-blue-400 hover:bg-white transition-all">
                <svg className="w-8 h-8 text-slate-300 group-hover:text-blue-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                <span className="text-xs font-bold text-slate-400">
                  {isUploading ? "Uploading..." : imageUrl ? "Change photo" : "Click to upload photo"}
                </span>
                <input
                  type="file"
                  className="hidden"
                  accept="image/jpeg,image/png,image/webp,image/avif"
                  onChange={handleImageUpload}
                  disabled={isUploading}
                />
              </label>
              {imageUrl && (
                <div className="flex items-center gap-4 animate-in fade-in slide-in-from-left-4 duration-300 flex-shrink-0">
                  <img
                    src={imageUrl}
                    className="h-20 w-20 rounded-2xl object-cover ring-2 ring-blue-400 shadow-md"
                    alt="Topper preview"
                  />
                  <span className="text-xs font-bold text-blue-600">Photo Ready</span>
                </div>
              )}
            </div>
          </div>

          {status && (
            <div
              className={`text-sm font-bold ${
                status.toLowerCase().includes("fail") || status.toLowerCase().includes("error")
                  ? "text-rose-500"
                  : "text-blue-600"
              }`}
            >
              {status}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              type="submit"
              disabled={isSaving || isUploading || !imageUrl}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-[1.5rem] transition-all shadow-xl shadow-blue-600/20 disabled:opacity-50 disabled:grayscale"
            >
              {isSaving
                ? "Saving..."
                : editingId
                ? "Update Topper Profile"
                : "Add to Hall of Fame"}
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

      {/* Toppers Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {items.map((item) => (
          <div
            key={item._id}
            className="relative group bg-white border border-slate-200 rounded-3xl p-2 flex flex-col shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-slate-100 relative">
              <img src={item.imageUrl} alt={item.name} className="h-full w-full object-cover" />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 pt-12">
                <p className="text-white font-bold text-sm truncate">{item.name}</p>
                <p className="text-white/70 text-[10px] font-medium tracking-wide mt-0.5">
                  {item.board} • {item.studentClass}
                </p>
                {item.percentage !== null && item.percentage !== undefined && (
                  <span className="inline-block mt-1 px-2 py-0.5 bg-blue-500/90 text-white text-[10px] font-black rounded-full">
                    {item.percentage}%
                  </span>
                )}
              </div>
            </div>

            {/* Edit + Delete buttons */}
            <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all">
              <button
                onClick={() => handleEditClick(item)}
                className="p-2 bg-white/90 backdrop-blur text-blue-500 hover:bg-blue-50 hover:text-blue-600 rounded-xl shadow-sm"
                aria-label="Edit"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button
                onClick={() => handleDelete(item._id)}
                className="p-2 bg-white/90 backdrop-blur text-rose-500 hover:bg-rose-50 hover:text-rose-600 rounded-xl shadow-sm"
                aria-label="Delete"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      {items.length === 0 && (
        <div className="text-center py-16 text-slate-400 text-sm font-medium">
          No toppers added yet. Add your first topper above.
        </div>
      )}
    </section>
  );
}
