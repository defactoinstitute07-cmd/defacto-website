"use client";

import { useEffect, useState } from "react";

type TwoFactorStatus = {
  enabled: boolean;
  enabledAt?: string | null;
  hasPendingSetup?: boolean;
  recoveryCodesRemaining: number;
};

type SetupPayload = {
  secretKey: string;
  otpauthUrl: string;
  backupCodes: string[];
};

export default function AdminSecurityPanel() {
  const [status, setStatus] = useState<TwoFactorStatus | null>(null);
  const [setupPayload, setSetupPayload] = useState<SetupPayload | null>(null);
  const [password, setPassword] = useState("");
  const [verificationToken, setVerificationToken] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    void loadStatus();
  }, []);

  async function loadStatus() {
    setIsLoading(true);

    try {
      const response = await fetch("/api/admin/auth/two-factor", { cache: "no-store" });
      const payload = (await response.json()) as
        | (TwoFactorStatus & { error?: string })
        | { error?: string };

      if (!response.ok) {
        setError(payload.error || "Failed to load two-factor settings.");
        return;
      }

      setStatus(payload as TwoFactorStatus);
    } catch {
      setError("Unable to load two-factor settings.");
    } finally {
      setIsLoading(false);
    }
  }

  async function copyValue(value: string, label: string) {
    try {
      await navigator.clipboard.writeText(value);
      setMessage(`${label} copied.`);
      setError("");
    } catch {
      setError(`Unable to copy ${label.toLowerCase()}.`);
    }
  }

  async function handleStartSetup() {
    setError("");
    setMessage("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/admin/auth/two-factor/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const payload = (await response.json()) as {
        error?: string;
        secretKey?: string;
        otpauthUrl?: string;
        backupCodes?: string[];
      };

      if (!response.ok) {
        setError(payload.error || "Failed to generate two-factor setup data.");
        return;
      }

      setSetupPayload({
        secretKey: payload.secretKey || "",
        otpauthUrl: payload.otpauthUrl || "",
        backupCodes: payload.backupCodes || [],
      });
      setVerificationToken("");
      setMessage("Save your recovery codes before enabling two-factor authentication.");
    } catch {
      setError("Unable to start two-factor setup right now.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleEnable() {
    setError("");
    setMessage("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/admin/auth/two-factor/enable", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: verificationToken }),
      });
      const payload = (await response.json()) as { error?: string };

      if (!response.ok) {
        setError(payload.error || "Failed to enable two-factor authentication.");
        return;
      }

      setSetupPayload(null);
      setPassword("");
      setVerificationToken("");
      setMessage("Two-factor authentication is now enabled.");
      await loadStatus();
    } catch {
      setError("Unable to enable two-factor authentication right now.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDisable() {
    setError("");
    setMessage("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/admin/auth/two-factor/disable", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          password,
          token: verificationToken,
        }),
      });
      const payload = (await response.json()) as { error?: string };

      if (!response.ok) {
        setError(payload.error || "Failed to disable two-factor authentication.");
        return;
      }

      setPassword("");
      setVerificationToken("");
      setSetupPayload(null);
      setMessage("Two-factor authentication has been disabled.");
      await loadStatus();
    } catch {
      setError("Unable to disable two-factor authentication right now.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto rounded-[2rem] border border-white/5 bg-slate-900/50 p-8 text-slate-400">
        Loading security settings...
      </div>
    );
  }

  return (
    <section className="max-w-3xl mx-auto py-8 text-slate-100">
      <div className="rounded-[2rem] border border-white/5 bg-slate-900/50 p-8 shadow-2xl">
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white">Security</h2>
            <p className="mt-2 text-sm text-slate-400">
              Protect the admin panel with an authenticator app and one-time recovery codes.
            </p>
          </div>
          <span
            className={`rounded-full px-4 py-2 text-[11px] font-black uppercase tracking-[0.24em] ${
              status?.enabled
                ? "bg-emerald-500/10 text-emerald-300 ring-1 ring-emerald-500/30"
                : "bg-amber-400/10 text-amber-300 ring-1 ring-amber-400/20"
            }`}
          >
            {status?.enabled ? "2FA Enabled" : "2FA Off"}
          </span>
        </div>

        {status?.enabled ? (
          <div className="space-y-6">
            <div className="rounded-3xl border border-emerald-500/20 bg-emerald-500/5 p-5 text-sm text-emerald-200">
              <p className="font-bold">Two-factor authentication is active.</p>
              <p className="mt-2 text-emerald-100/80">
                Recovery codes remaining: {status.recoveryCodesRemaining}
              </p>
              {status.enabledAt && (
                <p className="mt-1 text-emerald-100/70">
                  Enabled on {new Date(status.enabledAt).toLocaleString()}
                </p>
              )}
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="ml-1 text-xs font-bold uppercase tracking-widest text-slate-500">
                  Current Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-slate-950/40 px-5 py-4 text-sm text-white outline-none transition-all placeholder:text-slate-500 focus:border-amber-400/60 focus:ring-4 focus:ring-amber-400/10"
                  placeholder="Confirm your password"
                />
              </div>
              <div className="space-y-2">
                <label className="ml-1 text-xs font-bold uppercase tracking-widest text-slate-500">
                  Authenticator / Recovery Code
                </label>
                <input
                  type="text"
                  value={verificationToken}
                  onChange={(event) => setVerificationToken(event.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-slate-950/40 px-5 py-4 text-sm uppercase tracking-[0.25em] text-white outline-none transition-all placeholder:text-slate-500 focus:border-amber-400/60 focus:ring-4 focus:ring-amber-400/10"
                  placeholder="123456 or ABCDE-FGHIJ"
                />
              </div>
            </div>

            <button
              type="button"
              disabled={isSubmitting || !password || !verificationToken}
              onClick={handleDisable}
              className="w-full rounded-[1.5rem] border border-rose-500/20 bg-rose-500/10 py-4 font-black text-rose-300 transition-all hover:bg-rose-500/20 disabled:opacity-40"
            >
              {isSubmitting ? "Disabling..." : "Disable Two-Factor Authentication"}
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="rounded-3xl border border-amber-400/20 bg-amber-400/5 p-5 text-sm text-amber-100">
              Enter your current password to generate a new authenticator setup key. The setup
              secret and recovery codes are shown once, so store them safely before verifying.
            </div>

            <div className="space-y-2">
              <label className="ml-1 text-xs font-bold uppercase tracking-widest text-slate-500">
                Current Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-slate-950/40 px-5 py-4 text-sm text-white outline-none transition-all placeholder:text-slate-500 focus:border-amber-400/60 focus:ring-4 focus:ring-amber-400/10"
                placeholder="Confirm your password"
              />
            </div>

            <button
              type="button"
              disabled={isSubmitting || !password}
              onClick={handleStartSetup}
              className="w-full rounded-[1.5rem] bg-amber-400 py-4 font-black text-slate-950 transition-all hover:bg-amber-300 disabled:opacity-40"
            >
              {isSubmitting ? "Generating..." : "Generate Setup Key"}
            </button>

            {setupPayload && (
              <div className="space-y-5 rounded-[2rem] border border-white/10 bg-slate-950/40 p-6">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.24em] text-amber-300">
                    Manual Setup Key
                  </p>
                  <div className="mt-3 flex flex-col gap-3 rounded-2xl border border-white/10 bg-slate-900 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                    <code className="text-sm font-bold tracking-[0.3em] text-white">
                      {setupPayload.secretKey}
                    </code>
                    <button
                      type="button"
                      onClick={() => copyValue(setupPayload.secretKey.replace(/\s+/g, ""), "Setup key")}
                      className="rounded-xl border border-white/10 px-4 py-2 text-xs font-black uppercase tracking-widest text-slate-300 transition hover:bg-white/5"
                    >
                      Copy Key
                    </button>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.24em] text-slate-400">
                    Recovery Codes
                  </p>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    {setupPayload.backupCodes.map((code) => (
                      <div
                        key={code}
                        className="rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-center font-black tracking-[0.18em] text-white"
                      >
                        {code}
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => copyValue(setupPayload.backupCodes.join("\n"), "Recovery codes")}
                      className="rounded-xl border border-white/10 px-4 py-2 text-xs font-black uppercase tracking-widest text-slate-300 transition hover:bg-white/5"
                    >
                      Copy Recovery Codes
                    </button>
                    <button
                      type="button"
                      onClick={() => copyValue(setupPayload.otpauthUrl, "Authenticator link")}
                      className="rounded-xl border border-white/10 px-4 py-2 text-xs font-black uppercase tracking-widest text-slate-300 transition hover:bg-white/5"
                    >
                      Copy Authenticator Link
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="ml-1 text-xs font-bold uppercase tracking-widest text-slate-500">
                    6-Digit Authenticator Code
                  </label>
                  <input
                    type="text"
                    value={verificationToken}
                    onChange={(event) => setVerificationToken(event.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-slate-900 px-5 py-4 text-sm uppercase tracking-[0.35em] text-white outline-none transition-all placeholder:text-slate-500 focus:border-amber-400/60 focus:ring-4 focus:ring-amber-400/10"
                    placeholder="123456"
                  />
                </div>

                <button
                  type="button"
                  disabled={isSubmitting || !verificationToken}
                  onClick={handleEnable}
                  className="w-full rounded-[1.5rem] bg-emerald-500 py-4 font-black text-slate-950 transition-all hover:bg-emerald-400 disabled:opacity-40"
                >
                  {isSubmitting ? "Verifying..." : "Enable Two-Factor Authentication"}
                </button>
              </div>
            )}
          </div>
        )}

        {error && (
          <div className="mt-6 rounded-2xl border border-rose-500/20 bg-rose-500/10 p-4 text-sm font-bold text-rose-300">
            {error}
          </div>
        )}

        {message && (
          <div className="mt-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm font-bold text-emerald-300">
            {message}
          </div>
        )}
      </div>
    </section>
  );
}
