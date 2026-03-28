"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { MapPin, ArrowUpRight } from "lucide-react";
import Link from "next/link";

const portfolio = [
  {
    id: 1,
    title: "Rumah Bangunjiwo",
    location: "Bantul, Yogyakarta",
    category: "Residential",
    slug: "kenapa-memilih-developer-yang-jujur-itu-penting",
    src: "/assets/images/rumah-bangunjiwo.jpg",
    width: "col-span-12 md:col-span-7",
  },
  {
    id: 2,
    title: "Kamar Titik Huni",
    location: "Sleman, Yogyakarta",
    category: "Interior",
    slug: "tips-memaksimalkan-pencahayaan-alami",
    src: "/assets/images/kamar-titikhuni.jpg",
    width: "col-span-12 md:col-span-5",
  },
  {
    id: 3,
    title: "Ruang Tamu Minimalis",
    location: "Kasihan, Bantul",
    category: "Interior",
    slug: "desain-ruang-tamu-sempit-jadi-lega",
    src: "/assets/images/ruang-tamu-titikhuni.jpg",
    width: "col-span-12 md:col-span-5",
  },
  {
    id: 4,
    title: "Fasad Modern Seturan",
    location: "Seturan, Yogyakarta",
    category: "Architecture",
    slug: "tren-fasad-rumah-minimalis-2026",
    src: "/assets/images/rumah-bangunjiwo.jpg",
    width: "col-span-12 md:col-span-7",
  },
];

export function Galeri() {
  return (
    <section
      id="galeri"
      className="py-24 md:py-40 bg-[#FCFCFB] overflow-hidden border-t border-stone-100"
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-2xl"
          >
            <span className="text-[10px] font-medium uppercase tracking-[0.4em] text-stone-400 block mb-6">
              Selected Projects
            </span>
            <h2 className="text-4xl md:text-5xl font-medium leading-[1.1] tracking-tighter text-stone-900">
              Karya yang <br />
              <span className="text-stone-300 italic">Bercerita.</span>
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="hidden md:block"
          >
            <Link
              href="/blog"
              className="group flex items-center gap-6 text-[10px] font-medium uppercase tracking-[0.3em] text-stone-500 hover:text-stone-900 transition-colors"
            >
              Lihat Semua Cerita
              <div className="w-12 h-12 rounded-full border border-stone-100 flex items-center justify-center group-hover:bg-stone-900 group-hover:text-white transition-all duration-700 ease-in-out">
                <ArrowUpRight size={18} strokeWidth={1} />
              </div>
            </Link>
          </motion.div>
        </div>

        {/* BENTO GRID GALLERY */}
        <div className="grid grid-cols-12 gap-5 md:gap-8">
          {portfolio.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 1.2,
                delay: index * 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
              className={`${item.width} relative group overflow-hidden bg-stone-50 rounded-sm shadow-xl shadow-stone-200/50`}
            >
              <Link
                href={`/blog/${item.slug}`}
                className="block w-full h-full relative aspect-square md:aspect-video"
              >
                {/* Minimalist Overlay */}
                <div className="absolute inset-0 bg-stone-900/10 group-hover:bg-stone-900/40 transition-all duration-1000 z-10" />

                <Image
                  src={item.src}
                  alt={`Proyek Titik Huni: ${item.title}`}
                  fill
                  className="object-cover transition-transform duration-[2.5s] ease-out group-hover:scale-105"
                />

                {/* Information Layer */}
                <div className="absolute inset-0 z-20 p-8 md:p-12 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <span className="backdrop-blur-md bg-white/10 border border-white/10 text-white text-[9px] font-medium uppercase tracking-[0.3em] px-4 py-2 rounded-sm opacity-0 group-hover:opacity-100 transition-all duration-700">
                      {item.category}
                    </span>
                    <div className="text-white opacity-0 group-hover:opacity-100 transition-all duration-700">
                      <ArrowUpRight size={24} strokeWidth={1} />
                    </div>
                  </div>

                  <div className="transform translate-y-4 group-hover:translate-y-0 transition-all duration-700">
                    <h3 className="text-white text-2xl md:text-3xl font-medium tracking-tight mb-3 leading-none">
                      {item.title}
                    </h3>
                    <div className="flex items-center gap-2 text-white/60">
                      <MapPin
                        size={12}
                        strokeWidth={1.5}
                        className="text-white/40"
                      />
                      <span className="text-[10px] font-medium uppercase tracking-[0.2em]">
                        {item.location}
                      </span>
                    </div>

                    {/* View Detail Indicator - Subtle Line */}
                    <div className="mt-8 pt-4 border-t border-white/5 opacity-0 group-hover:opacity-100 transition-all duration-1000">
                      <span className="text-[9px] font-medium text-white/70 uppercase tracking-[0.3em]">
                        Lihat Proses Pembangunan
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* MOBILE VIEW ALL */}
        <div className="mt-16 md:hidden">
          <Link
            href="/blog"
            className="w-full flex items-center justify-between border-b border-stone-100 py-6 text-[10px] font-medium uppercase tracking-[0.3em] text-stone-400"
          >
            Explore all projects
            <ArrowUpRight size={18} strokeWidth={1} />
          </Link>
        </div>
      </div>
    </section>
  );
}
