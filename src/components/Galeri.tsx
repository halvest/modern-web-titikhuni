"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Maximize2, MapPin, ArrowRight } from "lucide-react";
import Link from "next/link";

const portfolio = [
  {
    id: 1,
    title: "Rumah Bangunjiwo",
    location: "Bantul, Yogyakarta",
    category: "Residential",
    src: "/assets/images/rumah-bangunjiwo.jpg",
    width: "col-span-12 md:col-span-7",
  },
  {
    id: 2,
    title: "Kamar Titik Huni",
    location: "Sleman, Yogyakarta",
    category: "Interior",
    src: "/assets/images/kamar-titikhuni.jpg",
    width: "col-span-12 md:col-span-5",
  },
  {
    id: 3,
    title: "Ruang Tamu Minimalis",
    location: "Kasihan, Bantul",
    category: "Interior",
    src: "/assets/images/ruang-tamu-titikhuni.jpg",
    width: "col-span-12 md:col-span-5",
  },
  {
    id: 4,
    title: "Fasad Modern",
    location: "Seturan, Yogyakarta",
    category: "Architecture",
    src: "/assets/images/rumah-bangunjiwo.jpg",
    width: "col-span-12 md:col-span-7",
  },
];

export function Galeri() {
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  return (
    <section id="galeri" className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <span className="text-[10px] font-archivo uppercase tracking-[0.5em] text-neutral-400 block mb-4">
              Our Portfolio
            </span>
            <h2 className="text-4xl md:text-6xl font-archivo uppercase leading-none tracking-tighter text-neutral-900">
              Karya yang <br />
              <span className="text-neutral-300">Berbicara.</span>
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="hidden md:block"
          >
            <Link
              href="/kluster"
              className="group flex items-center gap-4 text-xs font-archivo uppercase tracking-[0.2em] text-neutral-900"
            >
              Lihat Semua Proyek
              <div className="w-10 h-10 rounded-full border border-neutral-200 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all duration-500">
                <ArrowRight size={16} />
              </div>
            </Link>
          </motion.div>
        </div>

        {/* Bento Grid Gallery */}
        <div className="grid grid-cols-12 gap-4 md:gap-6">
          {portfolio.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.8,
                delay: index * 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
              className={`${item.width} group relative aspect-square md:aspect-video overflow-hidden bg-neutral-100 cursor-pointer`}
              onMouseEnter={() => setHoveredId(item.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              {/* Image Overlay - Sinematik */}
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all duration-700 z-10" />

              <Image
                src={item.src}
                alt={item.title}
                fill
                className="object-cover transition-transform duration-[2000ms] ease-out group-hover:scale-110"
              />

              {/* Info Layer */}
              <div className="absolute inset-0 z-20 p-8 flex flex-col justify-between">
                <div className="flex justify-between items-start opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <span className="bg-white/10 backdrop-blur-md border border-white/20 text-white text-[9px] uppercase tracking-widest px-3 py-1">
                    {item.category}
                  </span>
                  <div className="text-white">
                    <Maximize2 size={20} strokeWidth={1.5} />
                  </div>
                </div>

                <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <h3 className="text-white text-2xl md:text-3xl font-archivo uppercase tracking-tight mb-2">
                    {item.title}
                  </h3>
                  <div className="flex items-center gap-2 text-white/60">
                    <MapPin size={12} />
                    <span className="text-[10px] uppercase tracking-widest">
                      {item.location}
                    </span>
                  </div>
                </div>
              </div>

              {/* Hover Line Animation */}
              <div className="absolute bottom-0 left-0 h-1 bg-white z-30 w-0 group-hover:w-full transition-all duration-700 ease-in-out" />
            </motion.div>
          ))}
        </div>

        {/* Mobile View All Button */}
        <div className="mt-12 md:hidden">
          <Link
            href="/kluster"
            className="w-full flex items-center justify-between border-b border-neutral-200 py-4 text-xs font-archivo uppercase tracking-widest text-neutral-900"
          >
            View all projects
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
