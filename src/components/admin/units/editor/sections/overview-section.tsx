import { AlertTriangle } from "lucide-react";
import { FormInput, FormSelect, FormTextarea } from "../ui/form-input";
import { type PropertyFieldErrors, type PropertyFormData } from "../types";

export function OverviewSection({
  data,
  onChange,
  errors,
  originalSlug,
}: {
  data: PropertyFormData;
  onChange: (updates: Partial<PropertyFormData>) => void;
  errors: PropertyFieldErrors;
  originalSlug?: string;
}) {
  const slugChanged = !!originalSlug && originalSlug !== data.slug;

  const handleTitleChange = (title: string) => {
    onChange({ title });
    if (!originalSlug) {
      onChange({
        slug: title
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, "")
          .trim()
          .replace(/\s+/g, "-")
          .replace(/-+/g, "-"),
      });
    }
  };

  return (
    <section className="space-y-6" aria-labelledby="overview-heading">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-600">Informasi</p>
        <h2 id="overview-heading" className="mt-1 text-xl font-semibold text-slate-900">Informasi dasar</h2>
        <p className="mt-1 text-sm text-slate-500">Mulai dari identitas yang akan tampil pada katalog properti.</p>
        <p className="mt-3 text-xs text-slate-400"><span className="text-rose-500">*</span> Wajib diisi</p>
      </header>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 space-y-5">
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <FormInput
            id="property-title"
            label="Nama Properti"
            value={data.title}
            onChange={(event) => handleTitleChange(event.target.value)}
            placeholder="Contoh: Rumah Type 36 Titik Huni"
            helper="Nama yang akan tampil pada katalog dan halaman properti."
            error={errors.title}
            required
            autoComplete="off"
          />

          <FormInput
            id="property-slug"
            label="URL Properti"
            value={data.slug}
            onChange={(event) => onChange({ slug: event.target.value.toLowerCase().replace(/\s+/g, "-") })}
            placeholder="rumah-type-36-titik-huni"
            prefix="/unit/"
            helper={`URL: /unit/${data.slug || "nama-properti"} · dibuat otomatis dan tetap dapat diubah.`}
            error={errors.slug}
            required
            autoComplete="off"
          />
        </div>

        {slugChanged && (
          <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
            <AlertTriangle size={17} className="mt-0.5 flex-shrink-0" aria-hidden="true" />
            <div>
              <p className="font-medium">URL publik akan berubah.</p>
              <p className="mt-1 text-xs">Lama: /unit/{originalSlug}</p>
              <p className="text-xs">Baru: /unit/{data.slug || "—"}</p>
              <p className="mt-2 text-xs text-amber-700">Redirect permanen akan dibuat setelah perubahan tersimpan.</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_2fr]">
          <FormSelect
            id="property-status"
            label="Status Unit"
            value={data.status}
            onChange={(event) => onChange({
              status: event.target.value,
              ...(!["Tersedia", "Sold", "Coming Soon"].includes(event.target.value)
                ? { is_featured: false, featured_order: null }
                : {}),
            })}
            helper="Draft tidak tampil di website. Status lain tampil sesuai ketersediaan unit."
            error={errors.status}
            required
          >
            <option value="Draft">Draft</option>
            <option value="Tersedia">Tersedia</option>
            <option value="Booked">Booked</option>
            <option value="Sold">Terjual</option>
            <option value="Coming Soon">Coming Soon</option>
          </FormSelect>

          <FormTextarea
            id="property-description"
            label="Deskripsi Singkat"
            value={data.description}
            onChange={(event) => onChange({ description: event.target.value })}
            placeholder="Jelaskan keunggulan, konsep, dan karakter utama properti."
            helper={`${data.description.length} karakter · deskripsi panjang akan diringkas dengan tombol "Lihat selengkapnya".`}
            rows={3}
          />
        </div>
      </div>
    </section>
  );
}
