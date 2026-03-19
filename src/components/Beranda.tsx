//src/components/Beranda.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const images = [
  {
    src: "/assets/images/konsep_titikhuni.webp",
    title: "Sederhana, Tapi Bermakna",
    subtitle:
      "Rumah dengan desain jujur yang menghadirkan ketenangan dalam setiap sudut.",
  },
  {
    src: "/assets/images/kamar-titikhuni.webp",
    title: "Ruang yang Cukup untuk Hidup",
    subtitle: "Setiap ruang dirancang fungsional, nyaman, dan terasa lapang.",
  },
  {
    src: "/assets/images/ruang-tamu-titikhuni.jpg",
    title: "Tempat Pulang yang Sesungguhnya",
    subtitle:
      "Bukan sekadar rumah, tapi tempat di mana cerita keluarga dimulai.",
  },
  {
    src: "/assets/images/fasad-titikhuni.svg",
    title: "Desain Hangat & Fungsional",
    subtitle:
      "Perpaduan estetika modern dan fungsi yang memudahkan kehidupan sehari-hari.",
  },
  {
    src: "/assets/images/ruang-titikhuni.svg",
    title: "Ruang untuk Bernapas",
    subtitle:
      "Cahaya alami, udara segar, dan ruang terbuka untuk hidup yang lebih sehat.",
  },
];

// Custom easing untuk kesan mewah (Quintic Out)
const transitionEase = [0.22, 1, 0.36, 1];

export const Beranda = () => {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);

  const next = useCallback(() => {
    setDirection(1);
    setCurrent((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  }, []);

  const prev = useCallback(() => {
    setDirection(-1);
    setCurrent((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  }, []);

  useEffect(() => {
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <section
      id="beranda"
      className="relative w-full h-screen overflow-hidden bg-neutral-900"
    >
      {/* Background Slider - Stacking Technique */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={current}
            custom={direction}
            initial={{
              opacity: 0,
              scale: 1.1,
              x: direction > 0 ? "2%" : "-2%",
            }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, filter: "blur(10px)" }}
            transition={{
              duration: 1.2,
              ease: transitionEase,
            }}
            className="absolute inset-0 w-full h-full"
          >
            <Image
              src={images[current].src}
              alt="Titik Huni"
              fill
              priority
              className="object-cover brightness-[0.7] contrast-[1.1]"
            />
          </motion.div>
        </AnimatePresence>
        <div className="absolute inset-0 bg-black/30 z-[1]" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: transitionEase }}
          className="flex flex-col items-center"
        >
          {/* Logo dengan Invert & Opacity halus */}
          <div className="relative w-[280px] h-[70px] md:w-[420px] md:h-[120px] mb-12">
            <Image
              src="/assets/icons/dark-titik-huni.png"
              alt="Logo Titik Huni"
              fill
              className="object-contain brightness-0 invert opacity-90"
              priority
            />
          </div>

          {/* Philosophy Text dengan Crossfade Terpisah */}
          <div className="h-20 flex flex-col items-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0, y: 10, filter: "blur(5px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -10, filter: "blur(5px)" }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="space-y-3"
              >
                <h2 className="text-white text-xl md:text-2xl font-light tracking-[0.6em] uppercase">
                  {images[current].title}
                </h2>
                <p className="text-white/50 text-sm md:text-lg italic font-light tracking-wide">
                  {images[current].subtitle}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Minimalist Scroll Line */}
        <div className="absolute bottom-12 flex flex-col items-center gap-4">
          <span className="text-white/20 text-[9px] uppercase tracking-[0.8em]">
            Scroll
          </span>
          <div className="w-[1px] h-16 bg-white/10 relative overflow-hidden">
            <motion.div
              animate={{ y: [-64, 64] }}
              transition={{
                repeat: Infinity,
                duration: 2.5,
                ease: "easeInOut",
              }}
              className="absolute w-full h-full bg-gradient-to-b from-transparent via-white/60 to-transparent"
            />
          </div>
        </div>
      </div>

      {/* Elegant Navigation UI */}
      <div className="absolute bottom-12 right-12 z-20 hidden md:flex items-center gap-10">
        <div className="flex gap-4 items-center">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setDirection(i > current ? 1 : -1);
                setCurrent(i);
              }}
              className="group py-4 px-1"
            >
              <div
                className={`h-[1px] transition-all duration-700 ease-in-out ${
                  current === i
                    ? "w-16 bg-white"
                    : "w-6 bg-white/20 group-hover:bg-white/50"
                }`}
              />
            </button>
          ))}
        </div>

        <div className="flex gap-3">
          <button
            onClick={prev}
            className="w-14 h-14 flex items-center justify-center border border-white/10 rounded-full text-white/40 transition-all hover:bg-white hover:text-black hover:border-white active:scale-90"
          >
            <ChevronLeft size={24} strokeWidth={1} />
          </button>
          <button
            onClick={next}
            className="w-14 h-14 flex items-center justify-center border border-white/10 rounded-full text-white/40 transition-all hover:bg-white hover:text-black hover:border-white active:scale-90"
          >
            <ChevronRight size={24} strokeWidth={1} />
          </button>
        </div>
      </div>
    </section>
  );
};
