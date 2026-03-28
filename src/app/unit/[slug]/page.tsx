import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/lib/supabaseClient"; // Menggunakan client yang sudah ada
import UnitDetailClient from "./UnitDetailClient";

/**
 * Interface Props sesuai dengan standar Next.js App Router terbaru.
 * params diakses secara async.
 */
type Props = {
  params: Promise<{ slug: string }>;
};

/* ============================================================
   1. GENERATE DYNAMIC METADATA (SEO OPTIMIZATION)
   ============================================================ */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  // Mengambil data minimal untuk kebutuhan Meta Tags
  const { data: unit } = await supabase
    .from("units")
    .select("title, location, image_url, price")
    .eq("slug", slug)
    .is("deleted_at", null)
    .single();

  if (!unit) {
    return {
      title: "Unit Tidak Ditemukan | Titik Huni Yogyakarta",
    };
  }

  const fullTitle = `${unit.title} - Properti Eksklusif di ${unit.location}`;
  const fullDesc = `Dapatkan hunian modern ${unit.title} di ${unit.location} Yogyakarta. Desain arsitektur premium dengan lokasi strategis. Cek spesifikasi lengkap dan harga di Titik Huni.`;

  return {
    title: fullTitle,
    description: fullDesc,
    alternates: {
      canonical: `https://titikhuni.com/unit/${slug}`,
    },
    openGraph: {
      title: fullTitle,
      description: fullDesc,
      url: `https://titikhuni.com/unit/${slug}`,
      siteName: "Titik Huni Developer",
      images: [
        {
          url: unit.image_url,
          width: 1200,
          height: 630,
          alt: unit.title,
        },
      ],
      locale: "id_ID",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: fullDesc,
      images: [unit.image_url],
    },
  };
}

/* ============================================================
   2. MAIN SERVER COMPONENT (HIGH PERFORMANCE)
   ============================================================ */
export default async function UnitDetailPage({ params }: Props) {
  const { slug } = await params;

  /**
   * Data Fetching dilakukan di sisi Server (RSC).
   * Menarik data unit lengkap beserta relasi kategori.
   */
  const { data: unit, error } = await supabase
    .from("units")
    .select(
      `
      *,
      categories (
        name,
        slug
      )
    `,
    )
    .eq("slug", slug)
    .is("deleted_at", null)
    .single();

  // Jika data tidak ada atau error, arahkan ke halaman 404 standar Next.js
  if (error || !unit) {
    notFound();
  }

  /**
   * STRUCTURED DATA (JSON-LD)
   * Membantu Google memahami bahwa ini adalah produk Real Estate.
   * Sangat krusial untuk SEO Property.
   */
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: unit.title,
    description: unit.description || `Properti eksklusif di ${unit.location}`,
    image: unit.image_url,
    url: `https://titikhuni.com/unit/${slug}`,
    address: {
      "@type": "PostalAddress",
      addressLocality: unit.location,
      addressRegion: "Yogyakarta",
      addressCountry: "ID",
    },
    offers: {
      "@type": "Offer",
      price: unit.price,
      priceCurrency: "IDR",
      availability: "https://schema.org/InStock",
      url: `https://titikhuni.com/unit/${slug}`,
    },
  };

  return (
    <main className="min-h-screen bg-white relative">
      {/* Injeksi JSON-LD ke Head */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* NAVIGASI FLOATING 
          Memberikan UX yang intuitif untuk kembali ke katalog.
      */}
      <nav className="fixed top-6 left-6 z-50 md:top-10 md:left-10">
        <Link
          href="/unit"
          className="flex items-center gap-3 bg-white/80 backdrop-blur-md px-5 py-2.5 rounded-full border border-neutral-200 shadow-sm hover:bg-black hover:text-white hover:border-black transition-all duration-500 group"
        >
          <ArrowLeft
            size={16}
            className="group-hover:-translate-x-1 transition-transform"
          />
          <span className="text-[10px] uppercase tracking-[0.2em] font-bold">
            Kembali ke Katalog
          </span>
        </Link>
      </nav>

      {/* RENDER CLIENT COMPONENT 
          Logika interaktif (Gallery Slider, Form WhatsApp, Animasi Framer Motion)
          dipisahkan ke UnitDetailClient agar halaman utama tetap ringan.
      */}
      <UnitDetailClient unit={unit} />
    </main>
  );
}
