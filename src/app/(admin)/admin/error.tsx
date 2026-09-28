"use client";

import { RotateCcw, TriangleAlert } from "lucide-react";

export default function AdminError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-xl items-center justify-center px-4">
      <div className="w-full rounded-2xl border border-rose-200 bg-white p-8 text-center shadow-sm">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-50 text-rose-600">
          <TriangleAlert size={22} aria-hidden="true" />
        </span>
        <h1 className="mt-5 text-xl font-semibold text-slate-900">Halaman gagal dimuat</h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">Terjadi gangguan saat mengambil data admin. Tidak ada perubahan yang disimpan.</p>
        <button type="button" onClick={reset} className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 text-sm font-semibold text-white transition-colors hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2">
          <RotateCcw size={15} aria-hidden="true" /> Coba lagi
        </button>
      </div>
    </div>
  );
}
