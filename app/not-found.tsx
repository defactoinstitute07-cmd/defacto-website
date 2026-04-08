import Link from "next/link";

export default function NotFoundPage() {
  return (
    <section className="mx-auto flex min-h-[60vh] w-full max-w-4xl flex-col items-center justify-center px-5 py-20 text-center sm:px-6 lg:px-8">
      <p className="mb-4 inline-flex rounded-full border border-amber-200 bg-amber-50 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-amber-700">
        Error 404
      </p>
      <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
        Page Not Found
      </h1>
      <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
        The page you are looking for does not exist, may have moved, or the URL may be incorrect.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-6 py-3 font-bold text-white transition hover:bg-slate-800"
        >
          Go to Homepage
        </Link>
        <Link
          href="/contact"
          className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-3 font-bold text-slate-700 transition hover:bg-slate-50"
        >
          Contact Us
        </Link>
      </div>
    </section>
  );
}
