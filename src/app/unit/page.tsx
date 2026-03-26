import { Unit } from "@/components/Unit";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import type { Metadata } from "next";

// Metadata dioptimalkan untuk SEO yang lebih spesifik pada katalog unit
export const metadata: Metadata = {
  title: "Katalog Rumah & Investasi Properti Yogyakarta | Titik Huni",
  description:
    "Jelajahi pilihan rumah minimalis modern, villa, dan aset investasi properti terbaik di Sleman, Bantul, dan Kota Yogyakarta. Lokasi strategis dengan nilai investasi tinggi.",
  keywords: [
    "rumah dijual jogja",
    "perumahan jogja 2024",
    "investasi properti yogyakarta",
    "rumah minimalis jogja",
    "rumah dijual bantul",
    "rumah dijual sleman",
    "titik huni properti",
  ],
  alternates: {
    canonical: "https://titikhuni.id/unit",
  },
  openGraph: {
    title: "Katalog Properti Pilihan di Yogyakarta - Titik Huni",
    description:
      "Temukan hunian impian dan investasi properti terbaik di Jogja.",
    url: "https://titikhuni.id/unit",
    siteName: "Titik Huni",
    type: "website",
  },
};

export default function Page() {
  return (
    <main className="bg-white min-h-screen flex flex-col">
      {/* NAVBAR 
          Pastikan Navbar memiliki prop atau class yang sesuai jika 
          ingin transparan atau solid di halaman katalog.
      */}
      <Navbar />

      {/* CONTENT WRAPPER */}
      <div className="flex-1 pt-20 md:pt-28">
        {/* Tambahkan padding-top (pt-20) agar konten tidak tertutup 
           oleh Navbar yang biasanya bersifat 'fixed'.
        */}

        {/* UNIT LIST COMPONENT */}
        <Unit />
      </div>

      {/* FOOTER */}
      <Footer />
    </main>
  );
}
