// src/app/tentang-kami/page.tsx

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { TentangKami } from "@/components/TentangKami";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tentang Kami | Developer Hunian Jogja - Titik Huni",
  description:
    "Titik Huni adalah developer hunian minimalis di Yogyakarta yang merancang rumah dengan pendekatan arsitektur sederhana, material jujur, dan ruang hidup yang nyaman.",
  keywords: [
    "developer hunian jogja",
    "developer rumah jogja",
    "perumahan jogja",
    "arsitektur rumah jogja",
    "developer properti yogyakarta",
  ],
  alternates: {
    canonical: "https://titikhuni.com/tentang-kami",
  },
};

export default function TentangKamiPage() {
  return (
    <main className="bg-white min-h-screen flex flex-col">
      {/* NAVBAR */}
      <Navbar />

      {/* CONTENT */}
      <div className="flex-1">
        <TentangKami />
      </div>

      {/* FOOTER */}
      <Footer />
    </main>
  );
}
