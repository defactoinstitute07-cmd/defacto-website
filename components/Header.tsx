"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import BrandLogo from "./BrandLogo";

const navigation = [
  { href: "/", label: "Home" },
  { href: "/courses", label: "Courses" },
  { href: "/gallery", label: "Gallery" },
  { href: "/erp", label: "ERP" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, []);

  const isNavLinkActive = (href: string) => !href.includes("#") && pathname === href;

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-[120] border-b border-white/10 bg-slate-950/92 pt-[env(safe-area-inset-top)] font-sans backdrop-blur-xl supports-[backdrop-filter]:bg-slate-950/80">
        <div className="relative w-full 
bg-[linear-gradient(135deg,#000000,#0f172a,#000000)] 
border-b border-white/10 backdrop-blur-md">

          {/* 🔲 Grid Overlay */}
          <div className="absolute inset-0 
  bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),
      linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)]
  bg-[size:20px_20px] opacity-20"></div>

          <div className="relative z-10 mx-auto flex h-[72px] max-w-[1500px] items-center justify-between gap-3 px-5 sm:h-[78px] sm:px-6 lg:h-[84px] lg:px-8">

            {/* 🔥 Logo */}
            <div className="flex flex-col">
              <Link
                href="/"
                className="inline-flex items-center transition hover:opacity-80"
              >
                <BrandLogo variant="dark" className="h-8 sm:h-9 lg:h-10 brightness-110" />
              </Link>
            </div>

            {/* 🧭 Desktop Nav */}
            <div className="hidden lg:flex items-center gap-8">
              <nav
                aria-label="Primary"
                className="flex items-center gap-6 text-sm font-semibold text-white/70"
              >
                {navigation.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`transition-all duration-300 hover:text-yellow-400 ${isNavLinkActive(item.href)
                        ? "text-yellow-400"
                        : ""
                      }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>

              {/* 🚀 CTA Button */}
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-full 
        bg-gradient-to-r from-yellow-400 to-yellow-600 
        px-6 py-2.5 text-sm font-bold text-black 
        transition-all hover:scale-105 shadow-lg"
              >
                Enquire Now
              </Link>
            </div>

            {/* 📱 Mobile */}
            <div className="flex items-center gap-2 lg:hidden">
              <Link
                href="/contact"
                className="hidden min-[380px]:inline-flex items-center justify-center 
        rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 
        px-3 py-2 text-xs font-bold text-black transition hover:scale-105"
              >
                Enquire
              </Link>

              <button
                onClick={() => setIsOpen((prev) => !prev)}
                className="inline-flex items-center justify-center rounded-xl 
        border border-white/10 bg-white/10 backdrop-blur-md 
        p-2 text-white transition-all hover:bg-white/20"
              >
                {isOpen ? (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16m-7 6h7" />
                  </svg>
                )}
              </button>
            </div>

          </div>
        </div>
      </header>

      <div className="lg:hidden">
        <div
          id="mobile-navigation"
          className={`fixed inset-0 z-[140] overflow-y-auto bg-slate-950/98 px-5 pb-8 pt-[calc(env(safe-area-inset-top)+1rem)] backdrop-blur-xl transition-all duration-300 sm:px-6 ${isOpen
              ? "translate-y-0 opacity-100"
              : "pointer-events-none -translate-y-4 opacity-0"
            }`}
        >
          <div className="mx-auto flex max-w-md flex-col gap-5">
            <div className="flex items-center justify-between">
              <Link
                href="/"
                className="inline-flex items-center text-lg font-bold tracking-tight transition hover:opacity-80"
              >
                <BrandLogo variant="light" className="h-8 sm:h-9" />
              </Link>

              <button
                onClick={() => setIsOpen(false)}
                className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 p-2 text-slate-300 transition-all hover:bg-white/10 hover:text-white"
                aria-label="Close menu"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2.5"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-4 shadow-2xl shadow-black/25">
              <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-slate-500">
                Navigation
              </p>
              <nav className="mt-4 flex flex-col gap-2" aria-label="Mobile Primary">
                {navigation.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center justify-between rounded-2xl px-4 py-3 text-base font-semibold transition-all duration-300 ${isNavLinkActive(item.href)
                        ? "bg-amber-400 text-slate-950 shadow-lg shadow-amber-400/20"
                        : "bg-white/5 text-slate-200 hover:bg-white/10 hover:text-white"
                      }`}
                  >
                    <span>{item.label}</span>
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2.2"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 6l6 6-6 6" />
                    </svg>
                  </Link>
                ))}
              </nav>
            </div>

            <div className="rounded-[1.75rem] border border-white/10 bg-gradient-to-br from-white/[0.05] to-white/[0.02] p-5">
              <p className="text-sm font-semibold text-white">Need help choosing the right batch?</p>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                Reach out to us for admissions, counselling, and schedule details.
              </p>
              <Link
                href="/contact"
                className="mt-4 inline-flex w-full items-center justify-center rounded-2xl bg-amber-400 px-6 py-3.5 text-sm font-black text-slate-950 transition hover:bg-amber-300"
              >
                Enquire Now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
