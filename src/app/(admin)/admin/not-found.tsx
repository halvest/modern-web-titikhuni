import Link from "next/link";
import { ArrowLeft, LayoutDashboard } from "lucide-react";

export default function AdminNotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-xl items-center justify-center px-4">
      <div className="w-full rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">404</p>
        <h1 className="mt-3 text-xl font-semibold text-slate-900">Halaman admin tidak ditemukan</h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          Alamat mungkin sudah berubah atau data yang Anda buka sudah tidak tersedia.
        </p>
        <div className="mt-6 flex flex-col justify-center gap-2 sm:flex-row">
          <Link href="/admin/dashboard" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 text-sm font-semibold text-white hover:bg-slate-800">
            <LayoutDashboard size={15} aria-hidden="true" /> Ke dashboard
          </Link>
          <Link href="/" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50">
            <ArrowLeft size={15} aria-hidden="true" /> Ke situs utama
          </Link>
        </div>
      </div>
    </div>
  );
}
