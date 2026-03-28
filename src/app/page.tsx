// src/app/page.tsx
import { Metadata } from "next";
import Script from "next/script";

// Server Components
import { Navbar } from "@/components/Navbar";
import { Beranda } from "@/components/Beranda";
import { TentangKami } from "@/components/TentangKami";
import { Unit } from "@/components/Unit";
import { FAQs } from "@/components/FAQs";
import { LeadForm } from "@/components/Leadform";
import { Footer } from "@/components/Footer";

// Import Wrapper Client Component
import { GaleriClient } from "@/components/HomeClient";

export const metadata: Metadata = {
  title: "Titik Huni | Boutique Developer Yogyakarta",
  description:
    "Developer properti di Yogyakarta yang menghadirkan rumah minimalis modern di Sleman dan Bantul. Lokasi strategis, desain arsitektur modern, cocok untuk hunian maupun investasi properti.",
  keywords: [
    "perumahan jogja",
    "rumah sleman",
    "rumah bantul",
    "rumah minimalis jogja",
    "developer properti jogja",
  ],
  alternates: {
    canonical: "https://titikhuni.id",
  },
  openGraph: {
    title: "Perumahan Jogja - Titik Huni",
    description:
      "Pilihan rumah modern di Sleman dan Bantul Yogyakarta dengan desain minimalis tropis dan lokasi strategis.",
    url: "https://titikhuni.id",
    siteName: "Titik Huni",
    images: [
      {
        url: "/assets/images/rumah-bangunjiwo-bantul.jpg",
        width: 1200,
        height: 630,
      },
    ],
    locale: "id_ID",
    type: "website",
  },
};

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    name: "Titik Huni",
    url: "https://titikhuni.id",
    logo: "https://titikhuni.id/assets/icons/dark-titik-huni.png",
    description: "Developer properti dan jasa bangun rumah di Yogyakarta.",
    areaServed: "Yogyakarta",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Yogyakarta",
      addressCountry: "ID",
    },
  };

  return (
    <>
      <Script
        id="real-estate-agent-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="relative min-h-screen bg-white">
        <Navbar />

        <div className="overflow-x-clip">
          <section id="beranda">
            <Beranda />
          </section>

          <section id="tentang-kami">
            <TentangKami />
          </section>

          <section id="unit">
            <Unit />
          </section>

          {/* Galeri sekarang dipanggil melalui Client Wrapper */}
          <section id="galeri">
            <GaleriClient />
          </section>

          <section id="faq">
            <FAQs />
          </section>

          <section id="kontak">
            <LeadForm />
          </section>
        </div>

        <Footer />
      </main>
    </>
  );
}
