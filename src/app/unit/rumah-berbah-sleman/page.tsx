// src/app/unit/rumah-berbah-sleman/page.tsx
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
import toast, { Toaster } from "react-hot-toast";

const DATA = {
  name: "Titik Huni Pesona Pinka",
  location: "Berbah, Sleman, Yogyakarta",
  description:
    "Menghadirkan harmoni antara material jujur dan alam Bantul yang asri. Hunian modern tropis di Yogyakarta ini dirancang untuk ketenangan hidup maksimal dengan sirkulasi udara optimal dan pencahayaan alami.",

  gallery: [
    { src: "/assets/images/berbah/1.webp", label: "Fasad Utama" },
    { src: "/assets/images/berbah/2.webp", label: "Ruang Tamu" },
    { src: "/assets/images/berbah/3.webp", label: "Kamar Tidur" },
    { src: "/assets/images/berbah/4.webp", label: "Taman" },
    { src: "/assets/images/berbah/5.webp", label: "Dapur" },
    { src: "/assets/images/berbah/6.webp", label: "Kamar Mandi" },
    { src: "/assets/images/berbah/7.webp", label: "Ruang Keluarga" },
  ],

  specs: {
    land: "105m²",
    building: "65m²",
    beds: 2,
    baths: 1,
  },

  price: "550 Jutaan",
  priceRaw: 550000000,

  waLink:
    "https://wa.me/6289509888404?text=Halo Titik Huni, saya tertarik dengan Bangunjiwo",
};

export default function PesonaPinkaPage() {
  const [currentImg, setCurrentImg] = useState(0);

  const nextImg = () =>
    setCurrentImg((p) => (p === DATA.gallery.length - 1 ? 0 : p + 1));

  const prevImg = () =>
    setCurrentImg((p) => (p === 0 ? DATA.gallery.length - 1 : p - 1));

  const handleShare = async () => {
    const shareData = {
      title: DATA.name,
      text: DATA.description,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareData.url);
        toast.success("Link berhasil disalin");
      }
    } catch (err) {}
  };

  const image = DATA.gallery[currentImg];

  return (
    <main className="bg-white lg:h-screen lg:overflow-hidden">
      <Toaster position="bottom-center" />

      {/* SEO Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: DATA.name,
            description: DATA.description,
            image: DATA.gallery.map((img) => img.src),
            offers: {
              "@type": "Offer",
              priceCurrency: "IDR",
              price: DATA.priceRaw,
            },
          }),
        }}
      />

      {/* Floating Navigation */}
      <nav className="fixed top-6 left-6 right-6 z-40 flex justify-between">
        <Link
          href="/unit"
          className="flex items-center gap-2 bg-white/90 backdrop-blur-xl px-4 py-2 rounded-full border shadow"
        >
          <ArrowLeft size={16} />
          <span className="text-xs uppercase tracking-widest font-bold">
            Unit
          </span>
        </Link>

        <button
          onClick={handleShare}
          className="bg-white/90 backdrop-blur-xl p-3 rounded-full border shadow"
        >
          <Share2 size={18} />
        </button>
      </nav>

      <div className="flex flex-col lg:flex-row h-full">
        {/* Gallery */}
        <section className="w-full lg:w-3/5 relative h-[45vh] lg:h-full overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={image.src}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="relative w-full h-full"
            >
              <Image
                src={image.src}
                alt={image.label}
                fill
                priority
                className="object-cover"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </motion.div>
          </AnimatePresence>

          {/* Image Caption */}
          <div className="absolute bottom-6 left-6 text-white">
            <p className="text-xs uppercase tracking-[0.3em]">{image.label}</p>
            <p className="text-[10px] opacity-70 mt-1">
              {currentImg + 1}/{DATA.gallery.length}
            </p>
          </div>

          {/* Slider */}
          <div className="absolute bottom-6 right-6 flex gap-2">
            <button
              onClick={prevImg}
              className="p-3 bg-white/10 backdrop-blur border text-white hover:bg-white hover:text-black transition"
            >
              <ChevronLeft size={18} />
            </button>

            <button
              onClick={nextImg}
              className="p-3 bg-white/10 backdrop-blur border text-white hover:bg-white hover:text-black transition"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </section>

        {/* Content */}
        <section className="w-full lg:w-2/5 px-6 py-10 md:px-12 lg:px-16 overflow-y-auto flex flex-col">
          <div className="flex-grow">
            {/* Breadcrumb */}
            <nav className="text-xs uppercase tracking-[0.25em] text-neutral-400 mb-6">
              <Link href="/">Beranda</Link>
              <span className="mx-2">/</span>
              <Link href="/unit">Unit</Link>
              <span className="mx-2">/</span>
              Pesona Pinka
            </nav>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-none">
              Titik Huni <br />
              <span className="text-neutral-300">Pesona Pinka</span>
            </h1>

            {/* Location */}
            <div className="flex items-center gap-2 mt-4 text-neutral-500">
              <MapPin size={14} />
              <span className="text-xs uppercase tracking-widest">
                {DATA.location}
              </span>
            </div>

            {/* Description */}
            <p className="mt-6 text-neutral-500 text-sm leading-relaxed">
              {DATA.description}
            </p>

            {/* Specs */}
            <div className="grid grid-cols-2 gap-6 mt-8 border-y py-6">
              <Spec
                icon={<LandPlot size={18} />}
                label="Land"
                value={DATA.specs.land}
              />
              <Spec
                icon={<Maximize size={18} />}
                label="Building"
                value={DATA.specs.building}
              />
              <Spec
                icon={<Bed size={18} />}
                label="Bedroom"
                value={DATA.specs.beds}
              />
              <Spec
                icon={<Bath size={18} />}
                label="Bathroom"
                value={DATA.specs.baths}
              />
            </div>
          </div>

          {/* Price */}
          <div className="mt-8 space-y-4">
            <div className="bg-neutral-50 border rounded-xl p-5 flex justify-between">
              <div>
                <p className="text-xs uppercase tracking-widest text-neutral-400">
                  Starting Price
                </p>

                <p className="text-2xl font-bold">{DATA.price}</p>
              </div>

              <span className="text-xs bg-black text-white px-3 py-1 rounded-full h-fit">
                Available
              </span>
            </div>

            {/* CTA */}
            <Link
              href={DATA.waLink}
              target="_blank"
              className="flex items-center justify-between bg-black text-white px-6 py-4 rounded-xl hover:bg-neutral-800 transition"
            >
              <div>
                <p className="text-xs uppercase tracking-widest text-neutral-400">
                  Konsultasi
                </p>
                <p className="font-bold">Ambil Penawaran</p>
              </div>

              <MessageSquare size={20} />
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}

function Spec({ icon, label, value }: any) {
  return (
    <div>
      <p className="text-xs uppercase tracking-widest text-neutral-400">
        {label}
      </p>

      <div className="flex items-center gap-2 mt-1">
        {icon}
        <span className="text-sm font-medium">{value}</span>
      </div>
    </div>
  );
}
