"use client";

import React, { useState, useMemo, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight,
  ChevronLeft,
  Share2,
  MapPin,
  Bed,
  Bath,
  Maximize,
  CheckCircle2,
  MessageSquare,
  LucideIcon, // Import tipe untuk Type Safety
} from "lucide-react";
import { toast } from "react-hot-toast";
import { formatRupiah } from "@/lib/formatRupiah";

// --- Types ---
type Unit = {
  title: string;
  location: string;
  image_url: string;
  gallery?: string[];
  land_area?: number;
  building_area?: number;
  bedroom_count?: number;
  bathroom_count?: number;
  description?: string;
  price: number;
};

interface SpecProps {
  icon: LucideIcon; // Menggunakan referensi komponen ikon
  label: string;
  value: string | number;
}

// --- Sub-Components ---

/**
 * Komponen spesifikasi properti yang reusable
 */
function Spec({ icon: Icon, label, value }: SpecProps) {
  return (
    <div className="flex items-center gap-3 group">
      <div className="p-2.5 bg-white rounded-xl shadow-sm group-hover:bg-emerald-50 transition-colors border border-neutral-100">
        <Icon size={20} className="text-neutral-700" />
      </div>
      <div>
        <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">
          {label}
        </p>
        <p className="text-sm font-bold text-neutral-800">{value}</p>
      </div>
    </div>
  );
}

/**
 * Tombol navigasi gallery
 */
function NavButton({ onClick, icon, ariaLabel }: { onClick: () => void; icon: React.ReactNode; ariaLabel: string }) {
  return (
    <button
      onClick={onClick}
      aria-label={ariaLabel}
      className="w-12 h-12 flex items-center justify-center rounded-full bg-black/20 hover:bg-black/40 backdrop-blur-md text-white transition-all shadow-lg active:scale-90"
    >
      {icon}
    </button>
  );
}

// --- Main Component ---

export default function UnitDetailClient({ unit }: { unit: Unit }) {
  const [currentImg, setCurrentImg] = useState(0);

  const gallery = useMemo(() => {
    const images = unit.gallery?.length ? unit.gallery : [unit.image_url];
    return images.filter(Boolean);
  }, [unit]);

  const hasMultiple = gallery.length > 1;

  const nextImg = useCallback(() => {
    if (!hasMultiple) return;
    setCurrentImg((p) => (p === gallery.length - 1 ? 0 : p + 1));
  }, [gallery.length, hasMultiple]);

  const prevImg = useCallback(() => {
    if (!hasMultiple) return;
    setCurrentImg((p) => (p === 0 ? gallery.length - 1 : p - 1));
  }, [gallery.length, hasMultiple]);

  const handleShare = async () => {
    try {
      const url = window.location.href;
      if (navigator.share) {
        await navigator.share({ title: unit.title, url });
      } else {
        await navigator.clipboard.writeText(url);
        toast.success("Link berhasil disalin ke clipboard");
      }
    } catch {
      toast.error("Gagal membagikan tautan");
    }
  };

  const waNumber = "6285190800168";
  const waMessage = encodeURIComponent(
    `Halo Titik Huni, saya tertarik dengan unit "${unit.title}" di ${unit.location}. Bisa minta info detailnya?`
  );

  return (
    <article className="bg-white min-h-screen text-neutral-900">
      <div className="flex flex-col lg:flex-row lg:h-screen lg:overflow-hidden">
        
        {/* SECTION: GALLERY (Responsive) */}
        <section className="relative w-full lg:w-[62%] h-[45vh] lg:h-full bg-neutral-100 overflow-hidden group">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentImg}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0"
            >
              <Image
                src={gallery[currentImg]}
                alt={`${unit.title} - ${unit.location}`}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 62vw"
                className="object-cover"
              />
            </motion.div>
          </AnimatePresence>

          {hasMultiple && (
            <>
              {/* Desktop Nav (Hanya muncul saat hover di desktop) */}
              <div className="hidden lg:group-hover:flex absolute inset-y-0 left-6 items-center z-20">
                <NavButton onClick={prevImg} icon={<ChevronLeft size={24} />} ariaLabel="Foto sebelumnya" />
              </div>
              <div className="hidden lg:group-hover:flex absolute inset-y-0 right-6 items-center z-20">
                <NavButton onClick={nextImg} icon={<ChevronRight size={24} />} ariaLabel="Foto selanjutnya" />
              </div>
              
              {/* Mobile Nav (Selalu terlihat di mobile) */}
              <div className="flex lg:hidden absolute inset-x-0 top-1/2 -translate-y-1/2 justify-between px-4 z-20 pointer-events-none">
                <div className="pointer-events-auto">
                   <NavButton onClick={prevImg} icon={<ChevronLeft size={24} />} ariaLabel="Foto sebelumnya" />
                </div>
                <div className="pointer-events-auto">
                   <NavButton onClick={nextImg} icon={<ChevronRight size={24} />} ariaLabel="Foto selanjutnya" />
                </div>
              </div>

              {/* Pagination Indicators */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 lg:left-8 lg:translate-x-0 z-20 flex gap-2">
                {gallery.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentImg(i)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      i === currentImg ? "w-8 bg-white" : "w-2 bg-white/40 hover:bg-white/60"
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </section>

        {/* SECTION: CONTENT DETAILS */}
        <section className="flex-1 flex flex-col bg-white overflow-y-auto overflow-x-hidden">
          <div className="p-6 lg:p-12 space-y-8 flex-1">
            <header>
              <nav className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase tracking-widest mb-4">
                <CheckCircle2 size={12} /> Unit Tersedia
              </nav>
              <h1 className="text-3xl lg:text-4xl font-serif leading-tight mb-4">
                {unit.title}
              </h1>
              <div className="flex items-center gap-2 text-neutral-500 hover:text-red-500 transition-colors w-fit group">
                <MapPin size={18} className="group-hover:animate-bounce" />
                <span className="font-medium">{unit.location}</span>
              </div>
            </header>

            {/* Spek Properti */}
            <div className="grid grid-cols-2 gap-4 lg:gap-6 p-5 lg:p-6 bg-neutral-50 rounded-2xl border border-neutral-100 shadow-sm">
              <Spec icon={Maximize} label="L. Tanah" value={`${unit.land_area ?? "-"} m²`} />
              <Spec icon={Maximize} label="L. Bangunan" value={`${unit.building_area ?? "-"} m²`} />
              <Spec icon={Bed} label="Kamar Tidur" value={`${unit.bedroom_count ?? "-"} Ruang`} />
              <Spec icon={Bath} label="Kamar Mandi" value={`${unit.bathroom_count ?? "-"} Ruang`} />
            </div>

            <section className="prose prose-neutral max-w-none">
              <h2 className="text-xl font-bold text-neutral-900 mb-4 font-sans uppercase tracking-tight">
                Deskripsi Lengkap
              </h2>
              <div className="text-neutral-600 leading-relaxed whitespace-pre-line border-l-4 border-emerald-100 pl-4 italic">
                {unit.description}
              </div>
            </section>
          </div>

          {/* Sticky CTA Footer */}
          <footer className="sticky bottom-0 lg:static p-6 lg:p-10 border-t bg-white/95 lg:bg-neutral-50 backdrop-blur-md z-30">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
              <div className="w-full sm:w-auto">
                <span className="block text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em] mb-1">
                  Harga Mulai
                </span>
                <p className="text-3xl font-bold text-neutral-900 tracking-tight">
                  {formatRupiah(unit.price)}
                </p>
              </div>
              
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  onClick={handleShare}
                  className="p-4 hover:bg-white rounded-xl transition shadow-sm border border-neutral-200 bg-neutral-50 flex items-center justify-center active:scale-95"
                  title="Bagikan properti"
                >
                  <Share2 size={20} />
                </button>
                <a
                  href={`https://wa.me/${waNumber}?text=${waMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 sm:flex-none flex items-center justify-center gap-3 bg-neutral-900 text-white px-8 py-4 rounded-xl font-bold hover:bg-emerald-600 transition-all transform active:scale-[0.98] shadow-lg"
                >
                  <MessageSquare size={20} />
                  Whatsapp
                </a>
              </div>
            </div>
          </footer>
        </section>
      </div>
    </article>
  );
}