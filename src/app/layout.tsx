import type { Metadata, Viewport } from "next";
import { Manrope } from "next/font/google";
import clsx from "clsx";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { Analytics } from "@vercel/analytics/next";

/* ================================
FONT — Manrope (single typeface system)
================================ */
const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
  variable: "--font-manrope",
  preload: true,
});

/* ================================
VIEWPORT & THEME
================================ */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#234438",
};

/* ================================
SEO GLOBAL METADATA
================================ */
import NextTopLoader from "nextjs-toploader";
import { siteConfig } from "@/config/site";

const SITE_URL = siteConfig.url;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  title: {
    default: "Titik Huni | Boutique Developer & Jasa Bangun Rumah Yogyakarta",
    template: "%s | Titik Huni",
  },

  description:
    "Developer properti premium di Yogyakarta. Spesialis rumah minimalis modern dan jasa arsitek/kontraktor dengan lokasi strategis di Sleman & Bantul.",

  keywords: [
    "titik huni",
    "perumahan jogja",
    "rumah sleman",
    "rumah bantul",
    "jasa bangun rumah jogja",
    "arsitek jogja",
    "kontraktor jogja",
    "investasi properti yogyakarta",
    "developer rumah minimalis jogja",
  ],

  verification: {
    google: "F7BmAIc2TrhpbXx5VJqFRf2rSQvKNekU0AsSxxjG4oA",
  },

  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },

  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  openGraph: {
    title: "Titik Huni | Pilihan Rumah Modern & Strategis di Yogyakarta",
    description:
      "Wujudkan hunian impian di Yogyakarta. Desain arsitektur premium dengan sistem pembayaran transparan dan lokasi bernilai investasi tinggi.",
    url: SITE_URL,
    siteName: "Titik Huni",
    locale: "id_ID",
    type: "website",
    images: [
      {
        url: `${SITE_URL}/og.jpg`, // Gunakan URL Absolut untuk OG
        width: 1200,
        height: 630,
        alt: "Proyek Properti Titik Huni Yogyakarta",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Titik Huni | Boutique Developer Yogyakarta",
    description:
      "Desain rumah modern minimalis dengan lokasi strategis di Yogyakarta.",
    images: [`${SITE_URL}/og.jpg`],
  },

  alternates: {
    canonical: SITE_URL,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="id"
      dir="ltr"
      className="scroll-smooth"
      data-scroll-behavior="smooth"
    >
      <body
        className={clsx(
          manrope.variable,
          manrope.className,
          "bg-background text-foreground antialiased selection:bg-emerald-100 selection:text-emerald-950"
        )}
      >
        <NextTopLoader
          color="#234438"
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          crawl={true}
          showSpinner={false}
          easing="ease"
          speed={200}
          shadow="0 0 10px #234438,0 0 5px #234438"
          zIndex={1600}
          showAtBottom={false}
        />
        {children}

        {/* Analytics & UI Tools */}
        <Analytics />
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 4000,
            className:
              "text-sm font-medium border border-surface-muted shadow-xl rounded-2xl",
          }}
        />
      </body>
    </html>
  );
}
