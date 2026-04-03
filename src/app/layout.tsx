import type { Metadata, Viewport } from "next";
import { DM_Sans } from "next/font/google";
import clsx from "clsx";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { Analytics } from "@vercel/analytics/next";
import Script from "next/script";

/* ================================
FONT OPTIMIZATION (Zero Layout Shift)
================================ */
const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-dm-sans", // Gunakan CSS Variable untuk fleksibilitas
  preload: true,
});

/* ================================
VIEWPORT & THEME
================================ */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#065f46", // Menggunakan aksen Emerald agar selaras dengan brand
};

/* ================================
SEO GLOBAL METADATA
================================ */
const SITE_URL = "https://titikhuni.id";

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
  const PIXEL_ID = "750363290827556";
  const GTM_ID = "GTM-WT79LLNQ";

  return (
    <html lang="id" dir="ltr" className="scroll-smooth">
      <body
        className={clsx(
          dmSans.variable,
          dmSans.className,
          "antialiased bg-white selection:bg-emerald-100 selection:text-emerald-900",
        )}
      >
        {/* GOOGLE TAG MANAGER */}
        <Script
          id="gtm-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${GTM_ID}');
            `,
          }}
        />

        {/* META PIXEL */}
        <Script
          id="meta-pixel"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}
            (window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${PIXEL_ID}');
            fbq('track', 'PageView');
            `,
          }}
        />

        {/* MICROSOFT CLARITY */}
        <Script
          id="clarity-script"
          strategy="lazyOnload"
          dangerouslySetInnerHTML={{
            __html: `
            (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "uvr74fo44y");
            `,
          }}
        />

        {/* LOCAL BUSINESS & SERVICE STRUCTURED DATA (Local SEO Power) */}
        <Script
          id="schema-local-business"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "RealEstateAgent",
                  "@id": `${SITE_URL}/#organization`,
                  name: "Titik Huni",
                  url: SITE_URL,
                  logo: `${SITE_URL}/assets/icons/dark-titik-huni.png`,
                  image: `${SITE_URL}/og.jpg`,
                  description:
                    "Developer properti dan kontraktor di Yogyakarta yang fokus pada hunian modern minimalis.",
                  address: {
                    "@type": "PostalAddress",
                    addressLocality: "Yogyakarta",
                    addressRegion: "DIY",
                    addressCountry: "ID",
                  },
                  geo: {
                    "@type": "GeoCoordinates",
                    latitude: -7.7956, // Ganti dengan koordinat kantor Anda jika ada
                    longitude: 110.3695,
                  },
                  contactPoint: {
                    "@type": "ContactPoint",
                    telephone: "+62-851-9080-0168",
                    contactType: "sales",
                    areaServed: "ID",
                    availableLanguage: "Indonesian",
                  },
                  sameAs: [
                    "https://www.instagram.com/titikhuni.id",
                    "https://www.facebook.com/titikhuni",
                  ],
                },
                {
                  "@type": "Service",
                  serviceType: "Real Estate Development",
                  provider: { "@id": `${SITE_URL}/#organization` },
                  areaServed: { "@type": "State", name: "Yogyakarta" },
                },
              ],
            }),
          }}
        />

        {/* GTM FALLBACK */}
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          ></iframe>
        </noscript>

        {children}

        {/* Analytics & UI Tools */}
        <Analytics />
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 4000,
            className:
              "text-sm font-medium border border-stone-100 shadow-xl rounded-2xl",
          }}
        />

        {/* META PIXEL FALLBACK */}
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src={`https://www.facebook.com/tr?id=${PIXEL_ID}&ev=PageView&noscript=1`}
            alt=""
          />
        </noscript>
      </body>
    </html>
  );
}
