import Link from "next/link";
import {
  PROPERTY_REGIONS,
  REGION_SLUGS,
  type RegionSlug,
} from "@/config/regions";

interface RegionNavProps {
  activeRegion: RegionSlug | null;
}

export function RegionNav({ activeRegion }: RegionNavProps) {
  const linkClass = (active: boolean) =>
    `inline-flex min-h-11 shrink-0 items-center rounded-full border px-5 py-2.5 text-sm font-medium transition duration-200 ${
      active
        ? "border-primary bg-primary text-white shadow-[0_8px_20px_rgba(35,75,59,0.16)]"
        : "border-border-strong bg-white text-foreground-muted hover:border-primary hover:text-primary"
    }`;

  return (
    <div className="relative mb-10">
      <nav
        className="-mx-5 overflow-x-auto px-5 pb-3 pr-12 scrollbar-hide sm:-mx-7 sm:px-7 sm:pr-14 lg:mx-0 lg:px-0 lg:pr-0"
        aria-label="Filter wilayah"
      >
        <div className="flex w-max min-w-full items-center gap-2.5">
          <Link
            href="/unit"
            className={linkClass(activeRegion === null)}
            aria-current={activeRegion === null ? "page" : undefined}
          >
            Semua properti
          </Link>

          {REGION_SLUGS.map((slug) => {
            const active = activeRegion === slug;
            return (
              <Link
                key={slug}
                href={`/unit/${slug}`}
                className={linkClass(active)}
                aria-current={active ? "page" : undefined}
              >
                {PROPERTY_REGIONS[slug].label}
              </Link>
            );
          })}
        </div>
      </nav>
      <div
        className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-[#fdfdfb] to-transparent lg:hidden"
        aria-hidden="true"
      />
    </div>
  );
}
