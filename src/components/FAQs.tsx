"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, MessageSquare } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const faqItems = [
  {
    question: "Bagaimana proses awal membangun di Titik Huni?",
    answer:
      "Proses dimulai dengan konsultasi desain untuk memahami kebutuhan ruang dan budget Anda. Setelah desain disetujui, kami akan menyusun RAB detail. Jika kesepakatan tercapai, proses pembangunan dimulai dengan pengawasan berkala dari tim teknis kami.",
  },
  {
    question: "Apakah Titik Huni bisa membantu pengurusan IMB/PBG?",
    answer:
      "Ya, sebagai developer dan kontraktor, kami menyediakan jasa pengurusan perizinan (PBG) agar bangunan Anda memiliki legalitas yang sah sesuai peraturan daerah Yogyakarta dan sekitarnya.",
  },
  {
    question: "Bagaimana sistem pembayaran untuk jasa kontraktor?",
    answer:
      "Kami menggunakan sistem termin berdasarkan progres fisik di lapangan. Pembayaran biasanya dibagi menjadi 4-5 tahap (DP, Termin 1-3, dan Retensi) untuk menjaga transparansi dan keamanan finansial.",
  },
  {
    question: "Berapa lama garansi yang diberikan setelah serah terima?",
    answer:
      "Kami memberikan garansi pemeliharaan selama 3 bulan dan garansi struktur hingga 10 tahun. Kami berkomitmen menjaga kualitas bangunan jangka panjang sebagai bentuk dedikasi kami.",
  },
  {
    question: "Apakah bisa membangun dengan desain dari luar Titik Huni?",
    answer:
      "Sangat bisa. Tim kontraktor kami siap mengeksekusi desain yang sudah Anda miliki. Kami akan melakukan review teknis untuk memastikan efisiensi struktur dan biaya.",
  },
];

const AccordionItem = ({
  item,
  isOpen,
  onClick,
}: {
  item: any;
  isOpen: boolean;
  onClick: () => void;
}) => (
  <div className="border-b border-neutral-100 last:border-0">
    <button
      onClick={onClick}
      className="w-full flex justify-between items-center text-left gap-6 py-8 group"
    >
      <h3
        className={`text-lg md:text-xl font-archivo uppercase tracking-tight transition-colors duration-300 ${isOpen ? "text-neutral-900" : "text-neutral-400 group-hover:text-neutral-800"}`}
      >
        {item.question}
      </h3>
      <div
        className={`flex-shrink-0 w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-300 ${isOpen ? "bg-neutral-900 border-neutral-900 text-white" : "border-neutral-200 text-neutral-300"}`}
      >
        {isOpen ? <Minus size={14} /> : <Plus size={14} />}
      </div>
    </button>
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="overflow-hidden"
        >
          <p className="text-neutral-500 font-light leading-relaxed pb-8 max-w-2xl">
            {item.answer}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

export function FAQs() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-24 md:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Layout Grid tanpa Sticky */}
        <div className="grid lg:grid-cols-12 gap-12 md:gap-16 items-start">
          {/* SISI KIRI: Logo (Statis / Mengikuti Scroll) */}
          <div className="lg:col-span-4 flex justify-center lg:justify-start">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative w-40 h-40 md:w-56 md:h-56"
            >
              <Image
                src="/assets/icons/dark-titik-huni.png"
                alt="Titik Huni Logo"
                fill
                className="object-contain"
                priority
              />
            </motion.div>
          </div>

          {/* SISI KANAN: Accordion Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-8 space-y-12"
          >
            <div>
              <span className="text-[10px] font-archivo uppercase tracking-[0.5em] text-neutral-400 block mb-3">
                Information & Support
              </span>
              <h2 className="text-2xl md:text-3xl font-archivo uppercase tracking-tighter text-neutral-900">
                Frequently Asked{" "}
                <span className="text-neutral-300">Questions.</span>
              </h2>
            </div>

            <div className="border-t border-neutral-100">
              {faqItems.map((item, index) => (
                <AccordionItem
                  key={index}
                  item={item}
                  isOpen={openIndex === index}
                  onClick={() =>
                    setOpenIndex(openIndex === index ? null : index)
                  }
                />
              ))}
            </div>

            <Link
              href="https://wa.me/6289509888404?text=Halo Titik Huni, saya ingin konsultasi mengenai pembangunan."
              target="_blank"
              className="group flex flex-col sm:flex-row items-center justify-between gap-6 p-8 border border-neutral-100 rounded-2xl hover:border-black transition-all duration-500 bg-neutral-50/50"
            >
              <div>
                <h4 className="font-archivo uppercase text-lg tracking-tight mb-1">
                  Butuh Konsultasi Teknis?
                </h4>
                <p className="text-xs text-neutral-400 font-light">
                  Hubungi tim ahli kami untuk pembahasan RAB dan legalitas
                  lahan.
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center group-hover:scale-110 transition-transform">
                <MessageSquare size={18} />
              </div>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
