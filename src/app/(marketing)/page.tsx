import { HomeWhatsAppButton } from "@/components/marketing/home/HomeWhatsAppButton";
import type { Metadata } from "next";
import { Beranda } from "@/components/Beranda";
import { Unit } from "@/components/Unit";
import { FAQs } from "@/components/FAQs";
import {
  HomeAbout,
  HomeGallery,
} from "@/components/marketing/home/HomeSections";
import { HomeContact } from "@/components/marketing/home/HomeContact";
import { HomeBlog } from "@/components/marketing/home/HomeBlog";
import { HomeServices } from "@/components/marketing/home/HomeServices";
import { SmoothScrollProvider } from "@/components/SmoothScrollProvider";

const homeTitle = "Titik Huni | Developer Rumah Modern di Yogyakarta";
const homeDescription =
  "Jelajahi rumah modern Titik Huni di Yogyakarta. Lihat pilihan hunian di Sleman dan Bantul beserta lokasi, harga, spesifikasi, dan ketersediaan unit.";
const homeImage = "/assets/images/rumah-bangunjiwo-bantul.jpg";

export const metadata: Metadata = {
  title: { absolute: homeTitle },
  description: homeDescription,
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
    title: "Titik Huni | Rumah Modern di Yogyakarta",
    description: homeDescription,
    url: "https://titikhuni.id",
    siteName: "Titik Huni",
    images: [
      {
        url: homeImage,
        width: 3840,
        height: 2160,
        alt: "Rumah modern Titik Huni di Bangunjiwo, Bantul, Yogyakarta",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: homeTitle,
    description: homeDescription,
    images: [homeImage],
  },
};

export default function Home() {
  return (
    <SmoothScrollProvider>
      <main
        id="main-content"
        tabIndex={-1}
        className="font-sans text-foreground"
      >
        <Beranda />
        <div className="home-content-canvas">
          <HomeAbout />
          <Unit />
          <HomeGallery />
          <HomeServices />
          <HomeBlog />
          <FAQs />
          <HomeContact />
          <HomeWhatsAppButton />
        </div>
      </main>
    </SmoothScrollProvider>
  );
}
