import { ArrowDown, ArrowUp, Check, Plus, Trash2 } from "lucide-react";
import { type PropertyFieldErrors, type PropertyFormData, type SellingPoint } from "../types";

const SYMBOLS = ["", "✓", "★", "→", "•", "📍"];

export function SellingPointsSection({
  data,
  onChange,
  errors,
}: {
  data: PropertyFormData;
  onChange: (updates: Partial<PropertyFormData>) => void;
  errors: PropertyFieldErrors;
}) {
  const points = data.selling_points;

  const updatePoint = (index: number, updates: Partial<SellingPoint>) => {
    onChange({
      selling_points: points.map((point, itemIndex) => itemIndex === index ? { ...point, ...updates } : point),
    });
  };

  const movePoint = (index: number, direction: -1 | 1) => {
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= points.length) return;
    const next = [...points];
    [next[index], next[nextIndex]] = [next[nextIndex], next[index]];
    onChange({ selling_points: next });
  };

  return (
    <section className="space-y-6" aria-labelledby="selling-points-heading">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-600">Selling Point</p>
        <h2 id="selling-points-heading" className="mt-1 text-xl font-semibold text-slate-900">Keunggulan properti</h2>
        <p className="mt-1 text-sm text-slate-500">Tambahkan 3–8 alasan singkat yang paling membantu calon pembeli.</p>
      </header>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Daftar keunggulan</h3>
            <p className="mt-1 text-xs text-slate-500">Simbol opsional. Jika kosong, website menggunakan ikon centang.</p>
          </div>
          <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600">{points.length}/8</span>
        </div>

        <div className="mt-5 space-y-3">
          {points.map((point, index) => (
            <div key={index} className="grid grid-cols-[4.5rem_minmax(0,1fr)] gap-2 rounded-lg border border-slate-200 bg-slate-50 p-3 sm:grid-cols-[4.5rem_minmax(0,1fr)_auto] sm:items-center">
              <label className="sr-only" htmlFor={`selling-point-symbol-${index}`}>Simbol selling point {index + 1}</label>
              <select
                id={`selling-point-symbol-${index}`}
                value={point.symbol || ""}
                onChange={(event) => updatePoint(index, { symbol: event.target.value })}
                className="h-11 rounded-lg border border-slate-200 bg-white px-2 text-center text-base outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                aria-label={`Simbol selling point ${index + 1}`}
              >
                {SYMBOLS.map((symbol) => <option key={symbol || "default"} value={symbol}>{symbol || "Default"}</option>)}
              </select>
              <label className="sr-only" htmlFor={`selling-point-text-${index}`}>Teks selling point {index + 1}</label>
              <input
                id={`selling-point-text-${index}`}
                value={point.text}
                onChange={(event) => updatePoint(index, { text: event.target.value })}
                placeholder={index === 0 ? "Contoh: 8 menit ke pusat kota" : "Tulis keunggulan properti"}
                maxLength={100}
                className="h-11 min-w-0 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              />
              <div className="col-span-2 flex items-center justify-end gap-1 sm:col-span-1">
                <button type="button" onClick={() => movePoint(index, -1)} disabled={index === 0} className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-500 hover:bg-white hover:text-slate-900 disabled:opacity-30" aria-label={`Naikkan selling point ${index + 1}`}><ArrowUp size={16} /></button>
                <button type="button" onClick={() => movePoint(index, 1)} disabled={index === points.length - 1} className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-500 hover:bg-white hover:text-slate-900 disabled:opacity-30" aria-label={`Turunkan selling point ${index + 1}`}><ArrowDown size={16} /></button>
                <button type="button" onClick={() => onChange({ selling_points: points.filter((_, itemIndex) => itemIndex !== index) })} className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-500 hover:bg-rose-50 hover:text-rose-600" aria-label={`Hapus selling point ${index + 1}`}><Trash2 size={16} /></button>
              </div>
            </div>
          ))}
        </div>

        {points.length === 0 && (
          <div className="mt-5 rounded-lg border border-dashed border-slate-200 bg-slate-50 px-5 py-8 text-center">
            <Check size={24} className="mx-auto text-slate-300" />
            <p className="mt-2 text-sm font-medium text-slate-700">Belum ada selling point.</p>
            <p className="mt-1 text-xs text-slate-500">Tambahkan fakta singkat yang benar-benar membedakan properti ini.</p>
          </div>
        )}

        {errors.selling_points && <p className="mt-3 text-xs text-rose-600" role="alert">{errors.selling_points}</p>}

        <button
          type="button"
          onClick={() => onChange({ selling_points: [...points, { text: "", symbol: "" }] })}
          disabled={points.length >= 8}
          className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Plus size={16} aria-hidden="true" /> Tambah Selling Point
        </button>
      </div>
    </section>
  );
}
