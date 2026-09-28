import { FormInput, FormSelect } from "../ui/form-input";
import { type PropertyFieldErrors, type PropertyFormData } from "../types";

export function DetailsSection({
  data,
  onChange,
  errors,
}: {
  data: PropertyFormData;
  onChange: (updates: Partial<PropertyFormData>) => void;
  errors: PropertyFieldErrors;
}) {
  return (
    <section className="space-y-6" aria-labelledby="details-heading">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-600">Spesifikasi</p>
        <h2 id="details-heading" className="mt-1 text-xl font-semibold text-slate-900">Detail bangunan</h2>
        <p className="mt-1 text-sm text-slate-500">Kelompokkan ukuran dan jumlah ruangan agar mudah diperiksa.</p>
      </header>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <h3 className="text-sm font-semibold text-slate-900">Dimensi</h3>
        <p className="mt-1 text-xs text-slate-500">Masukkan luas dalam meter persegi.</p>
        <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <FormInput
            id="land-area"
            label="Luas Tanah"
            type="number"
            inputMode="numeric"
            min="0"
            value={data.land_area}
            onChange={(event) => onChange({ land_area: event.target.value })}
            placeholder="70"
            suffix="m²"
            error={errors.land_area}
          />
          <FormInput
            id="building-area"
            label="Luas Bangunan"
            type="number"
            inputMode="numeric"
            min="0"
            value={data.building_area}
            onChange={(event) => onChange({ building_area: event.target.value })}
            placeholder="73"
            suffix="m²"
            error={errors.building_area}
          />
          <FormInput
            id="floor-count"
            label="Jumlah Lantai"
            type="number"
            inputMode="numeric"
            min="1"
            step="1"
            value={data.floor_count}
            onChange={(event) => onChange({ floor_count: event.target.value })}
            placeholder="1"
            helper="Kosongkan jika belum dikonfirmasi."
            error={errors.floor_count}
          />
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <h3 className="text-sm font-semibold text-slate-900">Ruangan & parkir</h3>
        <p className="mt-1 text-xs text-slate-500">Gunakan angka nol jika fasilitas belum tersedia.</p>
        <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <FormInput
            id="bedroom-count"
            label="Kamar Tidur"
            type="number"
            inputMode="numeric"
            min="0"
            value={data.bedroom_count}
            onChange={(event) => onChange({ bedroom_count: event.target.value })}
            placeholder="3"
            error={errors.bedroom_count}
          />
          <FormInput
            id="bathroom-count"
            label="Kamar Mandi"
            type="number"
            inputMode="numeric"
            min="0"
            value={data.bathroom_count}
            onChange={(event) => onChange({ bathroom_count: event.target.value })}
            placeholder="2"
            error={errors.bathroom_count}
          />
          <FormInput
            id="carport-count"
            label="Kapasitas Carport"
            type="number"
            inputMode="numeric"
            min="0"
            step="1"
            value={data.carport_count}
            onChange={(event) => onChange({ carport_count: event.target.value })}
            placeholder="2"
            suffix="mobil"
            error={errors.carport_count}
          />
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <h3 className="text-sm font-semibold text-slate-900">Legalitas & utilitas</h3>
        <p className="mt-1 text-xs text-slate-500">Pilih data yang sudah dikonfirmasi. Biarkan kosong jika belum tersedia.</p>
        <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <FormSelect
            id="certificate-type"
            label="Sertifikat"
            value={data.certificate_type}
            onChange={(event) => onChange({ certificate_type: event.target.value })}
            helper="Jenis sertifikat utama properti."
            error={errors.certificate_type}
          >
            <option value="">Belum dikonfirmasi</option>
            <option value="SHM">SHM</option>
            <option value="HGB">HGB</option>
            <option value="Lainnya">Lainnya</option>
          </FormSelect>
          <FormInput
            id="electricity-power"
            label="Daya Listrik"
            type="number"
            inputMode="numeric"
            min="1"
            step="1"
            value={data.electricity_power}
            onChange={(event) => onChange({ electricity_power: event.target.value })}
            placeholder="1300"
            suffix="VA"
            helper="Contoh: 1300 atau 2200 VA."
            error={errors.electricity_power}
          />
          <FormSelect
            id="water-source"
            label="Sumber Air"
            value={data.water_source}
            onChange={(event) => onChange({ water_source: event.target.value })}
            helper="Sumber air utama yang digunakan."
            error={errors.water_source}
          >
            <option value="">Belum dikonfirmasi</option>
            <option value="Sumur">Sumur</option>
            <option value="PDAM">PDAM</option>
            <option value="Sumur Bor">Sumur Bor</option>
            <option value="Lainnya">Lainnya</option>
          </FormSelect>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <h3 className="text-sm font-semibold text-slate-900">Kondisi</h3>
        <p className="mt-1 text-xs text-slate-500">Jelaskan kondisi furnitur saat properti diserahkan.</p>
        <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <FormSelect
            id="furnishing"
            label="Furnishing"
            value={data.furnishing}
            onChange={(event) => onChange({ furnishing: event.target.value })}
            error={errors.furnishing}
          >
            <option value="">Belum dikonfirmasi</option>
            <option value="Non Furnished">Non Furnished</option>
            <option value="Semi Furnished">Semi Furnished</option>
            <option value="Full Furnished">Full Furnished</option>
          </FormSelect>
        </div>
      </div>
    </section>
  );
}
