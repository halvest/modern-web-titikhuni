"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { formatRupiah } from "@/lib/formatRupiah";
import { CatalogUnitRows } from "./catalog-unit-rows";
import type { CatalogUnit } from "./unit-card";

type FilterKey = "all" | "jogja-utara" | "jogja-selatan" | "jogja-barat" | "jogja-timur";

export function getUnitRegionSlug(unit: CatalogUnit): FilterKey | null {
  if (
    unit.category?.slug &&
    ["jogja-utara", "jogja-selatan", "jogja-barat", "jogja-timur"].includes(unit.category.slug)
  ) {
    return unit.category.slug as FilterKey;
  }
  const loc = (unit.location || "").toLowerCase();
  const title = (unit.title || "").toLowerCase();
  if (loc.includes("bantul") || loc.includes("kasihan") || title.includes("bangunjiwo") || title.includes("trirenggo")) {
    return "jogja-selatan";
  }
  if (loc.includes("kalasan") || loc.includes("berbah") || loc.includes("bebah") || title.includes("tirtomartani") || title.includes("pinka")) {
    return "jogja-timur";
  }
  if (loc.includes("pakem") || loc.includes("candibinangun") || loc.includes("sleman")) {
    return "jogja-utara";
  }
  if (loc.includes("godean") || loc.includes("kulon") || loc.includes("sedayu")) {
    return "jogja-barat";
  }
  return null;
}

export function CatalogFilter({ units }: { units: CatalogUnit[] }) {
  const [activeFilter, setActiveFilter] = useState<FilterKey>("all");

  // Dynamic region counts calculated from actual inventory data
  const counts = useMemo(() => {
    return {
      all: units.length,
      "jogja-utara": units.filter((u) => getUnitRegionSlug(u) === "jogja-utara").length,
      "jogja-selatan": units.filter((u) => getUnitRegionSlug(u) === "jogja-selatan").length,
      "jogja-barat": units.filter((u) => getUnitRegionSlug(u) === "jogja-barat").length,
      "jogja-timur": units.filter((u) => getUnitRegionSlug(u) === "jogja-timur").length,
    };
  }, [units]);

  // District & availability stats breakdown (Sleman 3, Bantul 2, Tersedia 4)
  const stats = useMemo(() => {
    const sleman = units.filter((u) => u.location?.toLowerCase().includes("sleman")).length;
    const bantul = units.filter((u) => u.location?.toLowerCase().includes("bantul")).length;
    const tersedia = units.filter((u) => u.status === "Tersedia").length;
    return { sleman, bantul, tersedia };
  }, [units]);

  // Filtered units
  const visibleUnits = useMemo(() => {
    if (activeFilter === "all") return units;
    return units.filter((unit) => getUnitRegionSlug(unit) === activeFilter);
  }, [units, activeFilter]);

  // Available units & minimum price of currently visible listing
  const available = visibleUnits.filter((unit) => unit.status === "Tersedia");
  const prices = available
    .map((unit) => Number(unit.price))
    .filter((price) => Number.isFinite(price) && price > 0);
  const minimumPrice = prices.length ? Math.min(...prices) : null;

  const filterOptions: { key: FilterKey; label: string; count: number }[] = [
    { key: "all", label: "Semua", count: counts.all },
    { key: "jogja-utara", label: "Jogja Utara", count: counts["jogja-utara"] },
    { key: "jogja-selatan", label: "Jogja Selatan", count: counts["jogja-selatan"] },
    { key: "jogja-barat", label: "Jogja Barat", count: counts["jogja-barat"] },
    { key: "jogja-timur", label: "Jogja Timur", count: counts["jogja-timur"] },
  ];

  const currentLabel = filterOptions.find((o) => o.key === activeFilter)?.label ?? "Kawasan";

  return (
    <>
      {/* Controls & Summary Bar */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between md:mb-8">
        {/* Architectural Filter Buttons: Jogja Utara, Jogja Selatan, Jogja Barat, Jogja Timur */}
        <div
          role="group"
          aria-label="Filter wilayah properti"
          className="flex flex-wrap items-center gap-2 sm:gap-2.5"
        >
          {filterOptions.map((option) => {
            const isActive = activeFilter === option.key;
            return (
              <button
                key={option.key}
                type="button"
                onClick={() => setActiveFilter(option.key)}
                aria-pressed={isActive}
                className={`inline-flex min-h-[38px] items-center gap-2 rounded-[11px] border px-4 py-2 text-[13px] font-medium transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
                  isActive
                    ? "border-primary bg-primary text-white shadow-xs"
                    : "border-border-strong bg-white/80 text-foreground-muted hover:border-primary hover:text-primary hover:bg-white"
                }`}
              >
                <span>{option.label}</span>
                <span
                  className={`text-[11px] font-mono tabular-nums ${
                    isActive ? "text-white/80" : "text-foreground-soft"
                  }`}
                >
                  ({option.count})
                </span>
              </button>
            );
          })}
        </div>

        {/* Dynamic Stats Row: Displays Sleman (3) · Bantul (2) · Tersedia (4) */}
        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs sm:text-[13px] text-foreground-muted">
          {activeFilter === "all" ? (
            <>
              <span className="font-medium text-foreground">
                {visibleUnits.length} listing
              </span>
              <span className="text-border-strong" aria-hidden="true">·</span>
              <span className="tabular-nums">
                Sleman ({stats.sleman})
              </span>
              <span className="text-border-strong" aria-hidden="true">·</span>
              <span className="tabular-nums">
                Bantul ({stats.bantul})
              </span>
              <span className="text-border-strong" aria-hidden="true">·</span>
              <span className="tabular-nums">
                {stats.tersedia} unit tersedia
              </span>
            </>
          ) : (
            <>
              <span className="font-medium text-foreground">
                {visibleUnits.length} listing di {currentLabel}
              </span>
              <span className="text-border-strong" aria-hidden="true">·</span>
              <span className="tabular-nums">
                {available.length} unit tersedia
              </span>
            </>
          )}
          {minimumPrice !== null && (
            <>
              <span className="text-border-strong" aria-hidden="true">·</span>
              <span>
                Mulai <span className="font-semibold text-primary">{formatRupiah(minimumPrice)}</span>
              </span>
            </>
          )}
        </div>
      </div>

      <p className="sr-only" role="status" aria-live="polite">
        Menampilkan {visibleUnits.length} properti untuk {currentLabel}
      </p>

      {/* Grid or Empty State */}
      {visibleUnits.length > 0 ? (
        <CatalogUnitRows units={visibleUnits} />
      ) : (
        <div className="rounded-[1.5rem] border border-border bg-white/70 px-6 py-14 text-center sm:p-16">
          <Search size={36} className="mx-auto mb-4 text-foreground-soft" strokeWidth={1.5} aria-hidden="true" />
          <h3 className="text-xl font-medium tracking-tight text-foreground">
            Belum ada listing di {currentLabel}
          </h3>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-foreground-muted">
            Katalog hunian di kawasan ini sedang dalam proses kurasi arsitektur. Anda dapat menjelajahi kawasan lain atau berkonsultasi untuk ketersediaan mendatang.
          </p>
          <button
            type="button"
            onClick={() => setActiveFilter("all")}
            className="site-button-secondary mt-6"
          >
            Tampilkan semua listing ({counts.all})
          </button>
        </div>
      )}
    </>
  );
}
