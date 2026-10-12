import { TentangKami } from "@/components/TentangKami";
import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

export const revalidate = 3600; // ISR 1 hour cache

const pageUrl = `${siteConfig.url}/tentang-kami`;
const pageTitle = "Tentang Titik Huni | Pengembang Hunian Yogyakarta";
const pageDescription =
  "Kenali Titik Huni, pengembang hunian berbasis desain di Yogyakarta yang juga menyediakan layanan desain arsitektur dan konstruksi rumah tinggal.";

export const metadata: Metadata = {
  title: {
    absolute: pageTitle,
  },
  description: pageDescription,
  keywords: [
    "Tentang Titik Huni",
    "pengembang hunian yogyakarta",
    "developer hunian jogja",
    "arsitektur rumah jogja",
    "jasa bangun rumah yogyakarta",
    "kontraktor rumah jogja",
  ],
  alternates: {
    canonical: pageUrl,
  },
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: pageUrl,
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    type: "website",
    images: [
      {
        url: `${siteConfig.url}/og.jpg`,
        width: 1200,
        height: 630,
        alt: "Tentang Titik Huni - Pengembang Hunian di Yogyakarta",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: pageTitle,
    description: pageDescription,
    images: [`${siteConfig.url}/og.jpg`],
  },
};

export default function TentangKamiPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "AboutPage",
        "@id": `${pageUrl}#webpage`,
        url: pageUrl,
        name: pageTitle,
        description: pageDescription,
        isPartOf: {
          "@type": "WebSite",
          "@id": `${siteConfig.url}/#website`,
        },
        mainEntity: {
          "@id": `${siteConfig.url}/#organization`,
        },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${pageUrl}#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Beranda",
            item: siteConfig.url,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Tentang Kami",
            item: pageUrl,
          },
        ],
      },
    ],
  };

  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="min-h-screen bg-surface text-foreground"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <div className="home-content-canvas min-h-screen">
        <TentangKami />
      </div>
    </main>
  );
}

