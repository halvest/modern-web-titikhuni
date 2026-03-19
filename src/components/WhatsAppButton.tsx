"use client";

import { useState, useEffect } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function WhatsAppButton() {
  const [open, setOpen] = useState(false);
  const [hasOpenedAuto, setHasOpenedAuto] = useState(false);

  // Auto-open setelah 7 detik (memberi kesan CS menyapa)
  useEffect(() => {
    const timer = setTimeout(() => {
      // Cek apakah user pernah menutup chat sebelumnya di sesi ini
      const isClosed = sessionStorage.getItem("wa_popup_closed");
      if (!isClosed && !hasOpenedAuto) {
        setOpen(true);
        setHasOpenedAuto(true);
      }
    }, 7000);

    return () => clearTimeout(timer);
  }, [hasOpenedAuto]);

  const handleClose = () => {
    setOpen(false);
    sessionStorage.setItem("wa_popup_closed", "true"); // Jangan auto-open lagi
  };

  const handleToggle = () => {
    if (open) {
      handleClose();
    } else {
      setOpen(true);
    }
  };

  const handleClick = () => {
    // --- 1. TRACKING GTM (GOOGLE ADS & GA4) ---
    // Mengirim event ke DataLayer agar bisa ditangkap GTM
    if (typeof window !== "undefined" && (window as any).dataLayer) {
      (window as any).dataLayer.push({
        event: "whatsapp_click", // Nama event untuk Trigger GTM
        source: "floating_button",
        conversion_value: 0,
      });
    }

    // --- 2. TRACKING META PIXEL (BACKUP) ---
    // Tetap kirim langsung ke Pixel sebagai cadangan
    if (typeof window !== "undefined" && (window as any).fbq) {
      (window as any).fbq("track", "Contact", {
        content_name: "Floating WhatsApp Button",
        status: "clicked",
      });
    }

    // --- 3. LOGIKA PESAN OTOMATIS + REF URL ---
    // Mengambil URL halaman saat ini agar CS tahu user datang dari iklan/halaman mana
    let currentUrl = "";
    if (typeof window !== "undefined") {
      currentUrl = window.location.href;
    }

    const baseMessage =
      "Halo Admin, saya tertarik info detail tentang Villa Lodji Svarga 2. Bisa minta pricelist?";
    // Menambahkan referensi URL di bawah pesan (sangat berguna untuk tracking manual CS)
    const finalMessage = `${baseMessage}\n\n(Ref: ${currentUrl})`;

    const url = `https://wa.me/6289509888404?text=${encodeURIComponent(
      finalMessage,
    )}`;

    window.open(url, "_blank");
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
      {/* Popup Bubble Chat */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="relative bg-white rounded-2xl shadow-2xl w-72 overflow-hidden border border-slate-100 origin-bottom-right"
          >
            {/* Header Admin */}
            <div className="bg-[#075e54] p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  {/* Avatar Admin (Placeholder) */}
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white font-bold">
                    CS
                  </div>
                  {/* Green Dot Online */}
                  <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 border-2 border-[#075e54] rounded-full"></div>
                </div>
                <div>
                  <p className="text-white font-bold text-sm">
                    Haspro - Support
                  </p>
                  <p className="text-white/80 text-xs">Online sekarang</p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="text-white/70 hover:text-white transition"
              >
                <X size={18} />
              </button>
            </div>

            {/* Chat Body */}
            <div className="bg-[#e5ddd5] p-4 bg-opacity-30">
              <div className="bg-white p-3 rounded-bl-xl rounded-tr-xl rounded-br-xl shadow-sm text-sm text-slate-700 leading-relaxed relative">
                <p>
                  Halo Kak! 👋 <br />
                  Ada yang bisa kami bantu terkait{" "}
                  <span className="font-bold text-[#075e54]">
                    Investasi Villa
                  </span>{" "}
                  di Jogja?
                </p>
                <span className="text-[10px] text-slate-400 absolute bottom-1 right-2">
                  {new Date().toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>

            {/* Tombol Action */}
            <div className="p-3 bg-white border-t border-slate-100">
              <button
                onClick={handleClick}
                className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white font-bold py-2.5 rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 group"
              >
                <MessageCircle size={18} />
                <span>Balas Chat</span>
                <Send
                  size={16}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button Utama */}
      <motion.button
        onClick={handleToggle}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="relative bg-[#25D366] hover:bg-[#128C7E] text-white rounded-full p-4 shadow-xl transition-colors duration-300 flex items-center justify-center"
      >
        {/* Ikon WA */}
        <MessageCircle size={32} />

        {/* Notification Badge (Merah) */}
        {!open && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-5 w-5 bg-red-500 text-white text-[10px] font-bold items-center justify-center border-2 border-white">
              1
            </span>
          </span>
        )}
      </motion.button>
    </div>
  );
}
