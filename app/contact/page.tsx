"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import BrandLogo from "../../components/BrandLogo";

function ContactFormContent() {
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    whatsapp: "",
    subject: "Enrollment Enquiry",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const batch = searchParams.get("batch");
    if (batch) {
      setFormData((prev) => ({
        ...prev,
        message: `I want to enroll in the ${batch} batch.`,
      }));
    }
  }, [searchParams]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (formData.name.trim().length < 3) newErrors.name = "Name must be at least 3 characters.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Please enter a valid email address.";
    if (formData.whatsapp.trim().length < 10) newErrors.whatsapp = "Enter a valid 10-digit WhatsApp number.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setErrors({});

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setShowSuccess(true);
        setFormData({
          name: "",
          email: "",
          whatsapp: "",
          subject: "Enrollment Enquiry",
          message: "",
        });
      } else {
        const data = await response.json();
        setErrors({ server: data.error || "Something went wrong. Please try again." });
      }
    } catch (err) {
      setErrors({ server: "Failed to send message. Please check your connection." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-[0px] border border-slate-200 shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-5">
        {/* Sidebar Info */}
        <div className="md:col-span-2 bg-slate-900 p-8 md:p-12 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/10 rounded-full blur-3xl -tr-16 -rt-16" />
          <div className="relative z-10">
            <BrandLogo variant="light" className="mb-6" />
            <p className="text-slate-400 text-sm mb-12 leading-relaxed">
              Join Bhaniyawala's most focused learning center. Our team will get back to you within 24 hours.
            </p>

            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-white/10 rounded-lg text-amber-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Email Us</p>
                  <p className="text-sm font-semibold">defactoinstitute07@gmail.com</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2 bg-white/10 rounded-lg text-amber-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">WhatsApp</p>
                  <p className="text-sm font-semibold">+91 81919 30475</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 p-5 bg-gradient-to-r from-amber-400/10 to-transparent border-l-2 border-amber-400 rounded-r-xl">
            <p className="text-xs font-bold text-amber-400 uppercase tracking-widest mb-1">Enrollment Policy</p>
            <p className="text-[10px] text-slate-400 leading-normal">
              REGISTRATION IS 100% FREE. NO PAYMENT INVOLVED UNTIL FORMAL ADMISSION.
            </p>
          </div>
        </div>

        {/* Form Area */}
        <div className="md:col-span-3 p-8 md:p-12">
          {showSuccess ? (
            <div className="h-full flex flex-col items-center justify-center text-center animate-in fade-in zoom-in duration-500">
              <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Interest Received!</h3>
              <p className="text-slate-600 leading-relaxed max-w-sm mb-8">
                Thank you for showing interest. Our team will reach out to you on your WhatsApp number.
                If we are unable to connect, please contact us via WhatsApp.
              </p>
              <button
                onClick={() => setShowSuccess(false)}
                className="px-8 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Full Name</label>
                  <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={`w-full px-4 py-3 bg-slate-50 border ${errors.name ? 'border-rose-400 ring-1 ring-rose-400' : 'border-slate-200'} rounded-xl focus:ring-2 focus:ring-amber-400 focus:border-transparent outline-none transition-all`}
                    placeholder="Full Name"
                  />
                  {errors.name && <p className="text-[10px] font-bold text-rose-500 ml-1">{errors.name}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">WhatsApp Number</label>
                  <input
                    required
                    type="tel"
                    value={formData.whatsapp}
                    onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                    className={`w-full px-4 py-3 bg-slate-50 border ${errors.whatsapp ? 'border-rose-400 ring-1 ring-rose-400' : 'border-slate-200'} rounded-xl focus:ring-2 focus:ring-amber-400 focus:border-transparent outline-none transition-all`}
                    placeholder="+91 XXXXX XXXXX"
                  />
                  {errors.whatsapp && <p className="text-[10px] font-bold text-rose-500 ml-1">{errors.whatsapp}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
                <input
                  required
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={`w-full px-4 py-3 bg-slate-50 border ${errors.email ? 'border-rose-400 ring-1 ring-rose-400' : 'border-slate-200'} rounded-xl focus:ring-2 focus:ring-amber-400 focus:border-transparent outline-none transition-all`}
                  placeholder="email@example.com"
                />
                {errors.email && <p className="text-[10px] font-bold text-rose-500 ml-1">{errors.email}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Batch / Subject</label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-400 focus:border-transparent outline-none transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Your Message</label>
                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-400 focus:border-transparent outline-none transition-all resize-none"
                  placeholder="Tell us a bit more..."
                />
              </div>

              {errors.server && <p className="text-xs font-bold text-rose-500 ml-1">{errors.server}</p>}

              <button
                disabled={isSubmitting}
                type="submit"
                className="w-full py-4 bg-amber-400 text-slate-900 font-extrabold rounded-xl hover:bg-amber-300 transition-all hover:-translate-y-1 shadow-xl shadow-amber-400/20 disabled:opacity-50 disabled:translate-y-0"
              >
                {isSubmitting ? "Sending Interest..." : "Submit Interest - It's Free"}
              </button>

              <p className="text-[10px] text-center text-slate-400 uppercase font-bold tracking-widest">
                No Payment Information Required for Registration
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-slate-50 pt-10 pb-24">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-6 lg:px-8">
        <div className="text-center mb-16 space-y-4">
          <span className="inline-block px-4 py-1.5 text-xs font-bold tracking-[0.2em] uppercase text-amber-600 bg-amber-50 rounded-full border border-amber-100">
            Registration Desk
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
            Start Your Journey <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-500">Today</span>
          </h1>

        </div>

        <Suspense fallback={<div className="text-center py-20">Loading form...</div>}>
          <ContactFormContent />
        </Suspense>

        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center p-8 bg-white border border-slate-100 rounded-3xl text-center">
            <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 mb-6">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <h4 className="text-lg font-bold mb-2">Flexible Batches</h4>
            <p className="text-sm text-slate-500 leading-relaxed">Choose timing that fits your school schedule.</p>
          </div>

          <div className="flex flex-col items-center p-8 bg-white border border-slate-100 rounded-3xl text-center">
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-6">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
            </div>
            <h4 className="text-lg font-bold mb-2">Expert Mentorship</h4>
            <p className="text-sm text-slate-500 leading-relaxed">Under the proven guidance of Mr. Gopal Negi.</p>
          </div>

          <div className="flex flex-col items-center p-8 bg-white border border-slate-100 rounded-3xl text-center">
            <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 mb-6">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
            <h4 className="text-lg font-bold mb-2">Free Trial Session</h4>
            <p className="text-sm text-slate-500 leading-relaxed">Book a free session to experience our teaching methodology.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
