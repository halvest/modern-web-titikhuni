import { Metadata } from "next";
import { siteConfig } from "@/config/site";

export function generateSeoMetadata({
  title,
  description,
  path,
  imageUrl,
  noindex = false,
  canonicalUrl,
}: {
  title: string;
  description?: string;
  path: string;
  imageUrl?: string;
  noindex?: boolean;
  canonicalUrl?: string;
}): Metadata {
  const url = `${siteConfig.url}${path}`;
  const canonical = canonicalUrl || url;
  const finalDescription = description || siteConfig.description;

  return {
    title: { absolute: title },
    description: finalDescription,
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description: finalDescription,
      url: canonical,
      siteName: siteConfig.name,
      images: [
        {
          url: imageUrl || `${siteConfig.url}/og.jpg`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: siteConfig.locale,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: finalDescription,
      images: [imageUrl || `${siteConfig.url}/og.jpg`],
    },
    robots: {
      index: !noindex,
      follow: !noindex,
      nocache: noindex,
    },
  };
}
