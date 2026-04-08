"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import BrandLogo from "../../../components/BrandLogo";

type SessionState = {
  authenticated: boolean;
  canRegister: boolean;
};

export default function AdminLoginPage() {
  const router = useRouter();
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [sessionState, setSessionState] = useState<SessionState>({
    authenticated: false,
    canRegister: false,
  });
  const [isBootstrapping, setIsBootstrapping] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [twoFactorToken, setTwoFactorToken] = useState("");
  const [registrationSecret, setRegistrationSecret] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showRegistrationSecretValue, setShowRegistrationSecretValue] = useState(false);
  const [requiresTwoFactor, setRequiresTwoFactor] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    async function bootstrap() {
      try {
        const response = await fetch("/api/admin/auth/session", { cache: "no-store" });
        const payload = (await response.json()) as {
          authenticated?: boolean;
          canRegister?: boolean;
          error?: string;
        };

        if (!response.ok) {
          setErrorMessage(payload.error || "Failed to load admin session.");
          return;
        }

        const nextState = {
          authenticated: Boolean(payload.authenticated),
          canRegister: Boolean(payload.canRegister),
        };

        setSessionState(nextState);

        if (nextState.authenticated) {
          router.replace("/admin");
          return;
        }

        if (nextState.canRegister) {
          setAuthMode("signup");
        }
      } catch {
        setErrorMessage("Unable to connect to the admin authentication service.");
      } finally {
        setIsBootstrapping(false);
      }
    }

    bootstrap();
  }, [router]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    setIsLoading(true);

    try {
      const endpoint =
        authMode === "login"
          ? "/api/admin/auth/login"
          : "/api/admin/auth/register";

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          twoFactorToken,
          registrationSecret,
        }),
      });

      const payload = (await response.json()) as { error?: string; requiresTwoFactor?: boolean };

      if (!response.ok) {
        if (payload.requiresTwoFactor) {
          setRequiresTwoFactor(true);
        }
        setErrorMessage(payload.error || "Authentication failed.");
        return;
      }

      if (authMode === "signup" && sessionState.canRegister) {
        setSuccessMessage("Admin account created successfully.");
      }

      router.push("/admin");
    } catch {
      setErrorMessage("Unable to complete authentication right now.");
    } finally {
      setIsLoading(false);
    }
  }

  if (isBootstrapping) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center p-6">
        <div className="h-10 w-10 border-4 border-amber-100 border-t-amber-500 rounded-full animate-spin" />
      </div>
    );
  }

  const isSignupMode = authMode === "signup";
  const showRegistrationSecret = isSignupMode && !sessionState.canRegister;
  const showTwoFactorInput = !isSignupMode && requiresTwoFactor;

  return (
    <div className="relative min-h-screen overflow-hidden bg-stone-50 flex flex-col items-center justify-center p-6">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] h-[45%] w-[45%] rounded-full bg-amber-200/50 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] h-[40%] w-[40%] rounded-full bg-orange-200/40 blur-[120px]" />
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.7),rgba(255,247,237,0.9))]" />
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="flex justify-center mb-10">
          <BrandLogo variant="dark" className="scale-125" />
        </div>

        <div className="relative rounded-3xl border border-slate-200 bg-white/95 p-8 shadow-2xl shadow-slate-900/10 backdrop-blur-xl">
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
              {isSignupMode ? "Create Admin Account" : "Admin Access"}
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              {isSignupMode
                ? "Create or authorize an administrator with bcrypt-hashed credentials and a secure session."
                : "Sign in to manage content, faculty, and gallery updates securely."}
            </p>
          </div>

          {sessionState.canRegister && (
            <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-xs leading-relaxed text-emerald-700">
              No admin account exists yet. Create the first administrator to secure the dashboard.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="ml-1 text-xs font-bold uppercase tracking-widest text-slate-500">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-amber-400 focus:ring-4 focus:ring-amber-100"
                placeholder="admin@defacto.com"
              />
            </div>

            <div className="space-y-2">
              <label className="ml-1 text-xs font-bold uppercase tracking-widest text-slate-500">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 pr-20 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-amber-400 focus:ring-4 focus:ring-amber-100"
                  placeholder="At least 8 characters with letters and numbers"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-500 transition hover:bg-stone-100 hover:text-slate-800"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  aria-pressed={showPassword}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {showRegistrationSecret && (
              <div className="space-y-2">
                <label className="ml-1 text-xs font-bold uppercase tracking-widest text-slate-500">
                  Registration Secret
                </label>
                <div className="relative">
                  <input
                    type={showRegistrationSecretValue ? "text" : "password"}
                    value={registrationSecret}
                    onChange={(e) => setRegistrationSecret(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 pr-20 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-amber-400 focus:ring-4 focus:ring-amber-100"
                    placeholder="Required after the first admin account is created"
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegistrationSecretValue((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-500 transition hover:bg-stone-100 hover:text-slate-800"
                    aria-label={showRegistrationSecretValue ? "Hide registration secret" : "Show registration secret"}
                    aria-pressed={showRegistrationSecretValue}
                  >
                    {showRegistrationSecretValue ? "Hide" : "Show"}
                  </button>
                </div>
              </div>
            )}

            {showTwoFactorInput && (
              <div className="space-y-2">
                <label className="ml-1 text-xs font-bold uppercase tracking-widest text-slate-500">
                  Authenticator / Recovery Code
                </label>
                <input
                  type="text"
                  value={twoFactorToken}
                  onChange={(e) => setTwoFactorToken(e.target.value)}
                  required={showTwoFactorInput}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm uppercase tracking-[0.28em] text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-amber-400 focus:ring-4 focus:ring-amber-100"
                  placeholder="123456 or ABCDE-FGHIJ"
                />
                <p className="text-xs leading-relaxed text-slate-500">
                  Enter the 6-digit code from your authenticator app or one saved recovery code.
                </p>
              </div>
            )}

            {errorMessage && (
              <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs font-medium text-rose-700">
                {errorMessage}
              </div>
            )}

            {successMessage && (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-medium text-emerald-700">
                {successMessage}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 py-4 font-extrabold text-white shadow-xl shadow-slate-900/10 transition-all hover:bg-slate-800 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="h-5 w-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              ) : (
                <>
                  {isSignupMode ? "Register Admin" : "Sign In"}
                  <svg
                    className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2.5"
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                setAuthMode(isSignupMode ? "login" : "signup");
                setErrorMessage("");
                setSuccessMessage("");
                setRequiresTwoFactor(false);
                setShowPassword(false);
                setShowRegistrationSecretValue(false);
                setTwoFactorToken("");
              }}
              className="w-full py-2 text-xs font-bold uppercase tracking-widest text-slate-500 transition-colors hover:text-slate-700"
            >
              {isSignupMode ? "Back to Login" : "Create / Authorize Another Admin"}
            </button>
          </form>
        </div>

        <p className="mt-8 text-center text-xs font-medium text-slate-500">
          &copy; {new Date().getFullYear()} Defacto Institute. Internal System Access.
        </p>
      </div>
    </div>
  );
}
