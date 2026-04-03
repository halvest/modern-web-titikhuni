"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Instagram,
  MessageCircle,
  ArrowRight,
  ArrowLeft,
  Quote,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

const PRINSIP = [
  "Desain yang sederhana dan jujur pada material",
  "Ruang yang menghadirkan hidup lebih tenang dan cukup",
  "Hunian yang terkurasi, bukan pembangunan massal",
];

export function TentangKami() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const WHATSAPP_URL =
    "https://wa.me/6285190800168?text=Halo%20Titik%20Huni,%20saya%20ingin%20konsultasi%20mengenai%20hunian.";

  const nextSlide = () =>
    setCurrentIndex((prev) => (prev + 1) % PRINSIP.length);
  const prevSlide = () =>
    setCurrentIndex((prev) => (prev - 1 + PRINSIP.length) % PRINSIP.length);

  return (
    <section
      id="about"
      className="py-16 md:py-32 bg-white overflow-hidden relative selection:bg-emerald-50 selection:text-emerald-900"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-stretch relative z-10">
          {/* 🖼️ SISI KIRI: Editorial Portrait & Branding Blocks */}
          <motion.aside
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="hidden lg:flex lg:col-span-5 flex-col gap-8 h-full"
          >
            <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden group shadow-2xl shadow-stone-200/50">
              <Image
                src="/assets/images/konsep_titikhuni.webp"
                alt="Filosofi Desain Titik Huni"
                fill
                priority
                className="object-cover transition-transform duration-[3s] group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-900/40 via-transparent to-transparent opacity-60" />
            </div>

            <div className="grid grid-cols-2 gap-6 w-full">
              {["TITIK", "HUNI"].map((text) => (
                <div
                  key={text}
                  className="aspect-square bg-stone-900 rounded-2xl flex items-center justify-center group cursor-default transition-all duration-500 hover:bg-emerald-600"
                >
                  <span className="text-white tracking-[0.8em] font-bold text-xs pl-[0.8em] transition-transform duration-500 group-hover:scale-110">
                    {text}
                  </span>
                </div>
              ))}
            </div>
          </motion.aside>

          {/* ✍️ SISI KANAN: Narrative Content & Principles */}
          <div className="lg:col-span-7 flex flex-col justify-between w-full h-full py-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="max-w-2xl mx-auto lg:mx-0"
            >
              <div className="flex flex-col gap-4 mb-12 text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start gap-3">
                  <div className="w-8 h-[1px] bg-emerald-500" />
                  <span className="text-emerald-600 text-[10px] font-bold uppercase tracking-[0.5em]">
                    Filosofi Kami
                  </span>
                </div>
                <h2 className="text-stone-900 text-4xl md:text-5xl font-medium tracking-tight leading-[1.1]">
                  Tentang Titik Huni
                </h2>
              </div>

              <div className="space-y-10 text-stone-500 font-light leading-relaxed text-lg md:text-xl">
                <p>
                  Titik Huni lahir dari keyakinan sederhana: rumah seharusnya
                  menjadi tempat untuk hidup dengan lebih{" "}
                  <span className="text-stone-900 font-medium italic border-b border-emerald-200">
                    tenang dan cukup.
                  </span>
                </p>
                <p>
                  Kami merancang hunian dengan pendekatan desain yang sederhana,
                  jujur pada material, serta memperhatikan pengalaman ruang yang
                  nyaman untuk kehidupan sehari-hari.
                </p>
                <p className="text-stone-400 text-base md:text-lg">
                  Titik Huni bukanlah developer yang membangun rumah secara
                  massal. Kami merancang hunian secara lebih terbatas dan
                  terkurasi.
                </p>

                <div className="pt-12 mt-12 border-t border-stone-100 relative group">
                  <Quote className="absolute -top-4 left-0 text-stone-100 w-16 h-16 -z-0" />
                  <p className="relative z-10 font-medium text-stone-800 text-2xl md:text-3xl italic leading-tight tracking-tight text-center lg:text-left">
                    "Karena pada akhirnya, rumah yang baik bukanlah rumah yang
                    terasa cukup dan tepat untuk pulang."
                  </p>
                </div>
              </div>
            </motion.div>

            {/* ✅ BOTTOM SECTION: Principles & Contact */}
            <div className="pt-12 mt-16 border-t border-stone-100 grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Prinsip Dasar (Interactive Slider) */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-stone-400 font-bold text-[9px] uppercase tracking-[0.4em]">
                    Prinsip Dasar
                  </h3>
                  <div className="flex gap-2">
                    <button
                      onClick={prevSlide}
                      className="p-2 border border-stone-100 rounded-full hover:bg-stone-900 hover:text-white transition-all shadow-sm"
                    >
                      <ArrowLeft size={14} />
                    </button>
                    <button
                      onClick={nextSlide}
                      className="p-2 border border-stone-100 rounded-full hover:bg-stone-900 hover:text-white transition-all shadow-sm"
                    >
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
                <div className="h-12 flex items-center">
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={currentIndex}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.5 }}
                      className="text-stone-900 font-medium text-sm md:text-base italic leading-snug"
                    >
                      — {PRINSIP[currentIndex]}
                    </motion.p>
                  </AnimatePresence>
                </div>
              </div>

              {/* Hubungi Kami (Direct Links) */}
              <div className="space-y-6 md:pl-12 md:border-l border-stone-100">
                <h3 className="text-stone-400 font-bold text-[9px] uppercase tracking-[0.4em]">
                  Hubungi Kami
                </h3>
                <div className="flex flex-wrap gap-x-10 gap-y-4">
                  <Link
                    href="https://instagram.com/titikhuni.id"
                    target="_blank"
                    className="group flex items-center gap-3"
                  >
                    <div className="p-2 rounded-full bg-stone-50 group-hover:bg-emerald-50 transition-colors">
                      <Instagram
                        size={18}
                        className="text-stone-400 group-hover:text-emerald-600"
                      />
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-widest text-stone-900 border-b border-transparent group-hover:border-stone-900 transition-all">
                      Instagram
                    </span>
                  </Link>
                  <Link
                    href={WHATSAPP_URL}
                    target="_blank"
                    className="group flex items-center gap-3"
                  >
                    <div className="p-2 rounded-full bg-stone-50 group-hover:bg-emerald-50 transition-colors">
                      <MessageCircle
                        size={18}
                        className="text-stone-400 group-hover:text-emerald-600"
                      />
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-widest text-stone-900 border-b border-transparent group-hover:border-stone-900 transition-all">
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
