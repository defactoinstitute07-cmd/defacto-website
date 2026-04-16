import Link from "next/link";
import BrandLogo from "./BrandLogo";

const quickLinks = [
  { href: "/#about", label: "About Us" },
  { href: "/courses", label: "Academic Programs" },
  { href: "/gallery", label: "Institute Gallery" },
  { href: "/contact", label: "Contact Us" },
];

const bottomLinks = [
  { href: "/courses", label: "Courses" },
  { href: "/contact", label: "Admissions" },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-slate-950 border-t border-slate-900 overflow-hidden">
      {/* Premium Touch: Subtle glowing top border */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[1px] bg-gradient-to-r from-transparent via-amber-500/30 to-transparent"></div>

      {/* Main Footer Content */}
      <div className="mx-auto grid max-w-[1500px] gap-10 md:gap-12 px-4 py-16 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">

        {/* 1. Brand & About */}
        <div className="space-y-6 font-sans">

          {/* Logo + Name */}
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition">

            {/* Logo Image */}
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0f172a] to-black border border-white/10 flex items-center justify-center shadow-lg overflow-hidden">
              <img
                src="https://res.cloudinary.com/dsks5swu1/image/upload/v1775565407/erp_uploads/xcoemwx25dr8gcjkm4ha.png"   // 👈 apna logo yaha daalo
                alt="Defacto Logo"
                className="w-full h-full object-contain"
              />
            </div>

            {/* Text */}
            <div className="flex flex-col leading-tight">
              <h1 className="text-yellow-400 font-bold text-lg sm:text-xl">
                Defacto
              </h1>
              <p className="text-slate-400 text-xs tracking-wide">
                Institute | BHANIYAWALA
              </p>
            </div>

          </Link>

          {/* Description */}
          <p className="text-sm leading-relaxed text-slate-400 pr-4 md:pr-0">
            Personalized mentoring, exam-focused preparation, and a supportive
            learning environment built to help students grow with confidence.
          </p>

          {/* Social Links */}
          <div className="flex items-center gap-4 pt-2">

            {/* Facebook */}
            <a
              href="https://www.facebook.com/share/1DbXy4KENF/?mibextid=wwXIfr"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center text-slate-400 hover:bg-amber-400 hover:text-slate-950 transition-all duration-300"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.891h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
              </svg>
            </a>

            {/* Instagram */}
            <a
              href="https://www.instagram.com/de_facto_institute"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center text-slate-400 hover:bg-amber-400 hover:text-slate-950 transition-all duration-300"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63z" />
              </svg>
            </a>

          </div>

        </div>

        {/* 2. Quick Links (SEO Friendly Navigation) */}
        <div className="md:ml-auto">
          <h3 className="text-sm font-bold text-white uppercase tracking-[0.15em] mb-5 md:mb-6">Quick Links</h3>
          {/* <nav> tag is critical for SEO so Google knows these are main links */}
          <nav className="flex flex-col gap-3">
            {quickLinks.map((link) => (
              <Link key={link.label} href={link.href} className="w-fit text-sm text-slate-400 hover:text-amber-400 transition-colors duration-300">
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* 3. Contact Info (Local SEO Optimization) */}
        <div>
          <h3 className="text-sm font-bold text-white uppercase tracking-[0.15em] mb-5 md:mb-6">Contact Us</h3>
          {/* <address> tag helps Google identify your physical location and contact info */}
          <address className="not-italic flex flex-col gap-4 text-sm text-slate-400">
            <p className="flex gap-3">
              <svg className="w-5 h-5 text-amber-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              <span>De Facto Institute Rd, Bhania Wala, Uttarakhand 248140</span>
            </p>
            <p className="flex gap-3">
              <svg className="w-5 h-5 text-amber-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
              <a href="tel:+919876543210" className="hover:text-amber-400 transition-colors">+91 81919 30475</a>
            </p>
            <p className="flex gap-3">
              <svg className="w-5 h-5 text-amber-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              <a href="mailto:info@defactoinstitute.com" className="hover:text-amber-400 transition-colors">defactoinstitute07@gmail.com</a>
            </p>
          </address>
        </div>

        {/* 4. Operating Hours */}
        <div className="md:ml-auto">
          <h3 className="text-sm font-bold text-white uppercase tracking-[0.15em] mb-5 md:mb-6">Working Hours</h3>
          <ul className="flex flex-col gap-3 text-sm text-slate-400">
            <li className="flex justify-between gap-4">
              <span>Mon - Sat</span>
              <span className="text-white font-medium">9:00 AM - 7:00 PM</span>
            </li>
            <li className="flex justify-between gap-4">
              <span>Sunday</span>
              <span className="text-amber-400 font-medium">Closed</span>
            </li>
          </ul>
        </div>

      </div>

      {/* Bottom Copyright Bar */}
      <div className="border-t border-slate-800/60 bg-slate-950/80">
        {/* Mobile par stack hoga center align ke sath, Desktop par row me split hoga */}
        <div className="mx-auto flex max-w-[1500px] flex-col items-center gap-6 px-4 py-8 text-xs sm:text-sm text-slate-500 sm:px-6 md:flex-row md:justify-between lg:px-8">

          <div className="flex flex-col items-center md:items-start gap-1">
            <p className="text-center md:text-left">
              &copy; {currentYear} Defacto Institute. All rights reserved.
            </p>
            <p className="text-[11px] sm:text-xs text-slate-500/80">
              Developed and Designed by <a href="https://rishabh-bisht.vercel.app/" target="_blank" rel="noopener noreferrer" className="text-amber-500/90 hover:text-amber-400 transition-colors font-medium">Rishabh Bisht</a>
            </p>
          </div>

          {/* Extra navigation links */}
          <div className="flex items-center gap-6">
            {bottomLinks.map((link) => (
              <Link key={link.label} href={link.href} className="hover:text-amber-400 transition-colors">
                {link.label}
              </Link>
            ))}
          </div>

        </div>
      </div>
    </footer>
  );
}
