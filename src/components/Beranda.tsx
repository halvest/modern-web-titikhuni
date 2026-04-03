"use client";

import { useState, useEffect, useCallback, useRef } from "react";
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

const transitionEase = [0.22, 1, 0.36, 1];

export const Beranda = () => {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const next = useCallback(() => {
    setDirection(1);
    setCurrent((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  }, []);

  const prev = useCallback(() => {
    setDirection(-1);
    setCurrent((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  }, []);

  // Reset timer setiap kali user berinteraksi manual
  const resetTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(next, 8000);
  }, [next]);

  useEffect(() => {
    resetTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [resetTimer]);

  // Touch Handlers untuk Mobile Swipe
  const handleTouchStart = (e: React.TouchEvent) =>
    setTouchStart(e.targetTouches[0].clientX);
  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const touchEnd = e.targetTouches[0].clientX;
    const distance = touchStart - touchEnd;

    if (distance > 70) {
      // Swipe Left
      next();
      setTouchStart(null);
    } else if (distance < -70) {
      // Swipe Right
      prev();
      setTouchStart(null);
    }
  };

  return (
    <section
      id="beranda"
      className="relative w-full h-[100svh] overflow-hidden bg-neutral-950 select-none"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
    >
      {/* Background Slider */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={current}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{
              duration: 2.2,
              ease: transitionEase,
            }}
            className="absolute inset-0 w-full h-full will-change-transform"
          >
            <Image
              src={images[current].src}
              alt={images[current].title}
              fill
              priority
              quality={90}
              className="object-cover brightness-[0.55] contrast-[1.05]"
              sizes="100vw"
            />
          </motion.div>
        </AnimatePresence>

        {/* Subtle Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 z-[1]" />
      </div>

      {/* Content Layer */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, delay: 0.2, ease: transitionEase }}
          className="flex flex-col items-center"
        >
          {/* Brand Identity */}
          <div className="relative w-[220px] h-[50px] md:w-[380px] md:h-[100px] mb-12">
            <Image
              src="/assets/icons/dark-titik-huni.png"
              alt="Logo Titik Huni"
              fill
              className="object-contain brightness-0 invert opacity-100"
              priority
            />
          </div>

          {/* Philosophy Text Area */}
          <div
            className="min-h-[140px] md:min-h-[160px] flex flex-col items-center"
            aria-live="polite"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0, filter: "blur(10px)", y: 15 }}
                animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                exit={{ opacity: 0, filter: "blur(10px)", y: -15 }}
                transition={{ duration: 0.8, ease: transitionEase }}
                className="space-y-6"
              >
                <h2 className="text-white text-base md:text-xl font-medium tracking-[0.6em] uppercase">
                  {images[current].title}
                </h2>
                <div className="w-8 h-[1px] bg-white/30 mx-auto" />
                <p className="text-white/70 text-sm md:text-lg font-light tracking-widest max-w-2xl leading-relaxed">
                  {images[current].subtitle}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Improved Scroll Indicator */}
        <div className="absolute bottom-12 flex flex-col items-center gap-4">
          <span className="text-white/20 text-[8px] uppercase tracking-[0.8em] font-medium">
            Lihat Selengkapnya
          </span>
          <div className="w-[1px] h-16 bg-white/5 relative overflow-hidden">
            <motion.div
              animate={{ y: [-64, 64] }}
              transition={{
                repeat: Infinity,
                duration: 2.5,
                ease: "easeInOut",
              }}
              className="absolute w-full h-full bg-gradient-to-b from-transparent via-emerald-400/40 to-transparent"
            />
          </div>
        </div>
      </div>

      {/* Navigation & Pagination */}
      <div className="absolute bottom-12 right-6 md:right-16 z-20 flex flex-col items-end gap-10">
        {/* Pagination Info */}
        <div className="flex items-center gap-6 group">
          <span className="text-white/40 text-[10px] font-mono tracking-tighter">
            0{current + 1} <span className="mx-2 text-white/10">/</span> 0
            {images.length}
          </span>
          <div className="flex gap-3">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setDirection(i > current ? 1 : -1);
                  setCurrent(i);
                  resetTimer();
                }}
                className="relative py-4 outline-none"
                aria-label={`Go to slide ${i + 1}`}
              >
                <div
                  className={`h-[2px] transition-all duration-1000 ease-out ${
                    current === i
                      ? "w-10 bg-emerald-500"
                      : "w-2 bg-white/20 hover:bg-white/40"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Circular Arrows */}
        <div className="flex gap-4">
          <button
            onClick={() => {
              prev();
              resetTimer();
            }}
            className="w-14 h-14 flex items-center justify-center border border-white/5 rounded-full text-white/40 backdrop-blur-sm transition-all hover:bg-white hover:text-black hover:border-white active:scale-95 group"
          >
            <ChevronLeft
              size={22}
              strokeWidth={1}
              className="group-hover:-translate-x-0.5 transition-transform"
            />
          </button>
          <button
            onClick={() => {
              next();
              resetTimer();
            }}
            className="w-14 h-14 flex items-center justify-center border border-white/5 rounded-full text-white/40 backdrop-blur-sm transition-all hover:bg-white hover:text-black hover:border-white active:scale-95 group"
          >
            <ChevronRight
              size={22}
              strokeWidth={1}
              className="group-hover:translate-x-0.5 transition-transform"
            />
          </button>
        </div>
      </div>

      {/* Background Preload (Hidden) */}
      <div className="hidden">
        {images.map((img, i) => (
          <link key={i} rel="preload" as="image" href={img.src} />
        ))}
      </div>
    </section>
  );
};
