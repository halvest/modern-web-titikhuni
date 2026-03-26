"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, MapPin, Lock } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { formatRupiah } from "@/lib/formatRupiah";

// Komponen Card Internal untuk tampilan Grid
const UnitCardContent = ({
  unit,
  index,
  isLocked = false,
}: {
  unit: any;
  index: number;
  isLocked?: boolean;
}) => {
  return (
    <>
      <div
        className={`relative aspect-[16/10] overflow-hidden bg-neutral-100 ${
          isLocked ? "grayscale" : ""
        }`}
      >
        <Image
          src={unit.image_url}
          alt={`Rumah Minimalis ${unit.title} ${unit.location} Yogyakarta`}
          fill
          priority={index < 2}
          sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 33vw"
          className={`object-cover transition-transform duration-700 ${
            isLocked ? "blur-[2px] opacity-60" : "group-hover:scale-105"
          }`}
        />

        <div className="absolute top-6 left-6">
          <span className="backdrop-blur-md px-4 py-1.5 text-[9px] uppercase tracking-[0.2em] font-bold bg-white/90 text-black">
            {unit.status}
          </span>
        </div>

        {!isLocked && (
          <div className="absolute bottom-6 left-6 text-white drop-shadow-md">
            <p className="text-xs uppercase tracking-widest font-medium">
              {formatRupiah(unit.price)}
            </p>
          </div>
        )}

        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/20 transition-opacity duration-300">
          <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-xl">
            {isLocked ? (
              <Lock size={20} className="text-neutral-400" />
            ) : (
              <ArrowUpRight size={24} className="text-black" />
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-between items-start">
        <div className={isLocked ? "opacity-40" : ""}>
          <h3 className="text-xl uppercase tracking-tight text-neutral-900 mb-1 font-bold">
            {unit.title}
          </h3>

          <div className="flex items-center gap-2 text-neutral-400">
            <MapPin size={12} aria-hidden="true" />
            <span className="text-[10px] uppercase tracking-widest">
              {unit.location}
            </span>
          </div>
        </div>

        {!isLocked && (
          <div className="pt-2 text-[10px] uppercase tracking-[0.2em] text-neutral-300 group-hover:text-neutral-900 transition-colors">
            Detail
          </div>
        )}
      </div>
    </>
  );
};

export const Unit = () => {
  const [units, setUnits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUnits() {
      try {
        const { data, error } = await supabase
          .from("units")
          .select("*")
          .order("priority_order", { ascending: true });

        if (error) throw error;
        if (data) setUnits(data);
      } catch (error) {
        console.error("Error fetching units:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchUnits();
  }, []);

  if (loading) {
    return (
      <div className="py-32 flex flex-col items-center justify-center bg-white">
        <div className="w-8 h-8 border-4 border-neutral-200 border-t-black rounded-full animate-spin mb-4"></div>
        <p className="text-xs uppercase tracking-widest text-neutral-400">
          Memuat Unit Terkini...
        </p>
      </div>
    );
  }

  return (
    <section id="unit-perumahan-jogja" className="py-24 md:py-32 bg-white">
      {/* SEO Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: "Perumahan Titik Huni Yogyakarta",
            itemListElement: units.map((unit, index) => ({
              "@type": "ListItem",
              position: index + 1,
              name: unit.title,
              url: `https://titikhuni.com/unit/${unit.slug}`,
            })),
          }),
        }}
      />

      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-xl"
          >
            <span className="text-[10px] uppercase tracking-[0.5em] text-neutral-400 block mb-4">
              Perumahan Yogyakarta
            </span>
            <h2 className="text-4xl md:text-5xl uppercase leading-none tracking-tighter text-neutral-900">
              Rumah Minimalis Jogja <br />
              <span className="text-neutral-300">Titik Huni</span>
            </h2>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-neutral-500 max-w-xs text-sm md:text-base leading-relaxed"
          >
            Pilihan rumah modern di Yogyakarta dengan desain minimalis tropis,
            lokasi strategis, dan potensi investasi properti yang tinggi.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {units.map((unit, index) => {
            const isLocked = unit.status === "Coming Soon";

            return (
              <motion.article
                key={unit.id}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.1,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <div
                  className={`relative group ${isLocked ? "cursor-default" : ""}`}
                >
                  {!isLocked ? (
                    <Link href={`/unit/${unit.slug}`} className="block">
                      <UnitCardContent unit={unit} index={index} />
                    </Link>
                  ) : (
                    <UnitCardContent unit={unit} index={index} isLocked />
                  )}
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
};
