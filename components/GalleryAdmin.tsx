"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import {
  CLOUDINARY_MAX_IMAGE_BYTES,
  getCloudinaryAllowedFormatsValue,
  isAllowedImageFile,
} from "../lib/media-upload";

const uploadConstraintsMessage = `Only ${getCloudinaryAllowedFormatsValue().toUpperCase().replace(/,/g, ", ")} files up to ${Math.round(CLOUDINARY_MAX_IMAGE_BYTES / (1024 * 1024))} MB are allowed.`;

type GalleryItem = {
  _id: string;
  image_url: string;
  caption: string;
  tag: string;
  created_at: string;
};

export default function GalleryAdmin() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [caption, setCaption] = useState("");
  const [tag, setTag] = useState("trip");
  const [imageUrl, setImageUrl] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    fetchGallery();
  }, []);

  async function fetchGallery() {
    const res = await fetch("/api/gallery", { cache: "no-store" });
    const data = await res.json();
    setItems(data.gallery || []);
  }

  async function handleAddImage(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!imageUrl) {
      setStatus("Please upload an image first.");
      return;
    }

    setIsSaving(true);
    setStatus("");

    const res = await fetch("/api/gallery", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imageUrl, caption, tag }),
    });

    const data = await res.json();

    if (res.ok) {
      setItems([data.item, ...items]);
      setCaption("");
      setImageUrl("");
      setStatus("Photo added to gallery.");
    } else {
      setStatus(data.error || "Failed to add photo.");
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
    setStatus("Uploading to Cloudinary...");

    try {
      const signatureRes = await fetch("/api/cloudinary-signature", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ folder: "student_trips" }),
      });

      if (!signatureRes.ok) {
        const payload = await signatureRes.json();
        throw new Error(payload.error || "Failed to get upload signature");
      }

      const signature = await signatureRes.json();

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

      if (!uploadData.secure_url) {
        throw new Error("Upload failed.");
      }

      setImageUrl(uploadData.secure_url);
      setStatus("Image uploaded to Cloudinary.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Upload error.");
    } finally {
      setIsUploading(false);
    }

    event.target.value = "";
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this photo?")) return;

    const res = await fetch("/api/gallery", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    if (res.ok) {
      setItems(items.filter((item) => item._id !== id));
      return;
    }

    const data = await res.json();
    setStatus(data.error || "Failed to delete photo.");
  }

  return (
    <section className="max-w-4xl mx-auto py-8 px-4 sm:px-6 text-slate-900">
      <div className="bg-white/80 backdrop-blur-xl border border-slate-200 rounded-[2rem] p-6 sm:p-8 mb-12 shadow-xl transition-all hover:bg-white">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-10">
          <div className="p-3 bg-amber-100 text-amber-600 rounded-2xl w-fit">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Media Gallery</h2>
            <p className="text-slate-500 text-sm">
              Add new photos to the &quot;Life at Defacto&quot; section.
            </p>
          </div>
        </div>

        <form onSubmit={handleAddImage} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">
                Photo Caption
              </label>
              <input
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 text-slate-900 text-sm outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-400/20 transition-all font-medium placeholder-slate-400"
                placeholder="e.g., Results Day Celebration"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
              />
            </div>
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">
                Category
              </label>
              <select
                className="w-full bg-slate-50 text-slate-900 border border-slate-200 rounded-2xl px-5 py-[15px] text-sm outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-400/20 transition-all appearance-none font-medium"
                value={tag}
                onChange={(e) => setTag(e.target.value)}
              >
                <option value="trip">Student Trip</option>
                <option value="social">Social / CSR</option>
                <option value="institute">Institute View</option>
                <option value="institute events">Events</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">
              Upload Photo
            </label>
            <p className="text-xs leading-relaxed text-slate-500">
              Gallery media is now locked to signed Cloudinary uploads only.
            </p>
            <div className="mt-4">
              <label className="cursor-pointer group relative overflow-hidden bg-slate-50 border border-dashed border-slate-300 rounded-2xl p-8 flex flex-col items-center justify-center hover:border-amber-400 transition-all duration-300">
                <svg
                  className="w-8 h-8 text-slate-400 group-hover:text-amber-500 transition-colors mb-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                <span className="text-sm font-bold text-slate-500 group-hover:text-slate-900">
                  {isUploading ? "Uploading..." : "Click to select photo"}
                </span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/avif"
                  className="hidden"
                  onChange={handleImageUpload}
                  disabled={isUploading}
                />
              </label>
            </div>
          </div>

          {imageUrl && (
            <div className="relative w-24 h-24 rounded-2xl overflow-hidden border-2 border-amber-400 animate-in zoom-in duration-300 shadow-lg">
              <img src={imageUrl} className="h-full w-full object-cover" alt="Gallery preview" />
            </div>
          )}

          {status && <div className="text-sm font-bold text-amber-600 ml-1 drop-shadow-sm">{status}</div>}

          <button
            type="submit"
            disabled={isSaving || isUploading || !imageUrl}
            className="w-full bg-amber-400 hover:bg-amber-500 text-slate-900 font-black py-4 rounded-[1.5rem] transition-all shadow-xl shadow-amber-400/20 disabled:opacity-50 disabled:grayscale"
          >
            {isSaving ? "Publishing Photo..." : "Publish to Live Gallery"}
          </button>
        </form>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
        {items.map((item) => (
          <div
            key={item._id}
            className="group relative aspect-square bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all hover:border-amber-400/50"
          >
            <img
              src={item.image_url}
              alt={item.caption}
              className="h-full w-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-4 sm:p-5">
              <span className="text-[8px] font-black text-amber-400 uppercase tracking-widest mb-1.5 drop-shadow-md">
                {item.tag || "trip"}
              </span>
              <p className="text-white text-xs font-bold line-clamp-2 leading-tight mb-4 drop-shadow-md">
                {item.caption}
              </p>
              <button
                className="w-full py-2 sm:py-2.5 bg-rose-500/20 backdrop-blur-md text-rose-100 text-[10px] font-black rounded-xl hover:bg-rose-500 hover:text-white transition-all border border-rose-500/30"
                onClick={() => handleDelete(item._id)}
              >
                DELETE PHOTO
              </button>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <div className="col-span-full py-20 text-center bg-slate-50 border-2 border-dashed border-slate-300 rounded-[2.5rem]">
            <p className="text-slate-500 font-bold italic">
              The gallery explorer is empty. Upload some memories!
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
