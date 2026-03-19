// src/app/unit/rumah-tirtomartani-kalasan/page.tsx
"use client";

import { useState } from "react";
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
import { Toaster } from "react-hot-toast";

// Data SEO & Konten
const DATA = {
  name: "Titik Huni Tirtomartani",
  slug: "rumah-tirtomartani-kalasan",
  location: "Kalasan, Sleman, Yogyakarta",
  description:
    "Menghadirkan harmoni antara material jujur dan alam Kalasan yang asri. Hunian modern tropis di Yogyakarta ini dirancang untuk ketenangan hidup maksimal dengan sirkulasi udara optimal dan pencahayaan alami.",
  gallery: [
    {
      src: "/assets/images/tirtomartani/1.jpg",
      label: "Desain Rumah Titik Huni Tirtomartani",
    },
    {
      src: "/assets/images/tirtomartani/2.jpg",
      label: "Foto Rumah Titik Huni Tirtomartani dari Samping",
    },
    {
      src: "/assets/images/tirtomartani/3.jpg",
      label: "Dinding Tekstur Dinding Kamprot Taman",
    },
    {
      src: "/assets/images/tirtomartani/4.jpg",
      label: "Area Rumah dengan Pencahayaan Alami Optimal",
    },
    {
      src: "/assets/images/tirtomartani/5.jpg",
      label: "Batu Split dan Rumput Gajah Mini di Taman",
    },
    {
      src: "/assets/images/tirtomartani/6.jpg",
      label: "Kamar Tidur dengan Pencahayaan Terang",
    },
    {
      src: "/assets/images/tirtomartani/7.jpg",
      label: "Rumah dengan Desain Tropis Modern di Kalasan",
    },
  ],
  specs: { land: "105m²", building: "50m²", beds: 2, baths: 1 },
  price: "675 Juta",
  priceNumeric: 675000000,
  waLink: "https://wa.me/6285190800168",
};

export default function TirtomartaniPage() {
  const [currentImg, setCurrentImg] = useState(0);

  const nextImg = () =>
    setCurrentImg((p) => (p === DATA.gallery.length - 1 ? 0 : p + 1));
  const prevImg = () =>
    setCurrentImg((p) => (p === 0 ? DATA.gallery.length - 1 : p - 1));

  // Structured Data untuk Google (Schema.org)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: `${DATA.name} - Rumah Dijual di Kalasan Sleman`,
    description: DATA.description,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Kalasan",
      addressRegion: "Sleman, Yogyakarta",
      addressCountry: "ID",
    },
    offers: {
      "@type": "Offer",
      price: DATA.priceNumeric,
      priceCurrency: "IDR",
      availability: "https://schema.org/InStock",
    },
  };

  return (
    <main className="lg:h-screen lg:overflow-hidden bg-white">
      {/* SEO Script */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Toaster position="bottom-center" />

      {/* Floating Nav */}
      <nav className="fixed top-6 left-6 right-6 z-50 flex justify-between items-center pointer-events-none">
        <Link
          href="/unit"
          aria-label="Kembali ke daftar unit"
          className="pointer-events-auto flex items-center gap-2 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full border shadow-sm hover:bg-white transition-all"
        >
          <ArrowLeft size={16} />
          <span className="text-[10px] uppercase tracking-widest font-bold">
            Unit
          </span>
        </Link>
        <button
          aria-label="Bagikan properti ini"
          className="pointer-events-auto bg-white/90 backdrop-blur-md p-2.5 rounded-full border shadow-sm"
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
                src={DATA.gallery[currentImg].src}
                alt={`${DATA.gallery[currentImg].label} - ${DATA.name}`}
                fill
                className="object-cover"
                priority={currentImg === 0}
                sizes="(max-width: 1024px) 100vw, 55vw"
              />
              <div className="absolute inset-0 bg-black/10" />
            </motion.div>
          </AnimatePresence>

          {/* Slider Controls */}
          <div className="absolute bottom-8 right-8 flex gap-2">
            <button
              onClick={prevImg}
              aria-label="Foto sebelumnya"
              className="p-3 bg-white/20 backdrop-blur-md text-white border border-white/30 hover:bg-white hover:text-black transition-all"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={nextImg}
              aria-label="Foto selanjutnya"
              className="p-3 bg-white/20 backdrop-blur-md text-white border border-white/30 hover:bg-white hover:text-black transition-all"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </section>

        {/* RIGHT: CONTENT */}
        <section className="w-full lg:w-[45%] flex flex-col h-full bg-white">
          <div className="flex-1 overflow-y-auto lg:overflow-hidden px-6 py-10 md:px-12 lg:px-16">
            <header className="mb-8">
              <p className="text-[10px] uppercase tracking-[0.3em] text-neutral-400 mb-4">
                Rumah Bantul Yogyakarta
              </p>
              <h1 className="text-4xl lg:text-5xl font-bold tracking-tighter leading-none mb-4">
                Titik Huni <br />{" "}
                <span className="text-neutral-300">Tirtomartani</span>
              </h1>
              <div className="flex items-center gap-2 text-neutral-500">
                <MapPin size={14} />
                <h2 className="text-[10px] uppercase tracking-widest font-medium">
                  {DATA.location}
                </h2>
              </div>
            </header>

            <article>
              <p className="text-neutral-500 text-sm leading-relaxed mb-8">
                {DATA.description}
              </p>
            </article>

            <div className="grid grid-cols-2 gap-6 border-t border-neutral-100 pt-8 mb-10">
              <SpecItem
                icon={<LandPlot size={18} />}
                label="Luas Tanah"
                value={DATA.specs.land}
              />
              <SpecItem
                icon={<Maximize size={18} />}
                label="Luas Bangunan"
                value={DATA.specs.building}
              />
              <SpecItem
                icon={<Bed size={18} />}
                label="Kamar Tidur"
                value={DATA.specs.beds}
              />
              <SpecItem
                icon={<Bath size={18} />}
                label="Kamar Mandi"
                value={DATA.specs.baths}
              />
            </div>
          </div>

          {/* FIXED BOTTOM CTA AREA */}
          <div className="border-t border-neutral-100 p-6 md:px-12 lg:px-16 bg-neutral-50/50 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-[9px] uppercase tracking-widest text-neutral-400 font-bold mb-1">
                  Harga Mulai dari
                </p>
                <p className="text-2xl font-black text-black leading-none">
                  IDR {DATA.price}
                </p>
              </div>
              <div className="flex items-center gap-2 bg-green-50 px-3 py-1.5 rounded-full">
                <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[9px] uppercase tracking-widest font-bold text-green-700">
                  Unit Tersedia
                </span>
              </div>
            </div>

            <Link
              href={DATA.waLink}
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
            </Link>
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
