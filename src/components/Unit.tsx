//src/components/Unit.tsx
"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, MapPin, Lock } from "lucide-react";

const units = [
  {
    name: "Candibinangun",
    location: "Pakem, Sleman",
    slug: "rumah-candibinangun-sleman",
    image: "/assets/images/candibinangun/1.jpg",
    price: "Mulai 740 Juta",
    status: "Ready Unit",
    isAvailable: true,
  },
  {
    name: "Bangunjiwo",
    location: "Kasihan, Bantul",
    slug: "rumah-bangunjiwo-bantul",
    image: "/assets/images/rumah-bangunjiwo-bantul.jpg",
    price: "Mulai 575 Juta",
    status: "Ready Unit",
    isAvailable: true,
  },
  {
    name: "Pesona Pinka",
    location: "Berbah, Sleman",
    slug: "rumah-berbah-sleman",
    image: "/assets/images/rumah-berbah-sleman.svg",
    price: "Sold Out",
    status: "Sold Out",
    isAvailable: true,
  },
  {
    name: "Tirtomartani",
    location: "Kalasan, Sleman",
    slug: "rumah-tirtomartani-kalasan",
    image: "/assets/images/rumah-tirtomartani-kalasan.jpg",
    price: "Mulai 675 Juta",
    status: "Ready Unit",
    isAvailable: true,
  },
  {
    name: "Trirenggo",
    location: "Bantul Kota",
    slug: "rumah-trirenggo-bantul",
    image: "/assets/images/rumah-trirenggo-bantul.jpg",
    price: "Mulai 575 Juta",
    status: "Coming Soon",
    isAvailable: false,
  },
  {
    name: "Next Project",
    location: "Yogyakarta",
    slug: "",
    image: "/assets/images/rumah-comingsoon-jogja.jpg",
    price: "",
    status: "Coming Soon",
    isAvailable: false,
  },
];

export const Unit = () => {
  return (
    <section
      id="unit-perumahan-jogja"
      className="py-24 md:py-32 bg-white"
      aria-labelledby="unit-title"
    >
      {/* SEO Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: "Perumahan Titik Huni Yogyakarta",
            itemListElement: units
              .filter((u) => u.slug)
              .map((unit, index) => ({
                "@type": "ListItem",
                position: index + 1,
                name: `Rumah ${unit.name} ${unit.location}`,
                url: `https://titikhuni.com/unit/${unit.slug}`,
              })),
          }),
        }}
      />

      <div className="max-w-7xl mx-auto px-6">
        {/* Header SEO */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-xl"
          >
            <span className="text-[10px] uppercase tracking-[0.5em] text-neutral-400 block mb-4">
              Perumahan Yogyakarta
            </span>

            <h2
              id="unit-title"
              className="text-4xl md:text-5xl uppercase leading-none tracking-tighter text-neutral-900"
            >
              Rumah Minimalis Jogja <br />
              <span className="text-neutral-300">Titik Huni</span>
            </h2>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-neutral-500 max-w-xs text-sm md:text-base leading-relaxed"
          >
            Pilihan rumah modern di Sleman dan Bantul Yogyakarta dengan desain
            minimalis tropis, lokasi strategis, dan potensi investasi properti
            yang tinggi.
          </motion.p>
        </div>

        {/* Unit Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {units.map((unit, index) => (
            <motion.article
              key={index}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.6,
                delay: index * 0.05,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <div
                className={`relative group ${!unit.isAvailable ? "cursor-default" : ""}`}
              >
                {unit.isAvailable ? (
                  <Link
                    href={`/unit/${unit.slug}`}
                    title={`Rumah ${unit.name} ${unit.location} Yogyakarta`}
                    className="block"
                  >
                    <UnitCardContent unit={unit} index={index} />
                  </Link>
                ) : (
                  <UnitCardContent unit={unit} index={index} isLocked />
                )}
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

const UnitCardContent = ({
  unit,
  index,
  isLocked = false,
}: {
  unit: any;
  index: number;
  isLocked?: boolean;
}) => {
  return (
    <>
      <div
        className={`relative aspect-[16/10] overflow-hidden bg-neutral-100 ${isLocked ? "grayscale" : ""}`}
      >
        <Image
          src={unit.image}
          alt={`Rumah Minimalis ${unit.name} ${unit.location} Yogyakarta`}
          fill
          priority={index < 2}
          sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 33vw"
          className={`object-cover transition-transform duration-700 ${
            isLocked ? "blur-[2px] opacity-60" : "group-hover:scale-105"
          }`}
        />

        <div className="absolute top-6 left-6">
          <span className="backdrop-blur-md px-4 py-1.5 text-[9px] uppercase tracking-[0.2em] font-bold bg-white/90">
            {unit.status}
          </span>
        </div>

        {!isLocked && (
          <div className="absolute bottom-6 left-6 text-white">
            <p className="text-xs uppercase tracking-widest opacity-80">
              {unit.price}
            </p>
          </div>
        )}

        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/20 transition">
          <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-xl">
            {isLocked ? (
              <Lock size={20} className="text-neutral-400" />
            ) : (
              <ArrowUpRight size={24} className="text-black" />
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-between items-start">
        <div className={isLocked ? "opacity-40" : ""}>
          <h3 className="text-xl uppercase tracking-tight text-neutral-900 mb-1">
            Kluster {unit.name}
          </h3>

          <div className="flex items-center gap-2 text-neutral-400">
            <MapPin size={12} aria-hidden="true" />
            <span className="text-[10px] uppercase tracking-widest">
              {unit.location}
            </span>
          </div>
        </div>

        {!isLocked && (
          <div className="pt-2 text-[10px] uppercase tracking-[0.2em] text-neutral-300 group-hover:text-neutral-900 transition-colors">
            Detail
          </div>
        )}
      </div>
    </>
  );
};
