// src/app/arsitek-kontraktor/page.tsx

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import type { Metadata } from "next";
import { Check } from "lucide-react";

export const metadata: Metadata = {
  title:
    "Arsitek & Kontraktor Rumah Jogja | Jasa Desain & Bangun Rumah - Titik Huni",
  description:
    "Titik Huni menyediakan jasa arsitek dan kontraktor rumah di Yogyakarta. Layanan desain rumah minimalis modern hingga pembangunan rumah dengan kualitas terbaik.",
  keywords: [
    "arsitek rumah jogja",
    "kontraktor rumah jogja",
    "jasa desain rumah jogja",
    "bangun rumah jogja",
    "arsitek minimalis jogja",
    "kontraktor rumah yogyakarta",
  ],
  alternates: {
    canonical: "https://titikhuni.com/arsitek-kontraktor",
  },
};

export default function ArsitekKontraktorPage() {
  return (
    <main className="bg-white min-h-screen flex flex-col">
      <Navbar />

      {/* HERO */}
      <section className="pt-32 pb-24 px-6 border-b border-neutral-100">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16">
          <div>
            <span className="text-[10px] uppercase tracking-[0.5em] text-neutral-400">
              Layanan
            </span>

            <h1 className="text-4xl md:text-5xl font-bold mt-6 leading-tight text-neutral-900">
              Arsitek &
              <br />
              <span className="text-neutral-300">Kontraktor Rumah Jogja</span>
            </h1>
          </div>

          <p className="text-neutral-500 leading-relaxed text-base md:text-lg">
            Titik Huni menyediakan layanan arsitek dan kontraktor rumah di
            Yogyakarta dengan pendekatan desain yang sederhana, jujur pada
            material, serta memperhatikan pengalaman ruang yang nyaman untuk
            kehidupan sehari-hari.
          </p>
        </div>
      </section>

      {/* DESKRIPSI */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto space-y-8 text-neutral-600 leading-relaxed text-base md:text-lg">
          <p>
            Kami membantu mewujudkan rumah impian melalui proses desain dan
            pembangunan yang terintegrasi. Setiap proyek dirancang dengan
            mempertimbangkan kebutuhan ruang, pencahayaan alami, sirkulasi
            udara, serta hubungan rumah dengan lingkungan sekitarnya.
          </p>

          <p>
            Dengan pengalaman dalam perancangan hunian minimalis modern, Titik
            Huni menghadirkan layanan jasa desain rumah dan pembangunan rumah di
            Jogja dengan kualitas konstruksi yang baik serta perencanaan yang
            matang.
          </p>
        </div>
      </section>

      {/* LAYANAN */}
      <section className="py-24 px-6 bg-neutral-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-16">
            Layanan Kami
          </h2>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-neutral-900">
                Desain Arsitektur
              </h3>

              <p className="text-neutral-500 text-sm leading-relaxed">
                Perancangan rumah dengan pendekatan arsitektur minimalis modern
                yang mempertimbangkan fungsi ruang, pencahayaan alami, dan
                kenyamanan hunian.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-neutral-900">
                Perencanaan Bangunan
              </h3>

              <p className="text-neutral-500 text-sm leading-relaxed">
                Penyusunan gambar kerja, perencanaan struktur, serta estimasi
                biaya pembangunan untuk memastikan proses pembangunan berjalan
                dengan baik.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-neutral-900">
                Konstruksi Rumah
              </h3>

              <p className="text-neutral-500 text-sm leading-relaxed">
                Pelaksanaan pembangunan rumah dengan pengawasan kualitas
                konstruksi agar hasil akhir sesuai dengan desain dan standar
                pembangunan yang baik.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* KEUNGGULAN */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-12">
            Mengapa Memilih Titik Huni
          </h2>

          <div className="grid md:grid-cols-2 gap-10">
            {[
              "Pendekatan desain yang sederhana dan fungsional",
              "Material yang dipilih secara jujur dan berkualitas",
              "Proses desain hingga pembangunan yang terintegrasi",
              "Fokus pada kualitas ruang dan kenyamanan hunian",
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-4">
                <Check size={18} className="text-black mt-1" />

                <p className="text-neutral-600">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 border-t border-neutral-100">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-900">
            Konsultasikan Rumah Impian Anda
          </h2>

          <p className="mt-4 text-neutral-500">
            Hubungi kami untuk konsultasi desain dan pembangunan rumah di
            Yogyakarta bersama tim Titik Huni.
          </p>

          <a
            href="https://wa.me/6289509888404"
            className="inline-block mt-10 bg-black text-white px-8 py-4 rounded-xl font-medium hover:bg-neutral-800 transition"
          >
            Konsultasi Sekarang
          </a>
        </div>
      </section>

      <Footer />
    </main>
  );
}
