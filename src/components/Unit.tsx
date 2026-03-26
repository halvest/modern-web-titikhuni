"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, MapPin, Lock, Home } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { formatRupiah } from "@/lib/formatRupiah";

// Type definition sesuai schema database baru
interface UnitProperty {
  id: string;
  title: string;
  slug: string;
  location: string;
  price: number;
  status: "Tersedia" | "Sold" | "Booked" | "Coming Soon";
  image_url: string;
  categories: { name: string } | null;
}

const UnitCardContent = ({
  unit,
  index,
}: {
  unit: UnitProperty;
  index: number;
}) => {
  const isLocked = unit.status === "Coming Soon";

  return (
    <>
      <div
        className={`relative aspect-[16/10] overflow-hidden bg-neutral-100 ${isLocked ? "grayscale" : ""}`}
      >
        <Image
          src={unit.image_url}
          alt={unit.title}
          fill
          priority={index < 2}
          sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 33vw"
          className={`object-cover transition-transform duration-700 ${isLocked ? "blur-[2px] opacity-60" : "group-hover:scale-105"}`}
        />

        {/* Badge Status & Kategori */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          <span className="backdrop-blur-md px-3 py-1 text-[9px] uppercase tracking-widest font-bold bg-white/90 text-black w-fit">
            {unit.status}
          </span>
          {unit.categories && (
            <span className="backdrop-blur-md px-3 py-1 text-[9px] uppercase tracking-widest font-bold bg-black/80 text-white w-fit">
              {unit.categories.name}
            </span>
          )}
        </div>

        {!isLocked && (
          <div className="absolute bottom-6 left-6 text-white drop-shadow-md">
            <p className="text-sm font-bold tracking-tight">
              {formatRupiah(unit.price)}
            </p>
          </div>
        )}

        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/20 transition-opacity duration-300">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-xl">
            {isLocked ? (
              <Lock size={18} className="text-neutral-400" />
            ) : (
              <ArrowUpRight size={20} className="text-black" />
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-between items-start">
        <div className={isLocked ? "opacity-40" : ""}>
          <h3 className="text-lg uppercase tracking-tight text-neutral-900 mb-1 font-bold">
            {unit.title}
          </h3>
          <div className="flex items-center gap-2 text-neutral-400">
            <MapPin size={12} />
            <span className="text-[10px] uppercase tracking-widest">
              {unit.location}
            </span>
          </div>
        </div>
        {!isLocked && (
          <div className="pt-2 text-[10px] uppercase tracking-[0.2em] text-neutral-400 group-hover:text-black transition-colors">
            Detail
          </div>
        )}
      </div>
    </>
  );
};

export const Unit = () => {
  const [units, setUnits] = useState<UnitProperty[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUnits() {
      try {
        const { data, error } = await supabase
          .from("units")
          .select(
            `
            id, title, slug, location, price, status, image_url,
            categories ( name )
          `,
          )
          .is("deleted_at", null) // Hanya ambil yang belum dihapus (Soft Delete)
          .order("priority_order", { ascending: true });

        if (error) throw error;
        setUnits(data || []);
      } catch (error) {
        console.error("Error fetching units:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchUnits();
  }, []);

  if (loading)
    return (
      <div className="py-32 flex flex-col items-center justify-center bg-white">
        <div className="w-6 h-6 border-2 border-neutral-200 border-t-black rounded-full animate-spin mb-4"></div>
        <p className="text-[10px] uppercase tracking-[0.3em] text-neutral-400">
          Sinkronisasi Data...
        </p>
      </div>
    );

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <header className="mb-16">
          <span className="text-[10px] uppercase tracking-[0.5em] text-neutral-400 block mb-4">
            Katalog Properti
          </span>
          <h2 className="text-4xl md:text-5xl uppercase tracking-tighter text-neutral-900 font-bold leading-none">
            Pilihan Hunian <br />
            <span className="text-neutral-300">Yogyakarta</span>
          </h2>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
          {units.map((unit, index) => (
            <motion.article
              key={unit.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="relative group">
                {unit.status !== "Coming Soon" ? (
                  <Link href={`/unit/${unit.slug}`} className="block">
                    <UnitCardContent unit={unit} index={index} />
                  </Link>
                ) : (
                  <UnitCardContent unit={unit} index={index} />
                )}
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};
