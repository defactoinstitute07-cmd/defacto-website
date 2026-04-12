"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import type { SiteContent } from "../../lib/site-content";
import {
  CLOUDINARY_MAX_IMAGE_BYTES,
  getCloudinaryAllowedFormatsValue,
  isAllowedImageFile,
} from "../../lib/media-upload";
import AdminTabs from "../../components/AdminTabs";
import BrandLogo from "../../components/BrandLogo";

const FacultyAdmin = dynamic(() => import("../../components/FacultyAdmin"), { ssr: false });
const GalleryAdmin = dynamic(() => import("../../components/GalleryAdmin"), { ssr: false });
const CourseChaptersAdmin = dynamic(() => import("../../components/CourseChaptersAdmin"), {
  ssr: false,
});
const AdminSecurityPanel = dynamic(() => import("../../components/AdminSecurityPanel"), {
  ssr: false,
});
const ToppersAdmin = dynamic(() => import("../../components/ToppersAdmin"), { ssr: false });

type EditableContent = SiteContent;

const emptyContent: EditableContent = {
  heroImageUrl: "",
  aboutImageUrl: "",
  ownerImageUrl: "",
};
const uploadConstraintsMessage = `Only ${getCloudinaryAllowedFormatsValue().toUpperCase().replace(/,/g, ", ")} files up to ${Math.round(CLOUDINARY_MAX_IMAGE_BYTES / (1024 * 1024))} MB are allowed.`;

export default function AdminPage() {
  const router = useRouter();
  const [content, setContent] = useState<EditableContent>(emptyContent);
  const [status, setStatus] = useState("");
  const [activeTab, setActiveTab] = useState("content");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingHero, setIsUploadingHero] = useState(false);
  const [isUploadingAbout, setIsUploadingAbout] = useState(false);
  const [isUploadingOwner, setIsUploadingOwner] = useState(false);

  useEffect(() => {
    async function bootstrap() {
      try {
        const sessionResponse = await fetch("/api/admin/auth/session", { cache: "no-store" });
        const sessionPayload = (await sessionResponse.json()) as {
          authenticated?: boolean;
          error?: string;
        };

        if (!sessionResponse.ok) {
          setStatus(sessionPayload.error || "Unable to verify admin session.");
          setIsLoading(false);
          return;
        }

        if (!sessionPayload.authenticated) {
          router.replace("/admin/login");
          return;
        }

        const response = await fetch("/api/content", { cache: "no-store" });
        const payload = (await response.json()) as { content?: EditableContent; error?: string };

        if (response.ok && payload.content) {
          setContent(payload.content);
        } else if (payload.error) {
          setStatus(payload.error);
        }
      } catch {
        setStatus("Failed to initialize the admin console.");
      } finally {
        setIsLoading(false);
      }
    }

    bootstrap();
  }, [router]);

  function updateField(field: keyof EditableContent, value: string) {
    setContent((previous) => ({ ...previous, [field]: value }));
  }

  async function uploadImage(
    field: "heroImageUrl" | "aboutImageUrl" | "ownerImageUrl",
    file: File,
  ) {
    if (!isAllowedImageFile(file)) {
      setStatus(uploadConstraintsMessage);
      return;
    }

    if (field === "heroImageUrl") setIsUploadingHero(true);
    else if (field === "aboutImageUrl") setIsUploadingAbout(true);
    else setIsUploadingOwner(true);

    setStatus("Uploading to Cloudinary...");

    try {
      const signatureResponse = await fetch("/api/cloudinary-signature", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ folder: "de-facto" }),
      });

      const signaturePayload = (await signatureResponse.json()) as {
        error?: string;
        apiKey?: string;
        cloudName?: string;
        folder?: string;
        allowedFormats?: string[];
        maxFileSize?: number;
        signature?: string;
        timestamp?: number;
      };

      if (!signatureResponse.ok) {
        throw new Error(signaturePayload.error || "Failed to get upload signature.");
      }

      const formData = new FormData();
      formData.append("file", file);
      formData.append("api_key", signaturePayload.apiKey || "");
      formData.append("timestamp", String(signaturePayload.timestamp || ""));
      formData.append("signature", signaturePayload.signature || "");
      formData.append("folder", signaturePayload.folder || "de-facto");
      formData.append("allowed_formats", (signaturePayload.allowedFormats || []).join(","));
      formData.append("max_file_size", String(signaturePayload.maxFileSize || CLOUDINARY_MAX_IMAGE_BYTES));

      const cloudinaryResponse = await fetch(
        `https://api.cloudinary.com/v1_1/${signaturePayload.cloudName}/image/upload`,
        { method: "POST", body: formData },
      );

      const cloudinaryPayload = await cloudinaryResponse.json();
      if (!cloudinaryResponse.ok) {
        throw new Error(cloudinaryPayload.error?.message || "Cloudinary upload failed.");
      }

      updateField(field, cloudinaryPayload.secure_url);
      setStatus("Image updated successfully.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Upload failed.");
    } finally {
      if (field === "heroImageUrl") setIsUploadingHero(false);
      else if (field === "aboutImageUrl") setIsUploadingAbout(false);
      else setIsUploadingOwner(false);
    }
  }

  async function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setStatus("Saving changes...");

    try {
      const response = await fetch("/api/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });

      const payload = (await response.json()) as { error?: string };

      if (!response.ok) {
        setStatus(payload.error || "Failed to save changes.");
        return;
      }

      setStatus("Website content updated successfully.");
    } catch {
      setStatus("An error occurred while saving.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleLogout() {
    await fetch("/api/admin/auth/logout", { method: "POST" });
    router.replace("/admin/login");
  }

  const tabs = [
    {
      id: "content",
      label: "General Content",
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10l4 4v10a2 2 0 01-2 2zM14 4v4h4"
          />
        </svg>
      ),
    },
    {
      id: "faculty",
      label: "Faculty",
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      ),
    },
    {
      id: "gallery",
      label: "Media Gallery",
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      ),
    },
    {
      id: "courses",
      label: "Chapter Tracker",
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 6.253v13m0-13C10.832 5.477 8.565 5 6 5c-1.776 0-3.395.23-4.623.62A1 1 0 001 6.576v11.048a1 1 0 001.316.949C3.45 18.22 4.68 18 6 18c2.565 0 4.832.477 6 1.253m0-13C13.168 5.477 15.435 5 18 5c1.776 0 3.395.23 4.623.62A1 1 0 0123 6.576v11.048a1 1 0 01-1.316.949C20.55 18.22 19.32 18 18 18c-2.565 0-4.832.477-6 1.253"
          />
        </svg>
      ),
    },
    {
      id: "security",
      label: "Security",
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 11c1.657 0 3-1.567 3-3.5S13.657 4 12 4s-3 1.567-3 3.5 1.343 3.5 3 3.5zm0 0v9m-7-5a7 7 0 1114 0v1a2 2 0 01-2 2H7a2 2 0 01-2-2v-1z"
          />
        </svg>
      ),
    },
    {
      id: "toppers",
      label: "Toppers",
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-7.714 2.143L11 21l-2.286-6.857L1 12l7.714-2.143L11 3z"
          />
        </svg>
      ),
    },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-slate-500 font-bold gap-4">
        <div className="h-10 w-10 border-4 border-white/10 border-t-amber-400 rounded-full animate-spin" />
        <span>Initializing Secure Console...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-4 sm:p-10 font-sans">
      <div className="mx-auto w-full max-w-5xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div className="flex items-center gap-4">
            <BrandLogo variant="dark" />
            <div className="h-8 w-[1px] bg-slate-300 hidden md:block" />
            <h1 className="text-xl font-bold tracking-tight text-slate-900 hidden md:block">
              Admin Console
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.replace("/")}
              className="px-5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 text-sm font-bold hover:bg-slate-50 transition-colors shadow-sm"
            >
              View Site
            </button>
            <button
              onClick={handleLogout}
              className="px-5 py-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-sm font-bold hover:bg-rose-100 transition-colors shadow-sm"
            >
              Logout
            </button>
          </div>
        </div>

        <AdminTabs activeTab={activeTab} setActiveTab={setActiveTab} tabs={tabs} />

        <main className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {activeTab === "content" && (
            <div className="space-y-8 max-w-3xl mx-auto">
              <div className="bg-white/80 backdrop-blur-xl border border-slate-200 p-6 sm:p-8 rounded-[2rem] shadow-xl transition-all hover:bg-white">
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">Website Visuals</h2>
                  <p className="text-slate-500 text-sm">
                    Update the primary images displayed on your homepage.
                  </p>
                </div>

                <form onSubmit={handleSave} className="space-y-10">
                  <div className="space-y-4">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em] ml-1">
                      Hero Background
                    </label>
                    <div className="relative group rounded-3xl overflow-hidden border border-slate-200 bg-slate-50 transition-all hover:border-slate-300 hover:shadow-md">
                      {content.heroImageUrl ? (
                        <img
                          src={content.heroImageUrl}
                          className="h-48 w-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                          alt="Hero preview"
                        />
                      ) : (
                        <div className="h-48 w-full flex items-center justify-center text-slate-400 italic text-sm">
                          No image uploaded
                        </div>
                      )}
                      <label className="absolute inset-0 flex items-center justify-center bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                        <span className="bg-white text-slate-900 px-6 py-2 rounded-xl font-bold text-sm shadow-xl">
                          Change Photo
                        </span>
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp,image/avif"
                          className="hidden"
                          onChange={(e: ChangeEvent<HTMLInputElement>) =>
                            e.target.files?.[0] && uploadImage("heroImageUrl", e.target.files[0])
                          }
                        />
                      </label>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em] ml-1">
                        About Section
                      </label>
                      <div className="relative group aspect-square rounded-3xl overflow-hidden border border-slate-200 bg-slate-50 transition-all hover:border-slate-300 hover:shadow-md">
                        {content.aboutImageUrl ? (
                          <img
                            src={content.aboutImageUrl}
                            className="h-full w-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                            alt="About preview"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-slate-400 italic text-sm">
                            No image
                          </div>
                        )}
                        <label className="absolute inset-0 flex items-center justify-center bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                          <span className="bg-white text-slate-900 px-4 py-2 rounded-xl font-bold text-xs shadow-xl">
                            Change
                          </span>
                          <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp,image/avif"
                            className="hidden"
                            onChange={(e: ChangeEvent<HTMLInputElement>) =>
                              e.target.files?.[0] && uploadImage("aboutImageUrl", e.target.files[0])
                            }
                          />
                        </label>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em] ml-1">
                        Owner / Teacher
                      </label>
                      <div className="relative group aspect-square rounded-3xl overflow-hidden border border-slate-200 bg-slate-50 transition-all hover:border-slate-300 hover:shadow-md">
                        {content.ownerImageUrl ? (
                          <img
                            src={content.ownerImageUrl}
                            className="h-full w-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                            alt="Owner preview"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-slate-400 italic text-sm">
                            No image
                          </div>
                        )}
                        <label className="absolute inset-0 flex items-center justify-center bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                          <span className="bg-white text-slate-900 px-4 py-2 rounded-xl font-bold text-xs shadow-xl">
                            Change
                          </span>
                          <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp,image/avif"
                            className="hidden"
                            onChange={(e: ChangeEvent<HTMLInputElement>) =>
                              e.target.files?.[0] && uploadImage("ownerImageUrl", e.target.files[0])
                            }
                          />
                        </label>
                      </div>
                    </div>
                  </div>

                  {status && (
                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-amber-800 text-xs font-bold shadow-sm">
                      {status}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSaving || isUploadingHero || isUploadingAbout || isUploadingOwner}
                    className="w-full bg-amber-400 hover:bg-amber-500 disabled:opacity-50 disabled:grayscale text-slate-900 font-extrabold py-4 rounded-[1.5rem] transition-all shadow-xl shadow-amber-400/20"
                  >
                    {isSaving ? "Saving Application..." : "Save Website Visuals"}
                  </button>
                </form>
              </div>
            </div>
          )}

          {activeTab === "faculty" && <FacultyAdmin />}
          {activeTab === "gallery" && <GalleryAdmin />}
          {activeTab === "courses" && <CourseChaptersAdmin />}
          {activeTab === "security" && <AdminSecurityPanel />}
          {activeTab === "toppers" && <ToppersAdmin />}
        </main>
      </div>
    </div>
  );
}
