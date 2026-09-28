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

      {/* STRUCTURED DATA (Organization, RealEstateAgent, WebSite & Service) */}
      <Script
        id="schema-local-business"
        type="application/ld+json"
        strategy="beforeInteractive"
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

      {/* GTM FALLBACK */}
      <noscript>
        <iframe
          src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
          height="0"
          width="0"
          style={{ display: "none", visibility: "hidden" }}
        ></iframe>
      </noscript>

      <a
        href="#main-content"
        className="sr-only fixed left-4 top-3 z-[100] rounded-full bg-white px-5 py-3 font-semibold text-foreground shadow-lg focus:not-sr-only focus:fixed"
      >
        Langsung ke konten
      </a>
      <Navbar />
      {children}
      <Footer />

      {/* META PIXEL FALLBACK */}
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element -- Tracking pixel fallback must remain a raw image in noscript. */}
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          src={`https://www.facebook.com/tr?id=${PIXEL_ID}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
    </>
  );
}
