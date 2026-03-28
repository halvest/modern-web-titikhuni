"use client";

import { MessageCircle } from "lucide-react";

export const WhatsAppButton = () => {
  const waNumber = "6285190800168";
  const message =
    "Halo Titik Huni, saya ingin konsultasi mengenai properti di Yogyakarta.";

  return (
    <a
      href={`https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-[60] bg-green-500 text-white p-4 rounded-full shadow-2xl hover:bg-green-600 transition-all active:scale-90 flex items-center gap-2 group"
    >
      <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 ease-in-out whitespace-nowrap text-sm font-bold">
        Chat Konsultasi
      </span>
      <MessageCircle size={28} fill="white" />
    </a>
  );
};
