// src/components/JasaBangun.tsx
"use client";

import { useState } from "react";
import { formatRupiah } from "../lib/formatRupiah";
import { motion } from "framer-motion";
import {
  PenTool,
  Hammer,
  Layout,
  CheckCircle2,
  ChevronRight,
  ShieldCheck,
  Coffee,
  Info,
  User,
  Phone,
  MapPin,
  MessageSquare,
} from "lucide-react";
import toast from "react-hot-toast";
import { supabase } from "@/lib/supabaseClient";

// --- KOMPONEN FORM KONSULTASI PROFESIONAL ---
const ArchitectConsultForm = () => {
  const [form, setForm] = useState({
    nama: "",
    whatsapp: "",
    lokasi_lahan: "",
    layanan: "Arsitek & Kontraktor",
    pesan: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase.from("leads").insert({
        nama: form.nama.trim(),
        whatsapp: form.whatsapp.trim(),
        domisili: form.lokasi_lahan.trim(),
        keterangan: `[Jasa Bangun: ${form.layanan}] \n${form.pesan}`,
        source: "Jasa Arsitek Page",
        status: "Baru",
      });

      if (error) throw error;

      toast.success(
        "Permintaan konsultasi terkirim. Arsitek kami akan menghubungi Anda.",
      );
      setForm({
        nama: "",
        whatsapp: "",
        lokasi_lahan: "",
        layanan: "Arsitek & Kontraktor",
        pesan: "",
      });
    } catch (err: any) {
      toast.error("Gagal mengirim permintaan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-neutral-100 sticky top-24">
      <div className="bg-neutral-900 p-8 text-white relative overflow-hidden">
        <Coffee className="absolute -right-8 -bottom-8 opacity-10 w-32 h-32 rotate-12" />
        <div className="relative z-10">
          <span className="text-[10px] font-archivo uppercase tracking-[0.3em] text-neutral-400 mb-4 block">
            Consultation
          </span>
          <h3 className="text-2xl font-archivo uppercase tracking-tight mb-2">
            Mulai Diskusi
          </h3>
          <p className="text-neutral-400 text-sm font-light leading-relaxed">
            Rencanakan hunian impian Anda bersama tim ahli arsitek dan
            kontraktor Titik Huni.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-8 space-y-4 bg-neutral-50/50">
        <div className="space-y-4">
          <div className="relative">
            <User className="absolute left-4 top-3.5 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Nama Anda"
              required
              className="w-full pl-12 pr-4 py-3 bg-white border border-neutral-200 rounded-xl outline-none focus:border-black transition text-sm font-light"
              value={form.nama}
              onChange={(e) => setForm({ ...form, nama: e.target.value })}
            />
          </div>
          <div className="relative">
            <Phone className="absolute left-4 top-3.5 w-4 h-4 text-neutral-400" />
            <input
              type="tel"
              placeholder="WhatsApp"
              required
              className="w-full pl-12 pr-4 py-3 bg-white border border-neutral-200 rounded-xl outline-none focus:border-black transition text-sm font-light"
              value={form.whatsapp}
              onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
            />
          </div>
          <div className="relative">
            <MapPin className="absolute left-4 top-3.5 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Lokasi Lahan (Kota)"
              className="w-full pl-12 pr-4 py-3 bg-white border border-neutral-200 rounded-xl outline-none focus:border-black transition text-sm font-light"
              value={form.lokasi_lahan}
              onChange={(e) =>
                setForm({ ...form, lokasi_lahan: e.target.value })
              }
            />
          </div>
          <select
            className="w-full px-4 py-3 bg-white border border-neutral-200 rounded-xl outline-none focus:border-black transition text-sm font-light appearance-none"
            value={form.layanan}
            onChange={(e) => setForm({ ...form, layanan: e.target.value })}
          >
            <option>Arsitek & Kontraktor</option>
            <option>Hanya Desain Arsitek</option>
            <option>Hanya Pembangunan</option>
          </select>
          <div className="relative">
            <MessageSquare className="absolute left-4 top-3.5 w-4 h-4 text-neutral-400" />
            <textarea
              placeholder="Ceritakan rencana Anda..."
              rows={3}
              className="w-full pl-12 pr-4 py-3 bg-white border border-neutral-200 rounded-xl outline-none focus:border-black transition text-sm font-light resize-none"
              value={form.pesan}
              onChange={(e) => setForm({ ...form, pesan: e.target.value })}
            />
          </div>
        </div>

        <motion.button
          whileTap={{ scale: 0.98 }}
          disabled={isSubmitting}
          className="w-full bg-neutral-900 text-white py-4 rounded-xl font-archivo uppercase tracking-widest text-xs hover:bg-black transition-all flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            "Mengirim..."
          ) : (
            <>
              Kirim Permintaan <ChevronRight size={14} />
            </>
          )}
        </motion.button>
        <p className="text-[9px] text-center text-neutral-400 uppercase tracking-widest">
          Respon tim kami dalam 1x24 Jam Kerja
        </p>
      </form>
    </div>
  );
};

// --- DATA LAYANAN ---
const services = [
  {
    icon: <PenTool className="w-6 h-6" />,
    title: "Perencanaan Arsitektur",
    price: "Mulai 50rb / m²",
    desc: "Denah fungsional, tampak 3D sinematik, hingga gambar kerja (DED) lengkap.",
  },
  {
    icon: <Hammer className="w-6 h-6" />,
    title: "Pembangunan Fisik",
    price: "Mulai 4.5jt / m²",
    desc: "Konstruksi berkualitas dengan pengawasan ketat dan material yang jujur.",
  },
  {
    icon: <Layout className="w-6 h-6" />,
    title: "Interior & Furniture",
    price: "Custom Budget",
    desc: "Penataan ruang dalam yang memaksimalkan kenyamanan dan estetika modern.",
  },
];

export default function JasaBangun() {
  return (
    <section id="jasa-bangun" className="py-24 md:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-12 gap-16 items-start">
          {/* SISI KIRI: PENJELASAN JASA */}
          <div className="lg:col-span-7 space-y-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <span className="text-[10px] font-archivo uppercase tracking-[0.5em] text-neutral-400 block mb-6">
                Architecture & Build
              </span>
              <h2 className="text-4xl md:text-6xl font-archivo uppercase leading-none tracking-tighter text-neutral-900 mb-8">
                Wujudkan Hunian <br />
                <span className="text-neutral-300">Tanpa Kompromi.</span>
              </h2>
              <p className="text-neutral-500 font-light text-lg leading-relaxed max-w-xl">
                Kami menemani perjalanan Anda dari selembar kertas sketsa hingga
                serah terima kunci. Fokus kami adalah menciptakan ruang yang
                tenang, cukup, dan berkarakter.
              </p>
            </motion.div>

            {/* List Jasa */}
            <div className="space-y-8">
              {services.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex gap-6 group"
                >
                  <div className="w-14 h-14 shrink-0 bg-neutral-50 flex items-center justify-center rounded-2xl group-hover:bg-neutral-900 group-hover:text-white transition-all duration-500">
                    {item.icon}
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-4">
                      <h4 className="font-archivo uppercase text-lg tracking-tight">
                        {item.title}
                      </h4>
                      <span className="text-[10px] font-bold text-neutral-400 bg-neutral-100 px-2 py-0.5 rounded uppercase">
                        {item.price}
                      </span>
                    </div>
                    <p className="text-neutral-500 font-light text-sm leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Benefit Bullets */}
            <div className="grid grid-cols-2 gap-8 pt-8 border-t border-neutral-100">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-neutral-900">
                  <CheckCircle2 size={16} />
                  <span className="text-xs font-bold uppercase tracking-widest">
                    Garansi Struktur
                  </span>
                </div>
                <p className="text-[11px] text-neutral-400 leading-relaxed">
                  Kami menjamin kekuatan konstruksi hingga 10 tahun pemakaian.
                </p>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-neutral-900">
                  <ShieldCheck size={16} />
                  <span className="text-xs font-bold uppercase tracking-widest">
                    Harga Transparan
                  </span>
                </div>
                <p className="text-[11px] text-neutral-400 leading-relaxed">
                  RAB detail hingga baut terkecil. Tidak ada biaya siluman di
                  tengah jalan.
                </p>
              </div>
            </div>
          </div>

          {/* SISI KANAN: FORM KONSULTASI */}
          <div className="lg:col-span-5">
            <ArchitectConsultForm />
          </div>
        </div>
      </div>
    </section>
  );
}
