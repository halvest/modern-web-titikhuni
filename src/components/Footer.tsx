"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Instagram, Facebook, Twitter, ArrowUp } from "lucide-react";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-white border-t border-neutral-100 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6">
        {/* Top Section: Logo & Links */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-20">
          {/* Brand Identity */}
          <div className="md:col-span-5 space-y-6">
            <div className="flex items-center gap-3">
              <Image
                src="/assets/icons/dark-titik-huni.png"
                alt="Logo Titik Huni"
                width={50}
                height={50}
                className="object-contain"
              />
              <span className="font-archivo uppercase tracking-[0.3em] text-lg">
                Titik Huni
              </span>
            </div>
            <p className="text-neutral-400 font-light text-sm leading-relaxed max-w-xs">
              Membangun esensi hunian modern tropis dengan presisi arsitektural
              di jantung Yogyakarta.
            </p>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 space-y-6">
            <h4 className="font-archivo uppercase text-[10px] tracking-[0.4em] text-neutral-900 font-bold">
              Layanan
            </h4>
            <ul className="space-y-4">
              <li>
                <Link
                  href="#jasa-bangun"
                  className="text-sm text-neutral-500 hover:text-black transition-colors"
                >
                  Arsitek & Kontraktor
                </Link>
              </li>
              <li>
                <Link
                  href="#galeri"
                  className="text-sm text-neutral-500 hover:text-black transition-colors"
                >
                  Portofolio Proyek
                </Link>
              </li>
              <li>
                <Link
                  href="#lokasi"
                  className="text-sm text-neutral-500 hover:text-black transition-colors"
                >
                  Developer Properti
                </Link>
              </li>
            </ul>
          </div>

          {/* Office / Contact */}
          <div className="md:col-span-4 space-y-6">
            <h4 className="font-archivo uppercase text-[10px] tracking-[0.4em] text-neutral-900 font-bold">
              Kantor Pusat
            </h4>
            <p className="text-sm text-neutral-500 font-light leading-relaxed">
              Jl. Duwet, Kledokan, Caturtunggal,
              <br />
              Sleman, Daerah Istimewa Yogyakarta 55281
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="p-2 border border-neutral-100 rounded-full hover:bg-black hover:text-white transition-all"
              >
                <Instagram size={16} />
              </a>
              <a
                href="#"
                className="p-2 border border-neutral-100 rounded-full hover:bg-black hover:text-white transition-all"
              >
                <Facebook size={16} />
              </a>
              <a
                href="#"
                className="p-2 border border-neutral-100 rounded-full hover:bg-black hover:text-white transition-all"
              >
                <Twitter size={16} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Section: Copyright & Back to Top */}
        <div className="pt-8 border-t border-neutral-100 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <p className="text-[10px] font-archivo uppercase tracking-widest text-neutral-400">
              © {currentYear} Titik Huni Developer.{" "}
              <span className="hidden md:inline">|</span>{" "}
              <br className="md:hidden" /> Crafted with Precision in Jogja.
            </p>
          </div>

          <button
            onClick={scrollToTop}
            className="group flex items-center gap-3 text-[10px] font-archivo uppercase tracking-[0.3em] text-neutral-900 hover:opacity-50 transition-all"
          >
            Back to Top
            <div className="w-8 h-8 rounded-full border border-neutral-200 flex items-center justify-center group-hover:-translate-y-1 transition-transform">
              <ArrowUp size={14} />
            </div>
          </button>
        </div>
      </div>
    </footer>
  );
};
