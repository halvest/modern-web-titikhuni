import Image from "next/image";
import Link from "next/link";
import { ArrowRight, LockKeyhole, MapPin } from "lucide-react";

export type UnitCardData = {
  id: string;
  title: string;
  slug: string;
  location: string | null;
  price: number | string;
  price_prefix?: string | null;
  certificate_type?: string | null;
  status: string;
  image_url: string | null;
  land_area: number | null;
  building_area: number | null;
  bedroom_count: number | null;
  bathroom_count: number | null;
  carport_count?: number | null;
};

export type CatalogUnit = UnitCardData & {
  priority_order: number | null;
  created_at: string;
  updated_at: string | null;
  category: { name: string; slug: string } | null;
};

const compactNumber = new Intl.NumberFormat("id-ID", { maximumFractionDigits: 1 });

function formatCompactPrice(value: number | string) {
  const price = Number(value);
  if (!Number.isFinite(price) || price <= 0) return "Hubungi kami";
  if (price >= 1_000_000_000) return `Rp ${compactNumber.format(price / 1_000_000_000)} Miliar`;
  if (price >= 1_000_000) return `Rp ${compactNumber.format(price / 1_000_000)} Juta`;
  return `Rp ${compactNumber.format(price)}`;
}

export function UnitCard({
  unit,
  index,
  variant = "catalog",
}: {
  unit: UnitCardData;
  index: number;
  variant?: "catalog" | "featured";
}) {
  const isComingSoon = unit.status === "Coming Soon";
  const isSold = unit.status === "Sold";
  const isBooked = unit.status === "Booked";

  const displayLocation = unit.location
    ? unit.location.split(",").map((part) => part.trim()).filter(Boolean).join(", ")
    : "Yogyakarta";

  const specs = [
    unit.bedroom_count && Number(unit.bedroom_count) > 0 ? `${unit.bedroom_count} KT` : null,
    unit.bathroom_count && Number(unit.bathroom_count) > 0 ? `${unit.bathroom_count} KM` : null,
    unit.carport_count && Number(unit.carport_count) > 0 ? `${unit.carport_count} Carport` : null,
    unit.land_area && Number(unit.land_area) > 0 ? `LT ${unit.land_area} m²` : null,
    unit.building_area && Number(unit.building_area) > 0 ? `LB ${unit.building_area} m²` : null,
  ].filter(Boolean) as string[];

  const cardContent = (
    <>
      {/* 1. Image Container (Clean, no price badge cluttering image) */}
      <figure className="relative m-0 aspect-[16/10] shrink-0 overflow-hidden bg-surface-muted">
        {unit.image_url ? (
          <Image
            src={unit.image_url}
            alt={`${unit.title}, rumah di ${displayLocation}`}
            fill
            preload={index < (variant === "featured" ? 1 : 3)}
            sizes={variant === "featured"
              ? "(max-width: 639px) 86vw, (max-width: 1023px) 44vw, 33vw"
              : "(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw"}
            className={isComingSoon
              ? "scale-105 object-cover blur-[3px] grayscale"
              : "object-cover transition-transform duration-700 ease-out group-hover:scale-[1.035]"}
          />
        ) : (
          <div className="flex h-full items-center justify-center px-6 text-center text-sm text-foreground-soft">
            Foto unit belum tersedia
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-black/5" />
        {isComingSoon && <div className="absolute inset-0 bg-slate-900/15" aria-hidden="true" />}

        {/* Status Badge (Refined radius 8px, not oversized pill) */}
        <span
          className={`absolute left-3.5 top-3.5 inline-flex items-center gap-1.5 rounded-[8px] border px-2.5 py-1 text-[0.62rem] font-semibold uppercase tracking-wider backdrop-blur-md shadow-xs ${
            isSold
              ? "border-rose-700/20 bg-rose-50/95 text-rose-700"
              : isBooked
              ? "border-amber-700/20 bg-amber-50/95 text-amber-800"
              : isComingSoon
              ? "border-border bg-slate-900/80 text-white"
              : "border-emerald-700/20 bg-emerald-50/95 text-emerald-700"
          }`}
        >
          {isComingSoon ? (
            <LockKeyhole size={11} aria-hidden="true" />
          ) : (
            <span
              className={`size-1.5 rounded-full ${
                isSold ? "bg-rose-600" : isBooked ? "bg-amber-600" : "bg-emerald-600"
              }`}
              aria-hidden="true"
            />
          )}
          {isSold ? "Terjual" : isBooked ? "Dipesan" : unit.status}
        </span>
      </figure>

      {/* 2. Content Area (Price, Title, Location, Specs, CTA) */}
      <div className="flex flex-1 flex-col p-5">
        {/* Top: Location, Title & Price */}
        <div className="flex items-start justify-between gap-3">
          {/* Left: Location & Title stacked naturally without gap */}
          <div className="min-w-0 flex-1">
            <p className="flex items-center gap-1.5 text-[0.78rem] font-medium text-primary">
              <MapPin size={13} className="shrink-0" aria-hidden="true" />
              <span className="truncate">{displayLocation}</span>
            </p>

            <h3 className="mt-1 text-balance text-[1.125rem] font-medium leading-[1.3] tracking-tight text-foreground transition-colors group-hover:text-primary">
              {unit.title}
            </h3>
          </div>

          {/* Right: Prefix & Price */}
          <div className="shrink-0 text-right">
            {isComingSoon ? (
              <span className="text-xs font-medium text-foreground-muted">Harga menyusul</span>
            ) : (
              <div>
                <span className="block text-[0.75rem] font-semibold text-foreground-muted leading-tight mb-0.5">
                  {unit.price_prefix || "Mulai"}
                </span>
                <span className="text-[1.0625rem] font-semibold tracking-tight text-foreground">
                  {formatCompactPrice(unit.price)}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="mt-auto pt-4">
          {/* Specs with clean dot separators */}
          <div className="flex flex-wrap items-center gap-x-1.5 sm:gap-x-2 gap-y-1 border-t border-border/80 py-3 text-[0.7rem] tracking-tight sm:tracking-normal sm:text-[0.8125rem] text-foreground-muted">
            {isComingSoon ? (
              <span className="text-[0.7rem] sm:text-xs text-foreground-soft">Spesifikasi segera dirilis</span>
            ) : specs.length > 0 ? (
              specs.map((spec, i) => (
                <span key={spec} className="inline-flex items-center gap-1.5 sm:gap-2 whitespace-nowrap">
                  {i > 0 && <span className="text-border-strong" aria-hidden="true">·</span>}
                  <span>{spec}</span>
                </span>
              ))
            ) : (
              <span className="text-[0.7rem] sm:text-xs text-foreground-soft">Informasi ruang tersedia</span>
            )}
          </div>

          {/* Bottom CTA Row (Subtle architectural affordance) */}
          <div className="flex items-center justify-between border-t border-border/60 pt-3">
            <span className="text-[0.75rem] font-medium text-foreground-muted">
              {isComingSoon ? "Segera Hadir" : `Legalitas: ${unit.certificate_type || "SHM"}`}
            </span>

            <span
              className={`inline-flex items-center gap-1.5 text-[0.78rem] font-semibold tracking-wider uppercase transition-colors ${
                isComingSoon ? "text-foreground-soft" : "text-primary group-hover:text-primary-hover"
              }`}
            >
              {isComingSoon ? "Detail" : "Lihat Detail"}
              <ArrowRight
                size={14}
                className={`transition-transform duration-300 ${isComingSoon ? "" : "group-hover:translate-x-1"}`}
                aria-hidden="true"
              />
            </span>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <article
      className={`group relative flex h-full min-w-0 flex-col overflow-hidden rounded-[1.25rem] border border-border/80 bg-white/80 backdrop-blur-xs transition-all duration-300 ${
        isComingSoon
          ? "opacity-95"
          : "hover:-translate-y-1 hover:border-primary/30 hover:bg-white hover:shadow-[0_16px_36px_-18px_rgba(35,68,56,0.14)]"
      }`}
    >
      {isComingSoon ? (
        <div className="flex h-full flex-col cursor-default" aria-label={`${unit.title} segera hadir`}>
          {cardContent}
        </div>
      ) : (
        <Link
          href={`/unit/${unit.slug}`}
          className="flex h-full flex-col focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset"
          aria-label={`Lihat detail ${unit.title} di ${displayLocation}`}
        >
          {cardContent}
        </Link>
      )}
    </article>
  );
}
