// src/components/TentangKami.tsx
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Instagram, MessageCircle, ArrowRight, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export function TentangKami() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const WHATSAPP_URL =
    "https://wa.me/6289509888404?text=Halo%20Titik%20Huni,%20saya%20ingin%20konsultasi%20mengenai%20hunian.";

  const PRINSIP = [
    "Desain yang sederhana dan jujur pada material",
    "Ruang yang menghadirkan hidup lebih tenang dan cukup",
    "Hunian yang terkurasi, bukan pembangunan massal",
  ];

  const nextSlide = () =>
    setCurrentIndex((prev) => (prev + 1) % PRINSIP.length);
  const prevSlide = () =>
    setCurrentIndex((prev) => (prev - 1 + PRINSIP.length) % PRINSIP.length);

  return (
    <section
      id="about"
      className="py-24 md:py-40 bg-white overflow-hidden border-t border-stone-50 relative selection:bg-stone-200"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-stretch relative z-10">
          {/* 🖼️ SISI KIRI: Gambar Potret & Kotak Presisi */}
          <motion.aside
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
            className="hidden lg:flex lg:col-span-5 flex-col gap-8 h-full"
          >
            <div className="relative aspect-[3/4] w-full rounded-sm overflow-hidden bg-stone-100 shadow-2xl shadow-stone-100">
              <Image
                src="/assets/images/konsep_titikhuni.webp"
                alt="Filosofi Desain Titik Huni"
                fill
                priority
                className="object-cover scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
            </div>

            <div className="grid grid-cols-2 gap-4 md:gap-5 w-full">
              <div className="aspect-square bg-[#262626] flex items-center justify-center shadow-2xl group transition-all duration-700 hover:bg-black">
                <span className="text-white tracking-[0.8em] font-light text-[10px] md:text-xs pl-[0.8em] group-hover:scale-110 transition-transform">
                  TITIK
                </span>
              </div>
              <div className="aspect-square bg-[#262626] flex items-center justify-center shadow-2xl group transition-all duration-700 hover:bg-black">
                <span className="text-white tracking-[0.8em] font-light text-[10px] md:text-xs pl-[0.8em] group-hover:scale-110 transition-transform">
                  HUNI
                </span>
              </div>
            </div>
          </motion.aside>

          {/* ✍️ SISI KANAN: Narrative Content & Full Horizontal Footer */}
          <div className="lg:col-span-7 flex flex-col justify-between w-full h-full">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="max-w-2xl mx-auto lg:mx-0"
            >
              <div className="flex flex-col gap-4 mb-14 text-center lg:text-left">
                <p className="text-emerald-600 text-[10px] font-black uppercase tracking-[0.5em]">
                  Filosofi Kami
                </p>
                <h2 className="text-neutral-900 text-3xl md:text-5xl font-bold uppercase tracking-tight leading-none">
                  Tentang Titik Huni
                </h2>
              </div>

              <div className="space-y-10 text-stone-600 font-medium leading-[2.1] text-base md:text-[1.1rem]">
                <p>
                  Titik Huni lahir dari keyakinan sederhana: rumah seharusnya
                  menjadi tempat untuk hidup dengan lebih{" "}
                  <span className="font-black text-neutral-900 underline decoration-stone-200 underline-offset-8 px-1">
                    tenang dan cukup.
                  </span>
                </p>
                <p>
                  Kami merancang hunian dengan pendekatan desain yang sederhana,
                  jujur pada material, serta memperhatikan pengalaman ruang yang
                  nyaman untuk kehidupan sehari-hari.
                </p>
                <p className="text-stone-400 font-normal italic leading-relaxed">
                  Titik Huni bukanlah developer yang membangun rumah secara
                  massal. Kami merancang hunian secara lebih terbatas dan
                  terkurasi.
                </p>

                <div className="pt-10 mt-12 border-t border-stone-50">
                  <p className="font-bold text-stone-900 text-xl md:text-2xl italic leading-relaxed tracking-tight text-center lg:text-left">
                    "Karena pada akhirnya, rumah yang baik bukanlah rumah yang
                    terasa cukup dan tepat untuk pulang."
                  </p>
                </div>
              </div>
            </motion.div>

            {/* ✅ FULL HORIZONTAL FOOTER SECTION */}
            <div className="pt-12 mt-16 border-t border-stone-100 flex flex-col md:flex-row items-stretch gap-10 md:gap-0">
              {/* SISI KIRI: Prinsip Dasar (Slider) */}
              <div className="flex-1 pr-0 md:pr-10 space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-stone-300 font-black text-[9px] uppercase tracking-[0.4em]">
                    Prinsip Dasar
                  </h3>
                  <div className="flex gap-2">
                    <button
                      onClick={prevSlide}
                      className="p-1.5 border border-stone-50 rounded-full hover:bg-black hover:text-white transition-all"
                    >
                      <ArrowLeft size={12} />
                    </button>
                    <button
                      onClick={nextSlide}
                      className="p-1.5 border border-stone-50 rounded-full hover:bg-black hover:text-white transition-all"
                    >
                      <ArrowRight size={12} />
                    </button>
                  </div>
                </div>
                <div className="h-10 flex items-center">
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={currentIndex}
                      initial={{ opacity: 0, x: 5 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -5 }}
                      className="text-stone-900 font-bold text-[11px] md:text-xs italic uppercase tracking-tighter leading-snug"
                    >
                      "{PRINSIP[currentIndex]}"
                    </motion.p>
                  </AnimatePresence>
                </div>
              </div>

              {/* VERTICAL DIVIDER (Only Desktop) */}
              <div className="hidden md:block w-[1px] bg-stone-100" />

              {/* SISI KANAN: Hubungi Kami (Social Icons) */}
              <div className="pl-0 md:pl-10 space-y-4 min-w-fit">
                <h3 className="text-stone-300 font-black text-[9px] uppercase tracking-[0.4em]">
                  Hubungi Kami
                </h3>
                <div className="flex items-center gap-10 h-10">
                  <Link
                    href="https://instagram.com/titikhuni"
                    target="_blank"
                    className="group flex items-center gap-3"
                  >
                    <Instagram
                      size={20}
                      strokeWidth={1.5}
                      className="text-stone-400 group-hover:text-black transition-colors"
                    />
                    <span className="text-[10px] font-black uppercase tracking-widest text-stone-900 border-b border-transparent group-hover:border-stone-900 transition-all">
                      Instagram
                    </span>
                  </Link>
                  <Link
                    href={WHATSAPP_URL}
                    target="_blank"
                    className="group flex items-center gap-3"
                  >
                    <MessageCircle
                      size={20}
                      strokeWidth={1.5}
                      className="text-stone-400 group-hover:text-black transition-colors"
                    />
                    <span className="text-[10px] font-black uppercase tracking-widest text-stone-900 border-b border-transparent group-hover:border-stone-900 transition-all">
                      WhatsApp
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
