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
    canonical: "https://titikhuni.id/tentang-kami",
  },
};

export default function TentangKamiPage() {
  return (
    <main id="main-content" tabIndex={-1} className="min-h-screen bg-surface text-foreground">
      <div className="home-content-canvas min-h-screen">
        <TentangKami />
      </div>
    </main>
  );
}
