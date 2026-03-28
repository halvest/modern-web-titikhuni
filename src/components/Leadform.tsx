"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { toast } from "react-hot-toast";
import { Loader2, ArrowRight, MessageCircle } from "lucide-react";

export const LeadForm = () => {
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    message: "",
  });

  const [metadata, setMetadata] = useState({
    source_url: "",
    utm_source: "website",
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      setMetadata({
        source_url: window.location.href,
        utm_source: params.get("utm_source") || "website",
      });
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // ✅ Sinkronisasi Presisi dengan Tabel public.leads
      const { error } = await supabase.from("leads").insert([
        {
          name: formData.name,
          phone: formData.phone,
          message: formData.message,
          source_url: metadata.source_url,
          utm_source: metadata.utm_source,
          source: "website", // Sesuai default value di database
        },
      ]);

      if (error) throw error;

      toast.success("Pesan Anda telah kami terima.");

      // Meta Pixel Event
      if (typeof window !== "undefined" && (window as any).fbq) {
        (window as any).fbq("track", "Lead");
      }

      setFormData({ name: "", phone: "", message: "" });
    } catch (error: any) {
      toast.error("Terjadi kendala saat mengirim pesan.");
      console.error("Database Insert Error:", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="contact"
      className="py-24 md:py-40 bg-[#FCFCFB] border-t border-stone-100"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-12 gap-16 lg:gap-24 items-start relative z-10">
          {/* SISI KIRI: Informasi & Branding */}
          <div className="lg:col-span-5 space-y-12">
            <div className="space-y-6">
              <span className="text-[10px] font-medium uppercase tracking-[0.4em] text-emerald-600 block">
                Mulai Konsultasi
              </span>
              <h2 className="text-3xl md:text-5xl font-medium tracking-tighter text-stone-900 leading-[1.1]">
                Wujudkan hunian <br />
                <span className="text-stone-300 italic font-normal text-4xl md:text-6xl tracking-tight">
                  impian Anda.
                </span>
              </h2>
              <p className="text-stone-400 font-light text-base md:text-lg leading-relaxed max-w-sm">
                Diskusikan visi properti Anda secara personal dengan konsultan
                ahli kami di Yogyakarta.
              </p>
            </div>

            <div className="flex items-center gap-6 p-6 border border-stone-100 rounded-sm w-fit group hover:border-emerald-600 transition-all duration-700">
              <div className="text-stone-300 group-hover:text-emerald-600 transition-colors">
                <MessageCircle size={28} strokeWidth={1} />
              </div>
              <div>
                <p className="text-[9px] font-medium uppercase tracking-widest text-stone-300 mb-1">
                  Respon via WhatsApp
                </p>
                <p className="font-medium text-stone-900 text-sm tracking-tight tracking-widest">
                  0851-9080-0168
                </p>
              </div>
            </div>
          </div>

          {/* ✅ SISI KANAN: Lead Form (Modern Glassmorphism) */}
          <div className="lg:col-span-7">
            <form onSubmit={handleSubmit} className="space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="group">
                  <label className="text-[10px] font-medium uppercase tracking-[0.2em] text-stone-400 block mb-3 group-focus-within:text-stone-900 transition-colors">
                    Nama Lengkap
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="Hasyim Adani"
                    className="w-full bg-white/50 backdrop-blur-sm border border-stone-200 rounded-xl px-5 py-4 text-stone-900 placeholder:text-stone-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-200 outline-none transition-all duration-500 font-light"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </div>

                <div className="group">
                  <label className="text-[10px] font-medium uppercase tracking-[0.2em] text-stone-400 block mb-3 group-focus-within:text-stone-900 transition-colors">
                    Nomor WhatsApp
                  </label>
                  <input
                    required
                    type="tel"
                    placeholder="0812xxxx"
                    className="w-full bg-white/50 backdrop-blur-sm border border-stone-200 rounded-xl px-5 py-4 text-stone-900 placeholder:text-stone-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-200 outline-none transition-all duration-500 font-light"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="group">
                <label className="text-[10px] font-medium uppercase tracking-[0.2em] text-stone-400 block mb-3 group-focus-within:text-stone-900 transition-colors">
                  Pesan Anda (Opsional)
                </label>
                <textarea
                  rows={3}
                  placeholder="Ceritakan visi hunian Anda..."
                  className="w-full bg-white/50 backdrop-blur-sm border border-stone-200 rounded-xl px-5 py-4 text-stone-900 placeholder:text-stone-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-200 outline-none transition-all duration-500 font-light resize-none"
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                />
              </div>

              <div className="flex justify-end pt-6">
                <button
                  disabled={loading}
                  type="submit"
                  className="group flex items-center gap-6 text-[10px] font-medium uppercase tracking-[0.3em] text-stone-900 disabled:opacity-30 transition-all outline-none"
                >
                  {loading ? (
                    <span className="flex items-center gap-3">
                      <Loader2 className="animate-spin" size={16} />{" "}
                      Sinkronisasi...
                    </span>
                  ) : (
                    <>
                      Kirim Pesan
                      <div className="w-12 h-12 rounded-full border border-stone-200 flex items-center justify-center group-hover:bg-stone-900 group-hover:text-white transition-all duration-700">
                        <ArrowRight size={18} strokeWidth={1} />
                      </div>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
