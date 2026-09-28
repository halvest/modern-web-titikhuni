import { AlertCircle, CheckCircle2, ChevronDown } from "lucide-react";
import { siteConfig } from "@/config/site";
import { FormInput, FormTextarea } from "../ui/form-input";
import { type PropertyFieldErrors, type PropertyFormData } from "../types";

export function SeoSection({
  data,
  onChange,
  errors,
}: {
  data: PropertyFormData;
  onChange: (updates: Partial<PropertyFormData>) => void;
  errors: PropertyFieldErrors;
}) {
  const previewTitle = data.seo_title || data.title || "Nama Properti";
  const previewDescription = data.meta_description || data.description || "Deskripsi singkat properti akan tampil di sini.";
  const previewUrl = `${siteConfig.url.replace(/^https?:\/\//, "")}/unit/${data.slug || "slug-properti"}`;
  const checks = [
    { label: "Judul tersedia", done: !!data.title },
    { label: "Slug tersedia", done: !!data.slug },
    { label: "Foto utama tersedia", done: !!data.image_url },
    { label: "Deskripsi Google tersedia", done: !!data.meta_description },
    { label: "Halaman dapat diindeks", done: data.is_indexed },
  ];
  const completeCount = checks.filter((check) => check.done).length;

  return (
    <section className="space-y-6" aria-labelledby="seo-heading">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-600">SEO</p>
        <h2 id="seo-heading" className="mt-1 text-xl font-semibold text-slate-900">Tampilan mesin pencari</h2>
        <p className="mt-1 text-sm text-slate-500">Pengaturan ini bersifat editorial; kosongkan override untuk memakai data properti.</p>
      </header>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="space-y-5 rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <FormInput
            id="seo-title"
            label="Judul SEO"
            value={data.seo_title || ""}
            onChange={(event) => onChange({ seo_title: event.target.value })}
            placeholder={data.title || "Nama properti"}
            helper="Kosongkan untuk menggunakan nama properti."
          />
          <FormTextarea
            id="meta-description"
            label="Deskripsi Google"
            value={data.meta_description || ""}
            onChange={(event) => onChange({ meta_description: event.target.value })}
            placeholder="Ringkasan singkat halaman properti untuk mesin pencari."
            helper={`${(data.meta_description || "").length} / 160 karakter sebagai panduan editorial.`}
            rows={4}
          />

          <div className="flex items-center justify-between gap-4 rounded-lg border border-slate-200 bg-slate-50 p-4">
            <div>
              <label htmlFor="search-indexing" className="text-sm font-medium text-slate-800">Izinkan mesin pencari mengindeks halaman</label>
              <p id="search-indexing-help" className="mt-1 text-xs text-slate-500">Matikan hanya jika halaman tidak boleh muncul di hasil pencarian.</p>
            </div>
            <label className="relative inline-flex flex-shrink-0 cursor-pointer items-center">
              <input
                id="search-indexing"
                type="checkbox"
                className="peer sr-only"
                checked={data.is_indexed}
                onChange={(event) => onChange({ is_indexed: event.target.checked })}
                aria-describedby="search-indexing-help"
              />
              <span className="h-6 w-11 rounded-full bg-slate-300 transition-colors after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow after:transition-transform peer-checked:bg-emerald-600 peer-checked:after:translate-x-5 peer-focus:ring-2 peer-focus:ring-emerald-200" />
            </label>
          </div>

          <details className="group rounded-lg border border-slate-200" open={!!errors.canonical_url || !!errors.og_image || undefined}>
            <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between px-4 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-emerald-500">
              Pengaturan Lanjutan
              <ChevronDown size={16} className="transition-transform group-open:rotate-180" aria-hidden="true" />
            </summary>
            <div className="space-y-5 border-t border-slate-200 p-4">
              <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                <FormInput
                  id="canonical-url"
                  label="Canonical Override"
                  type="url"
                  value={data.canonical_url || ""}
                  onChange={(event) => onChange({ canonical_url: event.target.value })}
                  placeholder="https://titikhuni.id/unit/..."
                  helper="Biarkan kosong untuk menggunakan URL properti secara otomatis."
                  error={errors.canonical_url}
                />
                <FormInput
                  id="og-image"
                  label="OG Image Override"
                  type="url"
                  value={data.og_image || ""}
                  onChange={(event) => onChange({ og_image: event.target.value })}
                  placeholder="https://..."
                  helper="Biarkan kosong untuk menggunakan foto utama."
                  error={errors.og_image}
                />
              </div>
            </div>
          </details>
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-900">Pratinjau pencarian</h3>
            <p className="mt-1 text-xs text-slate-500">Tampilan sebenarnya dapat berbeda di mesin pencari.</p>
            <div className="mt-5 border-t border-slate-100 pt-4">
              <p className="text-xs text-emerald-700">{previewUrl}</p>
              <p className="mt-1 line-clamp-2 text-lg font-medium leading-snug text-blue-800">{previewTitle} | Titik Huni</p>
              <p className="mt-1 line-clamp-3 text-sm leading-relaxed text-slate-600">{previewDescription}</p>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-3"><h3 className="text-sm font-semibold text-slate-900">Kelengkapan SEO</h3><span className="text-xs font-medium text-slate-500">{completeCount} dari {checks.length}</span></div>
            <div className="mt-4 space-y-3">
              {checks.map((check) => (
                <div key={check.label} className="flex items-center gap-2 text-xs">
                  {check.done ? <CheckCircle2 size={15} className="text-emerald-600" aria-hidden="true" /> : <AlertCircle size={15} className="text-amber-500" aria-hidden="true" />}
                  <span className={check.done ? "text-slate-700" : "text-slate-500"}>{check.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
