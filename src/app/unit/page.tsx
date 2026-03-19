// src/app/unit/page.tsx

import { Unit } from "@/components/Unit";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rumah Dijual di Yogyakarta | Perumahan Jogja - Titik Huni",
  description:
    "Temukan berbagai pilihan rumah minimalis modern di Sleman dan Bantul Yogyakarta. Lokasi strategis, desain tropis modern, cocok untuk hunian maupun investasi properti.",
  keywords: [
    "rumah dijual jogja",
    "perumahan jogja",
    "rumah minimalis jogja",
    "rumah dijual bantul",
    "rumah dijual sleman",
    "rumah baru jogja",
  ],
  alternates: {
    canonical: "https://titikhuni.com/unit",
  },
};

export default function Page() {
  return (
    <main className="bg-white min-h-screen flex flex-col">
      {/* NAVBAR */}
      <Navbar />

      {/* CONTENT */}
      <div className="flex-1">


        {/* UNIT LIST */}
        <Unit />
      </div>

      {/* FOOTER */}
      <Footer />
    </main>
  );
}
