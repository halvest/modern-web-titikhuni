"use client";

import { useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";
import { siteConfig } from "@/config/site";
import { trackWhatsAppClick } from "@/lib/analytics";

export function HomeWhatsAppButton() {
  const [heroVisible, setHeroVisible] = useState(true);
  const [closingSectionVisible, setClosingSectionVisible] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("beranda");
    const closingSections = [
      document.getElementById("kontak"),
      document.querySelector("footer"),
    ].filter(Boolean) as Element[];

    const heroObserver = hero
      ? new IntersectionObserver(([entry]) => setHeroVisible(entry.isIntersecting), {
          threshold: 0.08,
        })
      : null;
    const closingObserver = new IntersectionObserver(
      (entries) =>
        setClosingSectionVisible(entries.some((entry) => entry.isIntersecting)),
      { threshold: 0.05 },
    );

    if (hero) heroObserver?.observe(hero);
    closingSections.forEach((section) => closingObserver.observe(section));

    return () => {
      heroObserver?.disconnect();
      closingObserver.disconnect();
    };
  }, []);

  if (heroVisible || closingSectionVisible) return null;

  return (
    <a
      href={`https://wa.me/${siteConfig.organization.telephone.replace(/\D/g, "")}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat WhatsApp Titik Huni"
      onClick={() => trackWhatsAppClick("floating_whatsapp_button")}
      className="fixed bottom-[calc(1.25rem+env(safe-area-inset-bottom))] right-5 z-40 hidden h-12 w-12 items-center justify-center rounded-full border border-primary/20 bg-primary text-white shadow-sm transition duration-300 hover:-translate-y-1 hover:bg-primary-hover active:scale-[0.98] sm:flex md:bottom-6 md:right-6 md:h-[3.25rem] md:w-[3.25rem]"
    >
      <MessageCircle size={22} aria-hidden="true" />
    </a>
  );
}
