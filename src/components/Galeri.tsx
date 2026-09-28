"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { MapPin, ArrowUpRight } from "lucide-react";
import Link from "next/link";

const PORTFOLIO_DATA = [
  {
    id: 1,
    title: "Rumah Bangunjiwo",
    location: "Bantul, Yogyakarta",
    category: "Residential",
    slug: "kenapa-memilih-developer-yang-jujur-itu-penting",
    src: "/assets/images/rumah-bangunjiwo.jpg",
    gridClass: "col-span-12 md:col-span-7",
  },
  {
    id: 2,
    title: "Kamar Titik Huni",
    location: "Sleman, Yogyakarta",
    category: "Interior",
    slug: "tips-memaksimalkan-pencahayaan-alami",
    src: "/assets/images/kamar-titikhuni.webp",
    gridClass: "col-span-12 md:col-span-5",
  },
  {
    id: 3,
    title: "Ruang Tamu Minimalis",
    location: "Kasihan, Bantul",
    category: "Interior",
    slug: "desain-ruang-tamu-sempit-jadi-lega",
    src: "/assets/images/ruang-tamu-titikhuni.jpg",
    gridClass: "col-span-12 md:col-span-5",
  },
  {
    id: 4,
    title: "Fasad Modern Seturan",
    location: "Seturan, Yogyakarta",
    category: "Architecture",
    slug: "tren-fasad-rumah-minimalis-2026",
    src: "/assets/images/rumah-bangunjiwo-2.jpg",
    gridClass: "col-span-12 md:col-span-7",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.3 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 1, ease: [0.22, 1, 0.36, 1] },
  },
};

export function Galeri() {
  return (
    <section id="galeri" className="py-24 md:py-40 bg-surface overflow-hidden border-t border-surface-muted">
      <div className="max-w-7xl mx-auto px-6">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-2xl"
          >
            <span className="text-[10px] font-semibold uppercase tracking-[0.5em] text-primary block mb-6">
              Selected Works
            </span>
            <h2 className="text-5xl font-medium leading-[1.03] tracking-[-0.045em] text-foreground md:text-7xl">
              Karya yang Bercerita.
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
              className="group flex items-center gap-8 text-[10px] font-bold uppercase tracking-[0.3em] text-foreground-soft hover:text-foreground transition-all duration-500"
            >
              Lihat Semua Cerita
              <div className="w-14 h-14 rounded-full border border-border flex items-center justify-center group-hover:bg-foreground group-hover:text-white group-hover:scale-110 transition-all duration-700">
                <ArrowUpRight size={20} strokeWidth={1} />
              </div>
            </Link>
          </motion.div>
        </div>

        {/* BENTO GRID */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-12 gap-6 md:gap-10"
        >
          {PORTFOLIO_DATA.map((item) => (
            <motion.div
              key={item.id}
              variants={itemVariants}
              className={`${item.gridClass} relative group overflow-hidden bg-surface-muted rounded-3xl`}
            >
              <Link
                href={`/blog/${item.slug}`}
                className="block w-full h-full relative aspect-[4/5] md:aspect-auto md:h-[500px]"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent opacity-60 group-hover:opacity-90 transition-all duration-1000 z-10" />

                <Image
                  src={item.src}
                  alt={`Titik Huni - ${item.title}`}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px"
                  className="object-cover transition-transform [transition-duration:3s] ease-out group-hover:scale-110"
                  priority={item.id === 1}
                />

                <div className="absolute inset-0 z-20 p-8 md:p-12 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <span className="bg-white/10 backdrop-blur-md border border-white/20 text-white text-[9px] font-bold uppercase tracking-[0.3em] px-5 py-2 rounded-full translate-y-[-10px] opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-700">
                      {item.category}
                    </span>
                  </div>

                  <div className="space-y-4">
                    <div className="overflow-hidden">
                      <h3 className="text-white text-3xl md:text-4xl font-medium tracking-[-0.03em] leading-[1.1] translate-y-[100%] group-hover:translate-y-0 transition-transform duration-700">
                        {item.title}
                      </h3>
                    </div>

                    <div className="flex items-center gap-3 text-white/70 translate-y-[20px] opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-700 delay-100">
                      <MapPin size={14} className="text-primary/60" />
                      <span className="text-[10px] font-bold uppercase tracking-[0.2em]">
                        {item.location}
                      </span>
                    </div>

                    <div className="pt-6 border-t border-white/10 mt-4 opacity-0 group-hover:opacity-100 transition-all duration-1000 delay-200">
                      <span className="text-[9px] font-bold text-primary/70 uppercase tracking-[0.4em] flex items-center gap-3">
                        Lihat Detail Proyek <ArrowUpRight size={12} />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* MOBILE FOOTER */}
        <div className="mt-16 md:hidden">
          <Link
            href="/blog"
            className="w-full flex items-center justify-between border-b border-border py-8 text-[11px] font-bold uppercase tracking-[0.4em] text-foreground"
          >
            Explore all stories
            <div className="w-10 h-10 rounded-full bg-foreground text-white flex items-center justify-center">
              <ArrowUpRight size={16} />
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
