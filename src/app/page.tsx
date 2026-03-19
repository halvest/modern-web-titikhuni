"use client";

import dynamic from "next/dynamic";
import Head from "next/head";

import { Navbar } from "@/components/Navbar";
import { Beranda } from "@/components/Beranda";
import { Unit } from "@/components/Unit";
import { TentangKami } from "@/components/TentangKami";
import { Galeri } from "@/components/Galeri";
import { FAQs } from "@/components/FAQs";
import { LeadForm } from "@/components/Leadform";
import { Footer } from "@/components/Footer";

/*
LAZY LOAD NON-CRITICAL COMPONENT
Mengurangi bundle size awal dan mempercepat LCP
*/

const Lokasi = dynamic(
  () => import("@/components/Lokasi").then((mod) => mod.Lokasi),
  {
    ssr: false,
    loading: () => (
      <div className="h-[500px] w-full bg-neutral-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-neutral-200 border-t-black rounded-full animate-spin" />
          <p className="text-[10px] uppercase tracking-[0.3em] text-neutral-400">
            Memuat Peta Lokasi...
          </p>
        </div>
      </div>
    ),
  },
);

export default function Home() {
  return (
    <>
      {/* SEO META */}
      <Head>
        <title>
          Perumahan Jogja | Rumah Minimalis Sleman & Bantul - Titik Huni
        </title>

        <meta
          name="description"
          content="Developer properti di Yogyakarta yang menghadirkan rumah minimalis modern di Sleman dan Bantul. Lokasi strategis, desain arsitektur modern, cocok untuk hunian maupun investasi properti."
        />

        <meta
          name="keywords"
          content="
          perumahan jogja,
          rumah sleman,
          rumah bantul,
          rumah minimalis jogja,
          developer properti jogja,
          rumah strategis jogja
        "
        />

        {/* Open Graph */}
        <meta property="og:title" content="Perumahan Jogja - Titik Huni" />
        <meta
          property="og:description"
          content="Pilihan rumah modern di Sleman dan Bantul Yogyakarta dengan desain minimalis tropis dan lokasi strategis."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://titikhuni.com" />
        <meta
          property="og:image"
          content="https://titikhuni.com/assets/images/rumah-bangunjiwo-bantul.jpg"
        />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />

        {/* Canonical */}
        <link rel="canonical" href="https://titikhuni.com" />

        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "RealEstateAgent",
              name: "Titik Huni",
              url: "https://titikhuni.com",
              logo: "https://titikhuni.com/assets/icons/dark-titik-huni.png",
              description:
                "Developer properti dan jasa bangun rumah di Yogyakarta yang menghadirkan perumahan modern minimalis.",
              areaServed: "Yogyakarta",
              address: {
                "@type": "PostalAddress",
                addressLocality: "Yogyakarta",
                addressCountry: "ID",
              },
            }),
          }}
        />
      </Head>

      <main className="relative min-h-screen bg-white">
        {/* Navbar */}
        <Navbar />

        <div className="overflow-x-clip">
          {/* HERO */}
          <section id="beranda">
            <Beranda />
          </section>

          {/* TENTANG */}
          <section id="tentang-kami">
            <TentangKami />
          </section>

          {/* UNIT */}
          <section id="unit">
            <Unit />
          </section>

          {/* MAP / LOKASI */}
          {/* <section id="lokasi">
            <Lokasi />
          </section> */}

          {/* GALERI */}
          <section id="galeri">
            <Galeri />
          </section>

          {/* FAQ */}
          <section id="faq">
            <FAQs />
          </section>

          {/* LEAD FORM */}
          <section id="kontak">
            <LeadForm />
          </section>
        </div>

        {/* FOOTER */}
        <Footer />
      </main>
    </>
  );
}
