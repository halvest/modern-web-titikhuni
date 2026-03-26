"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  MapPin,
  Maximize,
  Bed,
  Bath,
  ChevronRight,
  ChevronLeft,
  MessageSquare,
  LandPlot,
  Share2,
} from "lucide-react";
import { Toaster, toast } from "react-hot-toast";
import { supabase } from "@/lib/supabaseClient";
import { formatRupiah } from "@/lib/formatRupiah";

export default function UnitDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const [unit, setUnit] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentImg, setCurrentImg] = useState(0);

  useEffect(() => {
    async function fetchUnitDetail() {
      try {
        const { data, error } = await supabase
          .from("units")
          .select(
            `
            *,
            unit_images (image_url, is_primary)
          `,
          )
          .eq("slug", params.slug)
          .single();

        if (error) throw error;
        setUnit(data);
      } catch (err) {
        console.error("Error fetching unit:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchUnitDetail();
  }, [params.slug]);

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <div className="w-8 h-8 border-4 border-neutral-200 border-t-black rounded-full animate-spin" />
      </div>
    );

  if (!unit)
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-white">
        <p className="text-sm uppercase tracking-widest text-neutral-400 mb-4">
          Unit tidak ditemukan
        </p>
        <Link href="/unit" className="text-xs font-bold underline">
          KEMBALI KE KATALOG
        </Link>
      </div>
    );

  // Gabungkan primary image dan gallery
  const gallery =
    unit.unit_images?.length > 0
      ? unit.unit_images
      : [{ image_url: unit.image_url }];

  const nextImg = () =>
    setCurrentImg((p) => (p === gallery.length - 1 ? 0 : p + 1));
  const prevImg = () =>
    setCurrentImg((p) => (p === 0 ? gallery.length - 1 : p - 1));

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link berhasil disalin!");
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: `${unit.title} - Titik Huni`,
    description: unit.description,
    address: {
      "@type": "PostalAddress",
      addressLocality: unit.location,
      addressRegion: "Yogyakarta",
      addressCountry: "ID",
    },
    offers: {
      "@type": "Offer",
      price: unit.price,
      priceCurrency: "IDR",
    },
  };

  return (
    <main className="lg:h-screen lg:overflow-hidden bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Toaster position="bottom-center" />

      {/* Floating Nav */}
      <nav className="fixed top-6 left-6 right-6 z-50 flex justify-between items-center pointer-events-none">
        <Link
          href="/unit"
          className="pointer-events-auto flex items-center gap-2 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full border shadow-sm hover:bg-white transition-all"
        >
          <ArrowLeft size={16} />
          <span className="text-[10px] uppercase tracking-widest font-bold">
            Unit
          </span>
        </Link>
        <button
          onClick={handleShare}
          className="pointer-events-auto bg-white/90 backdrop-blur-md p-2.5 rounded-full border shadow-sm active:scale-90 transition-all"
        >
          <Share2 size={18} />
        </button>
      </nav>

      <div className="flex flex-col lg:flex-row h-full">
        {/* LEFT: GALLERY */}
        <section className="w-full lg:w-[55%] bg-neutral-100 relative h-[50vh] lg:h-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentImg}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="relative w-full h-full"
            >
              <Image
                src={gallery[currentImg].image_url}
                alt={unit.title}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-black/10" />
            </motion.div>
          </AnimatePresence>

          {gallery.length > 1 && (
            <div className="absolute bottom-8 right-8 flex gap-2">
              <button
                onClick={prevImg}
                className="p-3 bg-white/20 backdrop-blur-md text-white border border-white/30 hover:bg-white hover:text-black transition-all"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={nextImg}
                className="p-3 bg-white/20 backdrop-blur-md text-white border border-white/30 hover:bg-white hover:text-black transition-all"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </section>

        {/* RIGHT: CONTENT */}
        <section className="w-full lg:w-[45%] flex flex-col h-full bg-white">
          <div className="flex-1 overflow-y-auto px-6 py-10 md:px-12 lg:px-16">
            <header className="mb-8">
              <p className="text-[10px] uppercase tracking-[0.3em] text-neutral-400 mb-4">
                Properti Yogyakarta
              </p>
              <h1 className="text-4xl lg:text-5xl font-bold tracking-tighter leading-none mb-4 uppercase">
                {unit.title.split(" ").slice(0, -1).join(" ")} <br />
                <span className="text-neutral-300">
                  {unit.title.split(" ").slice(-1)}
                </span>
              </h1>
              <div className="flex items-center gap-2 text-neutral-500">
                <MapPin size={14} />
                <h2 className="text-[10px] uppercase tracking-widest font-medium">
                  {unit.location}
                </h2>
              </div>
            </header>

            <article>
              <p className="text-neutral-500 text-sm leading-relaxed mb-8">
                {unit.description ||
                  "Hunian modern tropis di Yogyakarta ini dirancang untuk ketenangan hidup maksimal dengan sirkulasi udara optimal dan pencahayaan alami."}
              </p>
            </article>

            <div className="grid grid-cols-2 gap-6 border-t border-neutral-100 pt-8 mb-10">
              <SpecItem
                icon={<LandPlot size={18} />}
                label="Luas Tanah"
                value={`${unit.land_area}m²`}
              />
              <SpecItem
                icon={<Maximize size={18} />}
                label="Luas Bangunan"
                value={`${unit.building_area}m²`}
              />
              <SpecItem
                icon={<Bed size={18} />}
                label="Kamar Tidur"
                value={unit.bedroom_count}
              />
              <SpecItem
                icon={<Bath size={18} />}
                label="Kamar Mandi"
                value={unit.bathroom_count}
              />
            </div>
          </div>

          {/* FIXED BOTTOM CTA */}
          <div className="border-t border-neutral-100 p-6 md:px-12 lg:px-16 bg-neutral-50/50 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-[9px] uppercase tracking-widest text-neutral-400 font-bold mb-1">
                  Harga Mulai dari
                </p>
                <p className="text-2xl font-black text-black leading-none">
                  {formatRupiah(unit.price)}
                </p>
              </div>
              <div className="flex items-center gap-2 bg-green-50 px-3 py-1.5 rounded-full">
                <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[9px] uppercase tracking-widest font-bold text-green-700">
                  {unit.status}
                </span>
              </div>
            </div>

            <a
              href={`https://wa.me/6285190800168?text=Halo Titik Huni, saya tertarik dengan unit ${unit.title}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between bg-black text-white px-6 py-5 rounded-xl hover:bg-neutral-800 transition-all active:scale-[0.98]"
            >
              <div className="text-left">
                <p className="text-[9px] uppercase tracking-[0.2em] text-white/50 mb-0.5 font-bold">
                  Konsultasi dan Jadwal Survey
                </p>
                <p className="font-bold tracking-tight">Hubungi Sekarang!</p>
              </div>
              <MessageSquare size={22} fill="white" />
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}

function SpecItem({ icon, label, value }: any) {
  return (
    <div className="flex items-start gap-3">
      <div className="p-2 bg-neutral-50 rounded-lg text-neutral-400">
        {icon}
      </div>
      <div>
        <p className="text-[9px] uppercase tracking-widest text-neutral-400 font-bold leading-none mb-1">
          {label}
        </p>
        <p className="text-sm font-bold text-neutral-800">{value}</p>
      </div>
    </div>
  );
}
