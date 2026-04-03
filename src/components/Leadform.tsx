"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { toast } from "react-hot-toast";
import { Loader2, ArrowRight, MessageCircle, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

// Interface untuk type-safety
interface LeadFormData {
  name: string;
  phone: string;
  message: string;
  unit_id?: string; // Opsional jika form global
}

export const LeadForm = ({ unitId }: { unitId?: string }) => {
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const [formData, setFormData] = useState<LeadFormData>({
    name: "",
    phone: "",
    message: "",
  });

  const [meta, setMeta] = useState({
    source_url: "",
    utm_source: "website",
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      setMeta({
        source_url: window.location.href,
        utm_source: params.get("utm_source") || "website",
      });
    }
  }, []);

  // Handler input yang lebih clean
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validasi Dasar (Minimal 10 digit untuk HP)
    if (formData.phone.length < 10) {
      return toast.error("Nomor WhatsApp tidak valid.");
    }

    setLoading(true);

    try {
      const { error } = await supabase.from("leads").insert([
        {
          ...formData,
          ...meta,
          unit_id: unitId || null,
          status: "new",
          source: "website",
        },
      ]);

      if (error) throw error;

      // Pelacakan Konversi (Meta Pixel)
      if (typeof window !== "undefined" && (window as any).fbq) {
        (window as any).fbq("track", "Lead", {
          content_name: formData.name,
          status: "New",
        });
      }

      toast.success(
        "Visi Anda telah kami catat. Konsultan kami akan segera menghubungi.",
      );
      setFormData({ name: "", phone: "", message: "" });
    } catch (error: any) {
      console.error("Submission Error:", error.message);
      toast.error("Gagal mengirim pesan. Silakan coba lagi nanti.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="contact"
      className="py-24 md:py-32 bg-[#FCFCFB] relative overflow-hidden"
    >
      {/* Dekorasi Background untuk kesan Premium */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-emerald-50/30 -skew-x-12 translate-x-32 z-0" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-12 gap-16 items-center">
          {/* SISI KIRI: Value Proposition */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-5 space-y-10"
          >
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-700">
                  Online Consultation
                </span>
              </div>
              <h2 className="text-4xl md:text-6xl font-medium tracking-tight text-stone-900 leading-[1.05]">
                Mulai langkah <br />
                <span className="text-stone-400 italic font-light">
                  hunian impian.
                </span>
              </h2>
              <p className="text-stone-500 text-lg leading-relaxed max-w-md font-light">
                Dapatkan estimasi biaya, pemilihan material, hingga strategi
                investasi properti terbaik langsung dari ahlinya.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 border border-stone-100 bg-white rounded-2xl flex items-center gap-4 shadow-sm">
                <div className="w-10 h-10 rounded-full bg-stone-50 flex items-center justify-center text-emerald-600">
                  <ShieldCheck size={20} />
                </div>
                <p className="text-xs font-medium text-stone-600 uppercase tracking-tighter">
                  Data Terproteksi
                </p>
              </div>
              <div className="p-5 border border-stone-100 bg-white rounded-2xl flex items-center gap-4 shadow-sm group cursor-pointer hover:border-emerald-200 transition-all">
                <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                  <MessageCircle size={20} />
                </div>
                <div>
                  <p className="text-[9px] uppercase tracking-widest text-stone-400">
                    WhatsApp
                  </p>
                  <p className="text-sm font-semibold text-stone-900 tracking-tight">
                    0851-9080-0168
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* SISI KANAN: Form (Premium Glass Card) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-7"
          >
            <div className="bg-white border border-stone-200/60 rounded-[32px] p-8 md:p-12 shadow-2xl shadow-stone-200/50">
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-stone-500 ml-1">
                      Nama Lengkap
                    </label>
                    <input
                      required
                      name="name"
                      type="text"
                      placeholder="Contoh: Hasyim Adani"
                      className="w-full bg-stone-50 border-none rounded-2xl px-6 py-4 text-stone-900 placeholder:text-stone-300 focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-stone-500 ml-1">
                      Nomor WhatsApp
                    </label>
                    <input
                      required
                      name="phone"
                      type="tel"
                      placeholder="0812xxxx"
                      className="w-full bg-stone-50 border-none rounded-2xl px-6 py-4 text-stone-900 placeholder:text-stone-300 focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-stone-500 ml-1">
                    Pesan (Opsional)
                  </label>
                  <textarea
                    name="message"
                    rows={4}
                    placeholder="Apa yang bisa kami bantu hari ini?"
                    className="w-full bg-stone-50 border-none rounded-2xl px-6 py-4 text-stone-900 placeholder:text-stone-300 focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none resize-none"
                    value={formData.message}
                    onChange={handleChange}
                  />
                </div>

                <button
                  disabled={loading}
                  type="submit"
                  className="w-full group bg-stone-900 hover:bg-emerald-600 disabled:bg-stone-300 text-white rounded-2xl py-5 px-8 flex items-center justify-center gap-4 transition-all duration-500 shadow-xl shadow-stone-900/10"
                >
                  {loading ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    <>
                      <span className="text-xs font-bold uppercase tracking-[0.2em]">
                        Kirim Permintaan Konsultasi
                      </span>
                      <ArrowRight
                        size={18}
                        className="group-hover:translate-x-2 transition-transform"
                      />
                    </>
                  )}
                </button>

                <p className="text-center text-[10px] text-stone-400 font-light italic">
                  *Dengan menekan tombol, Anda menyetujui kebijakan privasi
                  kami.
                </p>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
