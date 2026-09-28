"use client";

import { useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";

export function MobileStickyCta({ price, whatsappUrl }: { price: string; whatsappUrl: string }) {
  const [footerVisible, setFooterVisible] = useState(false);

  useEffect(() => {
    const footer = document.querySelector("footer");
    if (!footer) return;
    const observer = new IntersectionObserver(([entry]) => setFooterVisible(entry.isIntersecting), { threshold: 0.05 });
    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  if (footerVisible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-white px-4 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-3 shadow-[0_-8px_24px_rgba(15,23,42,0.08)] lg:hidden">
      <div className="mx-auto flex max-w-lg items-center gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-foreground-soft">Harga</p>
          <p className="truncate text-base font-semibold text-foreground">{price}</p>
        </div>
        <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 shrink-0 items-center gap-2 rounded-lg bg-primary px-5 text-sm font-semibold text-white hover:bg-primary-hover">
          <MessageCircle size={17} aria-hidden="true" /> WhatsApp
        </a>
      </div>
    </div>
  );
}
