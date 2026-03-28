"use client";

import dynamic from "next/dynamic";

// Memindahkan lazy loading dengan ssr: false ke sini
export const GaleriClient = dynamic(
  () => import("@/components/Galeri").then((mod) => mod.Galeri),
  {
    ssr: false,
    loading: () => <div className="h-96 animate-pulse bg-neutral-100" />,
  },
);
