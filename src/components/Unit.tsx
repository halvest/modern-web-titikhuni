import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, MapPin, Lock, ChevronRight } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import { formatRupiah } from "@/lib/formatRupiah";

/* ==========================================================================
   TYPE DEFINITIONS
   ========================================================================== */
interface UnitProperty {
  id: string;
  title: string;
  slug: string;
  location: string;
  price: number;
  status: "Tersedia" | "Sold" | "Booked" | "Coming Soon";
  image_url: string;
  categories?: { name: string } | null;
}

/* ==========================================================================
   SUB-COMPONENT: UNIT CARD CONTENT
   ========================================================================== */
const UnitCardContent = ({
  unit,
  index,
}: {
  unit: UnitProperty;
  index: number;
}) => {
  const isLocked = unit.status === "Coming Soon";

  return (
    <div className="group flex flex-col h-full bg-white">
      <div className="relative aspect-[16/10] overflow-hidden bg-stone-100 rounded-sm">
        <Image
          src={unit.image_url || "/assets/images/placeholder-property.jpg"}
          alt={`Properti ${unit.title} di ${unit.location} - Titik Huni`}
          fill
          priority={index < 2}
          sizes="(max-width: 768px) 85vw, (max-width: 1200px) 50vw, 33vw"
          className={`object-cover transition-all duration-1000 ease-in-out ${
            isLocked
              ? "grayscale blur-[2px] opacity-60"
              : "group-hover:scale-[1.03]"
          }`}
        />

        {/* Status Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
          <span className="backdrop-blur-xl bg-white/80 text-stone-900 px-3 py-1 text-[9px] font-bold uppercase tracking-[0.2em] shadow-sm border border-white/20">
            {unit.status}
          </span>
          {unit.categories && (
            <span className="backdrop-blur-xl bg-stone-900/80 text-white px-3 py-1 text-[9px] font-bold uppercase tracking-[0.2em] shadow-sm">
              {unit.categories.name}
            </span>
          )}
        </div>

        {/* Price Tag */}
        {!isLocked && (
          <div className="absolute bottom-4 left-4 z-10">
            <div className="bg-white/90 backdrop-blur-md px-3 py-1.5 border border-stone-100">
              <p className="text-stone-900 text-[10px] md:text-xs font-bold tracking-tight">
                {formatRupiah(unit.price)}
              </p>
            </div>
          </div>
        )}

        {!isLocked && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-stone-900/5 transition-opacity duration-500 z-20">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-2xl transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
              <ArrowUpRight size={18} className="text-stone-900" />
            </div>
          </div>
        )}

        {isLocked && (
          <div className="absolute inset-0 flex items-center justify-center z-20">
            <Lock size={20} className="text-stone-400 opacity-50" />
          </div>
        )}
      </div>

      <div
        className={`mt-6 flex justify-between items-start flex-1 ${isLocked ? "opacity-40" : ""}`}
      >
        <div className="max-w-[80%]">
          <h3 className="text-sm md:text-base font-semibold uppercase tracking-tight text-stone-900 mb-2 group-hover:text-stone-500 transition-colors truncate">
            {unit.title}
          </h3>
          <div className="flex items-center gap-2 text-stone-400">
            <MapPin size={12} className="text-emerald-500" />
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold truncate">
              {unit.location}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ==========================================================================
   MAIN COMPONENT: UNIT (Server Component)
   ========================================================================== */
export const revalidate = 3600;

export const Unit = async () => {
  const supabase = await createClient();

  const { data: units, error } = await supabase
    .from("units")
    .select(
      `id, title, slug, location, price, status, image_url, categories:category_id ( name )`,
    )
    .is("deleted_at", null)
    .order("priority_order", { ascending: true });

  if (error || !units || units.length === 0) {
    return (
      <section className="py-24 text-center bg-stone-50">
        <p className="text-stone-400 text-[10px] uppercase font-bold tracking-widest italic">
          Koleksi sedang diperbarui
        </p>
      </section>
    );
  }

  return (
    <section
      className="py-24 bg-[#FCFCFB] overflow-hidden"
      aria-labelledby="catalog-title"
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* HEADER SECTION: Added View All Link */}
        <header className="mb-12 md:mb-20 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
            <p className="text-[10px] uppercase tracking-[0.4em] text-stone-400 font-bold">
              Curated Collection
            </p>
            <h2
              id="catalog-title"
              className="text-3xl md:text-5xl uppercase tracking-tighter text-stone-900 font-semibold leading-none italic"
            >
              Koleksi Properti <br />
              <span className="text-stone-200 not-italic">Titik Huni</span>
            </h2>
          </div>

          <Link
            href="/unit"
            className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-stone-900 hover:text-emerald-600 transition-colors"
          >
            Lihat Semua Unit{" "}
            <ChevronRight
              size={14}
              className="group-hover:translate-x-1 transition-transform"
            />
          </Link>
        </header>

        {/* GRID CONTAINER: Desktop Grid, Mobile Snap Slider */}
        <div className="relative">
          <div className="flex overflow-x-auto md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-12 pb-8 md:pb-0 snap-x snap-mandatory scrollbar-hide -mx-6 px-6 md:mx-0 md:px-0">
            {units.map((unit, index) => (
              <article
                key={unit.id}
                className="min-w-[85vw] md:min-w-0 snap-center snap-always h-full"
              >
                {unit.status !== "Coming Soon" ? (
                  <Link href={`/unit/${unit.slug}`} className="block h-full">
                    <UnitCardContent unit={unit} index={index} />
                  </Link>
                ) : (
                  <div className="h-full cursor-not-allowed">
                    <UnitCardContent unit={unit} index={index} />
                  </div>
                )}
              </article>
            ))}

            {/* Last Slide Space for Mobile */}
            <div className="min-w-[1px] md:hidden" aria-hidden="true" />
          </div>

          {/* Mobile Instruction Indicator */}
          <div className="flex md:hidden items-center justify-center gap-2 mt-4 text-stone-300">
            <div className="w-8 h-[1px] bg-stone-200" />
            <span className="text-[8px] font-bold uppercase tracking-widest">
              Geser untuk koleksi
            </span>
            <div className="w-8 h-[1px] bg-stone-200" />
          </div>
        </div>
      </div>
    </section>
  );
};
