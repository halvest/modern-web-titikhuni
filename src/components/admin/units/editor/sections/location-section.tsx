import { MapPin } from "lucide-react";
import { FormInput, FormSelect, FormTextarea } from "../ui/form-input";
import { type PropertyFieldErrors, type PropertyFormData } from "../types";

type LocationField = "village" | "district" | "city" | "province";

function buildLocation(data: Pick<PropertyFormData, LocationField>) {
  const granular = [data.village, data.district, data.city]
    .map((value) => value.trim())
    .filter(Boolean);
  if (!granular.length) return "";
  return [...granular, data.province.trim()].filter(Boolean).join(", ");
}

export function LocationSection({
  data,
  onChange,
  categories,
  errors,
}: {
  data: PropertyFormData;
  onChange: (updates: Partial<PropertyFormData>) => void;
  categories: { id: string; name: string }[];
  errors: PropertyFieldErrors;
}) {
  const updateLocationField = (field: LocationField, value: string) => {
    const next = { ...data, [field]: value };
    onChange({ [field]: value, location: buildLocation(next) || data.location });
  };

  const locationPreview = buildLocation(data) || data.location || data.province || "Lokasi belum diisi";

  return (
    <section className="space-y-6" aria-labelledby="location-heading">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-600">Lokasi</p>
        <h2 id="location-heading" className="mt-1 text-xl font-semibold text-slate-900">Lokasi properti</h2>
        <p className="mt-1 text-sm text-slate-500">Isi dari wilayah besar ke area spesifik. Koordinat tidak diperlukan.</p>
      </header>

      <div className="space-y-5 rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <FormSelect
          id="property-region"
          label="Wilayah Jogja"
          value={data.category_id}
          onChange={(event) => onChange({ category_id: event.target.value })}
          helper="Digunakan untuk breadcrumb, katalog wilayah, dan rekomendasi unit terkait."
          error={errors.category_id}
          required
        >
          <option value="">Pilih wilayah</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>{category.name}</option>
          ))}
        </FormSelect>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <FormInput id="property-village" label="Kelurahan / Desa" value={data.village} onChange={(event) => updateLocationField("village", event.target.value)} placeholder="Bangunjiwo" error={errors.village} />
          <FormInput id="property-district" label="Kecamatan" value={data.district} onChange={(event) => updateLocationField("district", event.target.value)} placeholder="Kasihan" error={errors.district} />
          <FormInput id="property-city" label="Kabupaten / Kota" value={data.city} onChange={(event) => updateLocationField("city", event.target.value)} placeholder="Bantul" error={errors.city} />
          <FormInput id="property-province" label="Provinsi" value={data.province} onChange={(event) => updateLocationField("province", event.target.value)} placeholder="Daerah Istimewa Yogyakarta" error={errors.province} />
        </div>

        <FormTextarea
          id="property-full-address"
          label="Alamat Lengkap (Opsional)"
          value={data.full_address}
          onChange={(event) => onChange({ full_address: event.target.value })}
          placeholder="Nama jalan, nomor, patokan, atau detail tambahan."
          helper="Tidak perlu diisi jika alamat lengkap belum boleh dipublikasikan."
          rows={3}
          error={errors.full_address}
        />

        <div className="flex items-start gap-2 rounded-lg bg-slate-50 p-3 text-sm text-slate-600">
          <MapPin size={16} className="mt-0.5 flex-shrink-0 text-emerald-600" aria-hidden="true" />
          <div>
            <p className="text-xs font-medium text-slate-500">Pratinjau lokasi publik</p>
            <p className="mt-0.5">{locationPreview}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
