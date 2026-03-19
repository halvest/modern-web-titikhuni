"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export const PromoBanner = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ height: 0, opacity: 0, y: -12 }}
          animate={{ height: "auto", opacity: 1, y: 0 }}
          exit={{ height: 0, opacity: 0, y: -12 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="relative overflow-hidden"
        >
          {/* Soft warm background */}
          <div className="absolute inset-0 bg-gradient-to-r from-amber-200 via-yellow-200 to-amber-300" />

          <div className="relative container mx-auto px-4 py-2">
            <div className="relative text-slate-900 text-center">
              <p className="text-sm sm:text-base font-medium leading-snug">
                <span className="block font-semibold">
                  Wujudkan resolusi 2026 dengan aset produktif & passive income
                </span>
              </p>

              {/* Close button */}
              <button
                onClick={() => setIsVisible(false)}
                aria-label="Tutup informasi"
                className="absolute right-0 top-1/2 -translate-y-1/2 p-1.5 rounded-full hover:bg-white/30 transition"
              >
                <X className="h-4 w-4 text-slate-700" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
