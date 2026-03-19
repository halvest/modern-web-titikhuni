import type { Metadata, Viewport } from "next";
import { DM_Sans } from "next/font/google";
import clsx from "clsx";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { Analytics } from "@vercel/analytics/next";
import Script from "next/script";

/* ================================
FONT OPTIMIZATION
================================ */
const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

/* ================================
VIEWPORT (NEXTJS BEST PRACTICE)
================================ */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
};

/* ================================
SEO GLOBAL METADATA
================================ */
export const metadata: Metadata = {
  metadataBase: new URL("https://titikhuni.com"),

  title: {
    default: "Titik Huni | Boutique Developer Yogyakarta",
    template: "%s | Titik Huni",
  },

  description:
    "Developer properti di Yogyakarta yang menghadirkan rumah minimalis modern di Yogyakarta. Lokasi strategis, desain arsitektur premium, cocok untuk hunian maupun investasi properti.",

  keywords: [
    "perumahan jogja",
    "rumah sleman",
    "rumah bantul",
    "rumah minimalis jogja",
    "developer properti jogja",
    "rumah strategis yogyakarta",
    "rumah dekat kampus jogja",
    "perumahan sleman",
    "rumah kasihan bantul",
    "investasi properti jogja",
    "developer rumah jogja",
    "rumah modern minimalis jogja",
  ],

  verification: {
    google: "F7BmAIc2TrhpbXx5VJqFRf2rSQvKNekU0AsSxxjG4oA",
  },

  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },

  openGraph: {
    title: "Titik Huni | Perumahan Modern di Yogyakarta",
    description:
      "Pilihan rumah modern di Sleman dan Bantul Yogyakarta dengan desain minimalis tropis dan lokasi strategis.",
    url: "https://titikhuni.com",
    siteName: "Titik Huni",
    locale: "id_ID",
    type: "website",

    images: [
      {
        url: "https://titikhuni.com/assets/images/og-property.jpg",
        width: 1200,
        height: 630,
        alt: "Perumahan Titik Huni Yogyakarta",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Titik Huni | Perumahan Modern di Yogyakarta",
    description:
      "Developer properti di Yogyakarta dengan desain rumah minimalis modern dan lokasi strategis.",
    images: ["https://titikhuni.com/assets/images/og-property.jpg"],
  },

  alternates: {
    canonical: "https://titikhuni.com",
  },
};

/* ================================
ROOT LAYOUT
================================ */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const PIXEL_ID = "750363290827556";
  const GTM_ID = "GTM-WT79LLNQ";

  return (
    <html lang="id">
      <body className={clsx(dmSans.className, "antialiased bg-white")}>
        {/* ================================
        GOOGLE TAG MANAGER
        ================================= */}
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

        {/* ================================
        META PIXEL
        ================================= */}
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

        {/* ================================
        MICROSOFT CLARITY
        ================================= */}
        <Script
          id="clarity"
          strategy="afterInteractive"
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

        {/* ================================
        ORGANIZATION STRUCTURED DATA
        ================================= */}
        <Script
          id="schema-org"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "RealEstateAgent",
              name: "Titik Huni",
              url: "https://titikhuni.com",
              logo: "https://titikhuni.com/assets/icons/dark-titik-huni.png",
              description:
                "Developer properti dan jasa bangun rumah di Yogyakarta dengan desain modern minimalis.",
              address: {
                "@type": "PostalAddress",
                addressLocality: "Yogyakarta",
                addressCountry: "ID",
              },
              areaServed: "Yogyakarta",
            }),
          }}
        />

        {children}

        <Analytics />
        <Toaster position="top-center" reverseOrder={false} />

        {/* NOSCRIPT PIXEL */}
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src={`https://www.facebook.com/tr?id=${PIXEL_ID}&ev=PageView&noscript=1`}
            alt="Meta Pixel"
          />
        </noscript>
      </body>
    </html>
  );
}
