import { formatRupiah } from "@/lib/formatRupiah";
import { FormInput, FormSelect } from "../ui/form-input";
import { type PropertyFieldErrors, type PropertyFormData } from "../types";

const formatPriceInput = (value: string) => {
  const numeric = value.replace(/\D/g, "");
  return numeric ? Number(numeric).toLocaleString("id-ID") : "";
};

const compactNumber = new Intl.NumberFormat("id-ID", { maximumFractionDigits: 1 });

function publicPrice(data: PropertyFormData) {
  const price = Number(data.price);
  if (data.status === "Coming Soon" || !price) return "Harga menyusul";

  let amount = formatRupiah(price);
  if (data.price_suffix === "Juta" && price >= 1_000_000) {
    amount = `Rp${compactNumber.format(price / 1_000_000)} Juta`;
  } else if (data.price_suffix === "Miliar" && price >= 1_000_000_000) {
    amount = `Rp${compactNumber.format(price / 1_000_000_000)} Miliar`;
  }

  return [data.price_prefix, amount].filter(Boolean).join(" ");
}

export function PricingSection({
  data,
  onChange,
  errors,
}: {
  data: PropertyFormData;
  onChange: (updates: Partial<PropertyFormData>) => void;
  errors: PropertyFieldErrors;
}) {
  return (
    <section className="space-y-6" aria-labelledby="pricing-heading">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-600">Harga</p>
        <h2 id="pricing-heading" className="mt-1 text-xl font-semibold text-slate-900">Harga properti</h2>
        <p className="mt-1 text-sm text-slate-500">Masukkan nilai penuh; label akan membantu harga terasa natural di halaman publik.</p>
      </header>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <FormInput
            id="property-price"
            label="Harga"
            type="text"
            inputMode="numeric"
            value={formatPriceInput(data.price)}
            onChange={(event) => onChange({ price: event.target.value.replace(/\D/g, "") })}
            placeholder="550.000.000"
            prefix="Rp"
            helper={data.status === "Coming Soon" ? "Boleh dikosongkan untuk unit Coming Soon." : "Masukkan angka penuh tanpa singkatan."}
            error={errors.price}
            required={data.status !== "Coming Soon"}
          />
          <FormSelect
            id="price-prefix"
            label="Prefix Harga"
            value={data.price_prefix}
            onChange={(event) => onChange({ price_prefix: event.target.value })}
            helper="Teks pendek yang tampil sebelum harga."
            error={errors.price_prefix}
          >
            <option value="">Tanpa prefix</option>
            <option value="Mulai">Mulai</option>
            <option value="Mulai dari">Mulai dari</option>
            <option value="Harga">Harga</option>
            <option value="Promo">Promo</option>
          </FormSelect>
          <FormSelect
            id="price-suffix"
            label="Format Ringkas"
            value={data.price_suffix}
            onChange={(event) => onChange({ price_suffix: event.target.value })}
            helper="Opsional; gunakan jika ingin format Juta atau Miliar."
            error={errors.price_suffix}
          >
            <option value="">Harga penuh</option>
            <option value="Juta">Juta</option>
            <option value="Miliar">Miliar</option>
          </FormSelect>
        </div>

        <div className="mt-5 rounded-lg border border-emerald-100 bg-emerald-50 px-4 py-3">
          <p className="text-xs font-medium text-emerald-700">Pratinjau harga publik</p>
          <p className="mt-1 text-lg font-semibold text-emerald-950">{publicPrice(data)}</p>
        </div>
      </div>
    </section>
  );
}
