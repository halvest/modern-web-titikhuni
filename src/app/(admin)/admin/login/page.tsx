"use client";

import { useActionState, useEffect, useState } from "react";
import { ArrowRight, Eye, EyeOff, Home, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { loginAction, type LoginError, type LoginState } from "./actions";

const initialState: LoginState = { error: null };

const ERROR_MESSAGES: Record<Exclude<LoginError, null>, string> = {
  invalid_credentials: "Email atau password tidak sesuai.",
  unauthorized: "Akun ini tidak memiliki akses administrator.",
  profile_missing: "Profil administrator belum tersedia.",
  profile_error: "Profil administrator gagal diverifikasi.",
  validation_error: "Lengkapi email dan password.",
  session_expired: "Sesi Anda telah berakhir. Silakan masuk kembali.",
  server_error: "Layanan login sedang tidak tersedia. Coba lagi beberapa saat.",
};

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(loginAction, initialState);
  const [showPassword, setShowPassword] = useState(false);
  const [routeError, setRouteError] = useState<LoginError>(null);
  const error = state.error || routeError;

  useEffect(() => {
    const value = new URLSearchParams(window.location.search).get("error");
    if (value === "unauthorized") setRouteError("unauthorized");
    if (value === "session_expired") setRouteError("session_expired");
    if (value === "server_error") setRouteError("server_error");
  }, []);

  return (
    <main className="relative grid min-h-dvh overflow-hidden bg-slate-950 lg:grid-cols-[minmax(0,0.9fr)_minmax(32rem,1.1fr)]">
      <section className="relative hidden overflow-hidden border-r border-white/10 p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(16,185,129,0.2),transparent_36%),radial-gradient(circle_at_80%_75%,rgba(59,130,246,0.13),transparent_32%)]" aria-hidden="true" />
        <div className="relative">
          <Link href="/" className="inline-flex items-center gap-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500 text-sm font-black text-slate-950">TH</span>
            <span>
              <span className="block text-lg font-bold tracking-tight">Titik<span className="text-emerald-400">Huni</span></span>
              <span className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">Property Management</span>
            </span>
          </Link>
        </div>

        <div className="relative max-w-lg">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">Ruang kerja terpusat</p>
          <h1 className="mt-4 text-4xl font-semibold leading-tight tracking-tight xl:text-5xl">
            Kelola properti, konten, dan prospek dalam satu dashboard.
          </h1>
          <p className="mt-5 max-w-md text-sm leading-7 text-slate-400">
            Pantau performa bisnis, perbarui katalog, dan tindak lanjuti lead dengan alur kerja yang aman dan konsisten.
          </p>
        </div>

        <div className="relative flex items-center gap-2 text-xs text-slate-500">
          <ShieldCheck size={15} className="text-emerald-400" aria-hidden="true" />
          Akses terbatas untuk administrator terverifikasi
        </div>
      </section>

      <section className="flex min-h-dvh items-center justify-center bg-slate-50 px-5 py-10 sm:px-8">
        <div className="w-full max-w-md">
          <div className="mb-8 flex items-center justify-between lg:hidden">
            <Link href="/" className="text-base font-bold tracking-tight text-slate-900">
              Titik<span className="text-emerald-600">Huni</span>
            </Link>
            <Link href="/" className="inline-flex min-h-10 items-center gap-2 rounded-lg px-3 text-sm font-medium text-slate-500 hover:bg-white hover:text-slate-900">
              <Home size={15} aria-hidden="true" /> Situs
            </Link>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div>
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <ShieldCheck size={20} aria-hidden="true" />
              </span>
              <h1 className="mt-5 text-2xl font-semibold tracking-tight text-slate-900">Masuk ke dashboard</h1>
              <p className="mt-2 text-sm leading-6 text-slate-500">Gunakan akun administrator Titik Huni.</p>
            </div>

            <form action={formAction} className="mt-7 space-y-5">
              {error && (
                <div role="alert" aria-live="polite" className="rounded-lg border border-rose-200 bg-rose-50 px-3.5 py-3 text-sm font-medium text-rose-700">
                  {ERROR_MESSAGES[error]}
                </div>
              )}

              <div>
                <label htmlFor="admin-email" className="text-sm font-medium text-slate-700">Email</label>
                <input id="admin-email" required autoComplete="email" name="email" type="email" placeholder="admin@titikhuni.id" disabled={pending} className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 disabled:bg-slate-50" />
              </div>

              <div>
                <label htmlFor="admin-password" className="text-sm font-medium text-slate-700">Password</label>
                <div className="relative mt-2">
                  <input id="admin-password" required autoComplete="current-password" name="password" type={showPassword ? "text" : "password"} placeholder="Masukkan password" disabled={pending} className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-3 pr-12 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 disabled:bg-slate-50" />
                  <button type="button" onClick={() => setShowPassword((value) => !value)} className="absolute right-1.5 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-slate-50 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500" aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}>
                    {showPassword ? <EyeOff size={17} aria-hidden="true" /> : <Eye size={17} aria-hidden="true" />}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={pending} className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:cursor-wait disabled:opacity-60">
                {pending ? <><span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" aria-hidden="true" /> Memverifikasi...</> : <>Masuk <ArrowRight size={16} aria-hidden="true" /></>}
              </button>
            </form>
          </div>

          <p className="mt-5 text-center text-xs leading-5 text-slate-400">Jika akses ditolak, hubungi pengelola akun administrator.</p>
        </div>
      </section>
    </main>
  );
}
