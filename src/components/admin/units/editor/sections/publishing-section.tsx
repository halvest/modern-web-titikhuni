import { AlertTriangle, Bath, BedDouble, CarFront, Image as ImageIcon, MapPin, Maximize2, Star } from "lucide-react";
import { formatRupiah } from "@/lib/formatRupiah";
import { type EditorSection, type PropertyFieldErrors, type PropertyFormData } from "../types";

export type PublishIssue = { label: string; section: EditorSection };

export function PublishingSection({
  data,
  onChange,
  issues,
  showIssues,
  onNavigate,
  errors,
}: {
  data: PropertyFormData;
  onChange: (updates: Partial<PropertyFormData>) => void;
  issues: PublishIssue[];
  showIssues: boolean;
  onNavigate: (section: EditorSection) => void;
  errors: PropertyFieldErrors;
}) {
  const seoReady = !!data.title && !!data.slug && !!data.image_url && data.is_indexed;
  const canFeature = ["Tersedia", "Sold", "Coming Soon"].includes(data.status);
  const specs = [
    { icon: Maximize2, label: data.land_area ? `${data.land_area} m² tanah` : null },
    { icon: Maximize2, label: data.building_area ? `${data.building_area} m² bangunan` : null },
    { icon: BedDouble, label: data.bedroom_count ? `${data.bedroom_count} KT` : null },
    { icon: Bath, label: data.bathroom_count ? `${data.bathroom_count} KM` : null },
    { icon: CarFront, label: data.carport_count ? `${data.carport_count} mobil di carport` : null },
  ].filter((item) => item.label);

  return (
    <section className="space-y-6" aria-labelledby="publishing-heading">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-600">Publikasi</p>
        <h2 id="publishing-heading" className="mt-1 text-xl font-semibold text-slate-900">Siap ditayangkan?</h2>
        <p className="mt-1 text-sm text-slate-500">Periksa ringkasan, status, dan kesiapan konten sebelum menayangkan unit.</p>
      </header>

      {showIssues && issues.length > 0 && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4" role="alert">
          <div className="flex items-start gap-3">
            <AlertTriangle size={18} className="mt-0.5 flex-shrink-0 text-rose-600" aria-hidden="true" />
            <div>
              <p className="text-sm font-semibold text-rose-800">Properti belum dapat dipublikasikan.</p>
              <p className="mt-1 text-xs text-rose-700">Periksa bagian berikut:</p>
              <ul className="mt-2 space-y-1">
                {issues.map((issue) => (
                  <li key={`${issue.section}-${issue.label}`}>
                    <button type="button" onClick={() => onNavigate(issue.section)} className="text-left text-sm text-rose-700 underline decoration-rose-300 underline-offset-2 hover:text-rose-900">
                      {issue.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <fieldset className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <legend className="px-1 text-sm font-semibold text-slate-900">Kurasi homepage</legend>
          <div className="mt-3 grid gap-5 lg:grid-cols-[minmax(0,1fr)_11rem] lg:items-start">
            <label className={`flex items-start gap-3 rounded-lg border p-4 transition-colors ${data.is_featured ? "border-emerald-400 bg-emerald-50/60" : "border-slate-200"} ${canFeature ? "cursor-pointer hover:bg-slate-50" : "cursor-not-allowed opacity-60"}`}>
              <input
                type="checkbox"
                checked={data.is_featured}
                disabled={!canFeature}
                onChange={(event) => onChange({
                  is_featured: event.target.checked,
                  featured_order: event.target.checked ? data.featured_order : null,
                })}
                className="mt-0.5 h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
              />
              <span>
                <span className="flex items-center gap-2 text-sm font-medium text-slate-800">
                  <Star size={15} aria-hidden="true" />
                  Tampilkan di Unit Pilihan Kami
                </span>
                <span className="mt-1 block text-xs leading-relaxed text-slate-500">
                  Unit Tersedia, Terjual, dan Coming Soon dapat tampil di homepage.
                </span>
              </span>
            </label>

            <div className="space-y-2">
              <label htmlFor="featured-order" className="block text-sm font-medium text-slate-700">
                Urutan tampil
              </label>
              <select
                id="featured-order"
                value={data.featured_order ?? ""}
                disabled={!data.is_featured}
                onChange={(event) => onChange({ featured_order: event.target.value ? Number(event.target.value) : null })}
                aria-invalid={!!errors.featured_order}
                aria-describedby={errors.featured_order ? "featured-order-error" : "featured-order-help"}
                className={`h-11 w-full rounded-lg border bg-white px-3 text-sm text-slate-900 outline-none focus:ring-2 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400 ${errors.featured_order ? "border-rose-300 focus:border-rose-400 focus:ring-rose-100" : "border-slate-200 focus:border-emerald-500 focus:ring-emerald-100"}`}
              >
                <option value="">Pilih urutan</option>
                {[1, 2, 3, 4, 5, 6].map((order) => <option key={order} value={order}>Urutan {order}</option>)}
              </select>
              <p id={errors.featured_order ? "featured-order-error" : "featured-order-help"} className={`text-xs ${errors.featured_order ? "text-rose-600" : "text-slate-500"}`}>
                {errors.featured_order || "Maksimal enam unit; setiap urutan hanya dapat dipakai sekali."}
              </p>
            </div>
          </div>
        </fieldset>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <h3 className="text-sm font-semibold text-slate-900">Ringkasan properti</h3>
          <div className="mt-4 rounded-lg bg-slate-50 p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div><div className="flex flex-wrap items-center gap-2"><p className="text-base font-semibold text-slate-900">{data.title || "Nama properti belum diisi"}</p><span className="rounded-md bg-white px-2 py-1 text-[11px] font-semibold text-slate-600">{data.status === "Sold" ? "Terjual" : data.status}</span></div>{data.location && <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-500"><MapPin size={14} aria-hidden="true" />{data.location}</p>}</div>
              <p className="text-sm font-semibold text-slate-900">{data.status === "Coming Soon" ? "Harga menyusul" : Number(data.price) > 0 ? formatRupiah(Number(data.price)) : "Harga belum diisi"}</p>
            </div>
            {specs.length > 0 && <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 border-t border-slate-200 pt-4">{specs.map(({ icon: Icon, label }) => <span key={label} className="flex items-center gap-1.5 text-xs text-slate-600"><Icon size={13} aria-hidden="true" />{label}</span>)}</div>}
            <div className="mt-4 grid grid-cols-2 gap-3 border-t border-slate-200 pt-4 text-xs">
              <div className="flex items-center gap-2 text-slate-600"><ImageIcon size={14} aria-hidden="true" /><span>Foto: {data.gallery.length + (data.image_url ? 1 : 0)}</span></div>
              <div><span className="text-slate-500">SEO:</span> <span className={seoReady ? "font-medium text-emerald-700" : "font-medium text-amber-700"}>{seoReady ? "Siap" : "Perlu dilengkapi"}</span></div>
              <div className="col-span-2 flex items-center gap-2 text-slate-600">
                <Star size={14} aria-hidden="true" />
                <span>Homepage: {data.is_featured ? `Unit pilihan urutan ${data.featured_order ?? "belum dipilih"}` : "Tidak ditampilkan"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
