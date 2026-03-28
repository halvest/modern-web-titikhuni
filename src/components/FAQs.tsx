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
  <div className="border-b border-stone-50 last:border-0">
    <button
      onClick={onClick}
      className="w-full flex justify-between items-center text-left gap-8 py-10 group outline-none"
    >
      <h3
        className={`text-lg md:text-xl font-medium tracking-tight transition-colors duration-700 ${
          isOpen
            ? "text-stone-900"
            : "text-stone-400 group-hover:text-stone-600"
        }`}
      >
        {item.question}
      </h3>
      <div className="flex-shrink-0 transition-transform duration-500">
        {isOpen ? (
          <Minus size={20} strokeWidth={1} className="text-stone-900" />
        ) : (
          <Plus
            size={20}
            strokeWidth={1}
            className="text-stone-300 group-hover:text-stone-900"
          />
        )}
      </div>
    </button>
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="overflow-hidden"
        >
          <p className="text-stone-500 font-light leading-[1.9] pb-10 max-w-2xl text-base md:text-lg">
            {item.answer}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

export function FAQs() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <section id="faq" className="py-24 md:py-40 bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-12 gap-16 lg:gap-24 items-start">
          {/* SISI KIRI: Minimalist Brand Header */}
          <aside className="lg:col-span-4 lg:sticky lg:top-32 space-y-12">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5 }}
              className="space-y-8"
            >
              <div className="relative w-20 h-20 opacity-20 group">
                <Image
                  src="/assets/icons/dark-titik-huni.png"
                  alt="Titik Huni Logo"
                  fill
                  className="object-contain grayscale"
                />
              </div>

              <div className="space-y-4">
                <p className="text-[10px] font-medium uppercase tracking-[0.4em] text-stone-300">
                  Tanya Jawab
                </p>
                <h2 className="text-3xl md:text-4xl font-medium tracking-tighter text-stone-900 leading-tight">
                  Informasi seputar <br />
                  <span className="text-stone-200 italic">Titik Huni.</span>
                </h2>
                <p className="text-stone-400 text-sm font-light leading-relaxed max-w-[260px]">
                  Kami percaya transparansi adalah awal dari kepercayaan dalam
                  membangun hunian.
                </p>
              </div>
            </motion.div>
          </aside>

          {/* SISI KANAN: Accordion Content */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: 0.2 }}
            className="lg:col-span-8 flex flex-col"
          >
            <div className="border-t border-stone-100">
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

            {/* Subtle CTA Card */}
            <Link
              href="https://wa.me/6289509888404?text=Halo%20Titik%20Huni,%20saya%20ingin%20konsultasi%20mengenai%20hunian."
              target="_blank"
              className="mt-20 group flex items-center justify-between py-12 border-t border-stone-100 transition-all duration-700"
            >
              <div className="space-y-1">
                <h4 className="font-medium text-stone-900 text-lg md:text-xl tracking-tight">
                  Masih memiliki pertanyaan teknis?
                </h4>
                <p className="text-stone-400 text-sm font-light">
                  Tim kami siap membantu mendiskusikan RAB dan lahan Anda.
                </p>
              </div>
              <div className="flex items-center gap-4 text-stone-900">
                <span className="text-[10px] font-medium uppercase tracking-[0.3em] opacity-0 group-hover:opacity-100 transition-all duration-500">
                  Tanya WhatsApp
                </span>
                <div className="w-12 h-12 rounded-full border border-stone-100 flex items-center justify-center group-hover:bg-stone-900 group-hover:text-white transition-all duration-700">
                  <MessageSquare size={18} strokeWidth={1} />
                </div>
              </div>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
