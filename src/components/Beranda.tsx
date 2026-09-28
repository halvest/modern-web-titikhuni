"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowRight, ArrowUpRight } from "lucide-react";

const slides = [
  {
    src: "/assets/images/konsep_titikhuni.webp",
    alt: "Material bertekstur dan tanaman dalam rancangan Titik Huni",
    position: "object-center",
  },
  {
    src: "/assets/images/kamar-titikhuni.webp",
    alt: "Kamar tidur dengan bukaan menuju taman dalam",
    position: "object-center",
  },
  {
    src: "/assets/images/ruang-tamu-titikhuni.jpg",
    alt: "Ruang keluarga dan ruang makan Titik Huni",
    position: "object-center",
  },
  {
    src: "/assets/images/rumah-bangunjiwo-2.jpg",
    alt: "Fasad rumah modern Titik Huni Bangunjiwo",
    position: "object-center",
  },
  {
    src: "/assets/images/taman-titikhuni.jpg",
    alt: "Taman dalam dengan tanaman dan cahaya alami",
    position: "object-center",
  },
];

export function Beranda() {
  const [current, setCurrent] = useState(0);
  const [loadedSlides, setLoadedSlides] = useState<number[]>([0]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Muat slide berikutnya secara bertahap setelah initial paint agar LCP utama tidak terganggu
    const preloadTimer = window.setTimeout(() => {
      setLoadedSlides((loaded) => (loaded.includes(1) ? loaded : [...loaded, 1]));
    }, 2500);

    const timer = window.setInterval(() => {
      if (!document.hidden) {
        setCurrent((previous) => {
          const next = (previous + 1) % slides.length;
          const upcoming = (next + 1) % slides.length;

          setLoadedSlides((loaded) =>
            loaded.includes(upcoming) ? loaded : [...loaded, upcoming],
          );

          return next;
        });
      }
    }, 7000);

    return () => {
      window.clearTimeout(preloadTimer);
      window.clearInterval(timer);
    };
  }, []);

  return (
    <section
      id="beranda"
      aria-labelledby="home-title"
      className="relative isolate flex min-h-[100svh] overflow-hidden bg-foreground text-white"
    >
      {slides.map(
        (slide, index) =>
          loadedSlides.includes(index) && (
            <div
              key={slide.src}
              aria-hidden="true"
              className={`absolute inset-0 -z-30 transition-opacity duration-1000 ${
                current === index ? "opacity-100" : "opacity-0"
              }`}
            >
              <Image
                src={slide.src}
                alt=""
                fill
                priority={index === 0}
                loading={index === 0 ? "eager" : "lazy"}
                sizes="100vw"
                className={`object-cover ${slide.position} motion-safe:transition-transform motion-safe:[transition-duration:9000ms] ${
                  current === index
                    ? "motion-safe:scale-[1.035]"
                    : "scale-100"
                }`}
              />
            </div>
          ),
      )}

      {/* Simple Black Overlay for Cinematic Hero */}
      <div className="absolute inset-0 -z-20 bg-[linear-gradient(90deg,rgba(0,0,0,0.55)_0%,rgba(0,0,0,0.35)_45%,rgba(0,0,0,0.25)_100%)]" />

      <div className="site-container flex min-h-[100svh] flex-1 flex-col pb-6 pt-[var(--header-height)] sm:pb-7 lg:pb-8">
        <div className="grid flex-1 items-center gap-10 py-8 sm:py-10 lg:grid-cols-12 lg:py-12">
          <div className="max-w-4xl lg:col-span-9">
            <p className="site-eyebrow text-white/75 before:bg-white">
              Boutique developer · Yogyakarta
            </p>
            <h1
              id="home-title"
              className="mt-5 max-w-4xl text-balance text-[clamp(3rem,7vw,6.75rem)] font-medium leading-[0.97] tracking-[-0.055em] text-white sm:mt-6"
            >
              Ruang untuk hidup lebih tenang.
            </h1>
            <div className="mt-6 max-w-2xl sm:mt-7">
              <p className="max-w-xl text-pretty text-base leading-[1.75] text-white/75 sm:text-[1.0625rem] md:text-[1.125rem] md:leading-[1.75]">
                Hunian modern, perancangan arsitektur, dan layanan pembangunan
                rumah yang dikembangkan Titik Huni di Yogyakarta—menghadirkan
                ruang bernapas dengan cahaya alami dan material yang jujur.
              </p>
            </div>
            <div className="mt-7 sm:mt-8">
              <Link
                href="/unit"
                className="site-button-hero group"
              >
                Jelajahi hunian
                <ArrowRight
                  size={16}
                  className="transition-transform group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </Link>
            </div>
          </div>
        </div>

        <div className="flex justify-end pb-1">
          <div
            aria-hidden="true"
            className="inline-flex min-h-12 select-none items-center gap-3 text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-foreground/70 sm:text-[0.66rem]"
          >
            Scroll ke bawah
            <span className="flex size-10 items-center justify-center rounded-full border border-foreground/15 bg-white/80 shadow-sm backdrop-blur-sm sm:size-11">
              <ArrowDown
                size={16}
                className="text-foreground motion-safe:animate-bounce"
              />
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
