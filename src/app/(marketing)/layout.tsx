import Script from "next/script";
import { siteConfig } from "@/config/site";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const PIXEL_ID = "750363290827556";
  const GTM_ID = "GTM-WT79LLNQ";
  const SITE_URL = siteConfig.url;

  return (
    <>
      {/* PENDING CONSENT BANNER:
          GOOOGLE TAG MANAGER, META PIXEL, DAN CLARITY SCRIPT SEMENTARA DINONAKTIFKAN
          SAMPAI ADA MEKANISME PERSETUJUAN (CONSENT) PENGGUNA. */}

      {/* STRUCTURED DATA (Organization, RealEstateAgent, WebSite & Service) */}
      <script
        id="schema-local-business"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": ["Organization", "RealEstateAgent"],
                "@id": `${SITE_URL}/#organization`,
                name: siteConfig.organization.name,
                url: SITE_URL,
                logo: siteConfig.organization.logo,
                description: siteConfig.description,
                address: {
                  "@type": "PostalAddress",
                  addressLocality: "Yogyakarta",
                  addressRegion: "DIY",
                  addressCountry: "ID",
                },
                contactPoint: {
                  "@type": "ContactPoint",
                  telephone: siteConfig.organization.telephone,
                  contactType: "sales",
                  areaServed: "ID",
                  availableLanguage: "Indonesian",
                },
                sameAs: [
                  siteConfig.social.instagram,
                  siteConfig.social.facebook,
                ],
              },
              {
                "@type": "WebSite",
                "@id": `${SITE_URL}/#website`,
                url: SITE_URL,
                name: siteConfig.name,
                description: siteConfig.description,
                publisher: { "@id": `${SITE_URL}/#organization` },
                inLanguage: "id-ID",
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

      <a
        href="#main-content"
        className="sr-only fixed left-4 top-3 z-[100] rounded-full bg-white px-5 py-3 font-semibold text-foreground shadow-lg focus:not-sr-only focus:fixed"
      >
        Langsung ke konten
      </a>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
