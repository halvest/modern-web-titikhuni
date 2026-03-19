"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Calendar,
  ChevronRight,
  ShieldCheck,
  MessageCircleQuestion,
  MapPin,
  Phone,
  User,
  Home,
  CheckCircle2,
} from "lucide-react";
import toast from "react-hot-toast";
import { supabase } from "@/lib/supabaseClient";
import { useSearchParams } from "next/navigation";

// Data Listing untuk Picker
const UNIT_LISTINGS = [
  { id: "candibinangun", name: "Kluster Candibinangun" },
  { id: "bangunjiwo", name: "Kluster Bangunjiwo" },
  { id: "tirtomartani", name: "Kluster Tirtomartani" },
  { id: "trirenggo", name: "Kluster Trirenggo" },
  { id: "jasa_bangun", name: "Jasa Bangun Rumah (Custom)" },
];

const phonePattern = /^(?:\+62|0)[0-9]{9,14}$/;

export const LeadForm: React.FC = () => {
  return (
    <Suspense fallback={null}>
      <LeadFormContent />
    </Suspense>
  );
};

const LeadFormContent = () => {
  const [form, setForm] = useState({
    nama: "",
    domisili: "",
    whatsapp: "",
    unit: "",
    jadwal: "",
    keterangan: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);

  const searchParams = useSearchParams();
  const dateInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      const alreadyClosed = sessionStorage.getItem("consultation_popup_closed");
      if (!hasOpened && !alreadyClosed) {
        setIsOpen(true);
        setHasOpened(true);
      }
    }, 15000);
    return () => clearTimeout(timer);
  }, [hasOpened]);

  const handleClose = () => {
    setIsOpen(false);
    setIsSuccess(false);
    sessionStorage.setItem("consultation_popup_closed", "true");
  };

  const handleOpen = () => setIsOpen(true);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.nama || !form.whatsapp || !form.unit) {
      toast.error("Mohon lengkapi Nama, WhatsApp, dan Pilih Unit.");
      return;
    }
    if (!phonePattern.test(form.whatsapp)) {
      toast.error("Nomor WhatsApp tidak valid.");
      return;
    }

    setIsSubmitting(true);

    try {
      const utmSource = searchParams.get("utm_source") || "direct";
      const { error } = await supabase.from("leads").insert({
        nama: form.nama.trim(),
        domisili: form.domisili.trim(),
        whatsapp: form.whatsapp.trim(),
        keterangan: `Unit: ${form.unit}${form.jadwal ? ` | Jadwal: ${form.jadwal}` : ""} | Pesan: ${form.keterangan}`,
        source: `Popup (${utmSource})`,
        status: "Baru",
      });

      if (error) throw new Error(error.message);

      setIsSuccess(true);
      setTimeout(handleClose, 3000);
      setForm({
        nama: "",
        domisili: "",
        whatsapp: "",
        unit: "",
        jadwal: "",
        keterangan: "",
      });
    } catch (error: any) {
      toast.error("Gagal mengirim data.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <>
      <motion.button
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        onClick={handleOpen}
        className="fixed bottom-6 left-6 z-[45] bg-[#1a1a1a] text-white p-4 rounded-full shadow-2xl flex items-center gap-3 hover:bg-black transition-all group"
      >
        <MessageCircleQuestion size={24} strokeWidth={1.5} />
        <span className="hidden sm:inline text-xs font-bold uppercase tracking-[0.2em]">
          Tanya Titik Huni
        </span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center sm:p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleClose}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              className="relative w-full max-w-md bg-white rounded-t-[2rem] sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90dvh]"
            >
              <div className="bg-[#1a1a1a] p-8 text-white relative">
                <button
                  onClick={handleClose}
                  className="absolute right-6 top-6 text-white/40 hover:text-white"
                >
                  <X size={24} />
                </button>
                <h3 className="text-xl font-light tracking-[0.3em] uppercase">
                  Konsultasi
                </h3>
                <p className="text-neutral-400 text-[10px] mt-2 tracking-[0.2em] uppercase leading-relaxed">
                  Rancang hunian yang tenang dan cukup bersama kami.
                </p>
              </div>

              <div className="px-8 py-8 overflow-y-auto no-scrollbar">
                <AnimatePresence mode="wait">
                  {!isSuccess ? (
                    <motion.form
                      key="f"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      onSubmit={handleSubmit}
                      className="space-y-4"
                    >
                      <div className="relative border-b border-neutral-100 py-2">
                        <User className="absolute left-0 top-4 w-4 h-4 text-neutral-300" />
                        <input
                          type="text"
                          name="nama"
                          value={form.nama}
                          onChange={handleChange}
                          placeholder="Nama Lengkap"
                          className="w-full pl-8 py-2 bg-transparent outline-none text-sm placeholder:text-neutral-300"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="relative border-b border-neutral-100 py-2">
                          <Phone className="absolute left-0 top-4 w-4 h-4 text-neutral-300" />
                          <input
                            type="tel"
                            name="whatsapp"
                            value={form.whatsapp}
                            onChange={handleChange}
                            placeholder="WhatsApp"
                            className="w-full pl-8 py-2 bg-transparent outline-none text-sm placeholder:text-neutral-300"
                            required
                          />
                        </div>
                        <div className="relative border-b border-neutral-100 py-2">
                          <MapPin className="absolute left-0 top-4 w-4 h-4 text-neutral-300" />
                          <input
                            type="text"
                            name="domisili"
                            value={form.domisili}
                            onChange={handleChange}
                            placeholder="Domisili"
                            className="w-full pl-8 py-2 bg-transparent outline-none text-sm placeholder:text-neutral-300"
                          />
                        </div>
                      </div>

                      <div className="relative border-b border-neutral-100 py-2">
                        <Home className="absolute left-0 top-4 w-4 h-4 text-neutral-300" />
                        <select
                          name="unit"
                          value={form.unit}
                          onChange={handleChange}
                          className="w-full pl-8 py-2 bg-transparent outline-none text-sm text-neutral-700 appearance-none"
                          required
                        >
                          <option value="" disabled>
                            Pilih Unit / Kluster
                          </option>
                          {UNIT_LISTINGS.map((unit) => (
                            <option key={unit.id} value={unit.name}>
                              {unit.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* FIXED DATE PICKER SECTION */}
                      <div className="relative border-b border-neutral-100 py-2 group">
                        <Calendar className="absolute left-0 top-4 w-4 h-4 text-neutral-300" />
                        <div className="relative w-full">
                          <input
                            ref={dateInputRef}
                            type="date"
                            name="jadwal"
                            min={today}
                            value={form.jadwal}
                            onChange={handleChange}
                            onClick={() => dateInputRef.current?.showPicker()}
                            className={`w-full pl-8 py-2 bg-transparent outline-none text-sm text-neutral-700 cursor-pointer appearance-none transition-all ${
                              !form.jadwal ? "opacity-0" : "opacity-100"
                            }`}
                          />
                          {!form.jadwal && (
                            <span
                              onClick={() => dateInputRef.current?.showPicker()}
                              className="absolute left-8 top-1/2 -translate-y-1/2 text-sm text-neutral-300 pointer-events-none"
                            >
                              Jadwal Survey (Opsional)
                            </span>
                          )}
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-[#1a1a1a] text-white py-5 mt-4 rounded-xl font-bold tracking-widest text-[10px] uppercase hover:bg-black transition-all flex items-center justify-center gap-3 shadow-xl disabled:opacity-50"
                      >
                        {isSubmitting ? (
                          "Mengirim..."
                        ) : (
                          <>
                            Kirim Permintaan <ChevronRight size={14} />
                          </>
                        )}
                      </button>

                      <p className="text-[9px] text-neutral-400 text-center flex items-center justify-center gap-2">
                        <ShieldCheck size={12} /> Data Anda aman & tidak akan
                        disalahgunakan.
                      </p>
                    </motion.form>
                  ) : (
                    <motion.div
                      key="s"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="py-12 text-center"
                    >
                      <div className="w-16 h-16 bg-neutral-50 text-black rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 size={32} strokeWidth={1.5} />
                      </div>
                      <h4 className="text-sm font-bold tracking-[0.2em] uppercase">
                        Terkirim
                      </h4>
                      <p className="text-neutral-500 text-xs mt-3 leading-relaxed">
                        Terima kasih. Konsultan kami akan menghubungi Anda
                        melalui WhatsApp.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
