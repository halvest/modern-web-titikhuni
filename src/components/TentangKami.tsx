// src/components/TentangKami.tsx
"use client";

import { motion } from "framer-motion";
import { Instagram, MessageCircle } from "lucide-react";
import Link from "next/link";

export function TentangKami() {
  const WHATSAPP_URL =
    "https://wa.me/6289509888404?text=Halo%20Titik%20Huni,%20saya%20ingin%20konsultasi%20mengenai%20hunian.&utm_source=landingpage&utm_medium=about_section";

  return (
    <section id="about" className="py-24 md:py-32 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
          {/* Sisi Kiri: Visual Identity & Prinsip (Stacked) */}
          <div className="flex flex-col gap-12 min-w-fit">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className="flex gap-4 md:gap-5"
            >
              <div className="relative w-36 h-36 md:w-44 md:h-44 bg-[#262626] flex items-center justify-center overflow-hidden group">
                <span className="relative z-10 text-white tracking-[0.6em] font-light text-xs md:text-sm">
                  TITIK
                </span>
                <div className="absolute inset-0 bg-neutral-800 translate-y-full group-hover:translate-y-0 transition-transform duration-700" />
              </div>
              <div className="relative w-36 h-36 md:w-44 md:h-44 bg-[#262626] flex items-center justify-center overflow-hidden group">
                <span className="relative z-10 text-white tracking-[0.6em] font-light text-xs md:text-sm">
                  HUNI
                </span>
                <div className="absolute inset-0 bg-neutral-800 translate-y-full group-hover:translate-y-0 transition-transform duration-700" />
              </div>
            </motion.div>

            {/* Prinsip Pindah ke Sini (Bawah Kotak) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-8"
            >
              <h3 className="text-neutral-900 font-bold text-[10px] uppercase tracking-[0.3em] border-b border-neutral-100 pb-4">
                Prinsip Dasar
              </h3>
              <ul className="space-y-6 text-neutral-500 font-light text-sm md:text-base max-w-[320px]">
                <li className="flex items-start gap-4 group">
                  <span className="w-1.5 h-[1px] bg-neutral-400 mt-2.5 transition-all group-hover:w-4 group-hover:bg-black" />
                  <span>Desain yang sederhana dan jujur pada material</span>
                </li>
                <li className="flex items-start gap-4 group">
                  <span className="w-1.5 h-[1px] bg-neutral-400 mt-2.5 transition-all group-hover:w-4 group-hover:bg-black" />
                  <span>
                    Ruang yang menghadirkan hidup lebih tenang dan cukup
                  </span>
                </li>
                <li className="flex items-start gap-4 group">
                  <span className="w-1.5 h-[1px] bg-neutral-400 mt-2.5 transition-all group-hover:w-4 group-hover:bg-black" />
                  <span>Hunian yang terkurasi, bukan pembangunan massal</span>
                </li>
              </ul>
            </motion.div>
          </div>

          {/* Sisi Kanan: Narrative Content */}
          <div className="flex-1 flex flex-col justify-between">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              <h2 className="text-neutral-400 text-[10px] uppercase tracking-[0.5em] mb-12 font-bold">
                Tentang Titik Huni
              </h2>

              <div className="space-y-8 text-neutral-800 font-light leading-[1.9] text-base md:text-[1.15rem]">
                <p>
                  Titik Huni lahir dari keyakinan sederhana: rumah seharusnya
                  menjadi tempat untuk hidup dengan lebih{" "}
                  <span className="font-medium text-black">
                    tenang dan cukup.
                  </span>
                </p>
                <p>
                  Kami merancang hunian dengan pendekatan desain yang sederhana,
                  jujur pada material, serta memperhatikan pengalaman ruang yang
                  nyaman untuk kehidupan sehari-hari.
                </p>
                <p>
                  Setiap rumah dirancang dengan perhatian pada cahaya alami,
                  sirkulasi udara, hubungan dengan taman, serta proporsi ruang
                  yang membuat rumah terasa lega dan hidup.
                </p>
                <p className="text-neutral-500">
                  Titik Huni bukanlah developer yang membangun rumah secara
                  massal. Kami merancang hunian secara lebih terbatas dan
                  terkurasi, agar setiap rumah memiliki kualitas ruang yang
                  benar-benar terasa.
                </p>

                <div className="pt-10 mt-12 border-t border-neutral-50">
                  <p className="font-medium text-neutral-900 text-lg md:text-2xl italic leading-snug">
                    "Karena pada akhirnya, rumah yang baik bukanlah rumah yang
                    paling besar atau paling mewah, melainkan rumah yang terasa
                    cukup dan tepat untuk pulang."
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Social Icons - Alignment Bottom Right */}
            <div className="flex justify-end items-center gap-10 mt-16 lg:mt-0">
              <Link
                href="https://instagram.com/titikhuni"
                target="_blank"
                className="group flex flex-col items-center gap-3"
              >
                <Instagram
                  size={26}
                  strokeWidth={1}
                  className="text-neutral-300 group-hover:text-black transition-all duration-500"
                />
                <span className="text-[7px] uppercase tracking-[0.3em] opacity-0 group-hover:opacity-100 transition-all duration-500">
                  Instagram
                </span>
              </Link>
              <Link
                href={WHATSAPP_URL}
                target="_blank"
                className="group flex flex-col items-center gap-3"
              >
                <MessageCircle
                  size={26}
                  strokeWidth={1}
                  className="text-neutral-300 group-hover:text-black transition-all duration-500"
                />
                <span className="text-[7px] uppercase tracking-[0.3em] opacity-0 group-hover:opacity-100 transition-all duration-500">
                  WhatsApp
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
