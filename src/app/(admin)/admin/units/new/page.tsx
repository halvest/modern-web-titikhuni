"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Tag,
  Maximize,
  Coins,
  Upload,
  X,
  ChevronLeft,
  ArrowRight,
  Loader2,
  Image as ImageIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { toast, Toaster } from "react-hot-toast";
import { useUpload } from "@/hooks/use-upload";
import { saveUnit } from "../actions";

export default function NewUnitPage() {
  const { uploadImage } = useUpload();

  // States
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [activePreview, setActivePreview] = useState(0);

  // Form Data State - Menampung SEMUA input untuk validasi real-time
  const [values, setValues] = useState({
    title: "",
    location: "",
    slug: "",
    description: "",
    land_area: "",
    building_area: "",
    bedroom_count: "",
    bathroom_count: "",
    price: "",
    status: "Tersedia",
  });

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  // --- Logic Validasi Tahapan ---
  const isStep1Valid = imageUrls.length > 0;
  const isStep2Valid =
    values.title.trim() !== "" &&
    values.location.trim() !== "" &&
    values.slug.trim() !== "";
  const isStep3Valid = values.price !== "" && parseInt(values.price) > 0;

  const nextStep = () => {
    if (step === 1 && !isStep1Valid)
      return toast.error("Harap unggah minimal 1 foto.");
    if (step === 2 && !isStep2Valid)
      return toast.error("Mohon isi Judul, Lokasi, dan Slug.");
    setStep((p) => Math.min(p + 1, 3));
  };

  const prevStep = () => setStep((p) => Math.max(p - 1, 1));

  useEffect(() => {
    if (imageUrls.length > 0) setActivePreview(imageUrls.length - 1);
  }, [imageUrls.length]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    if (imageUrls.length + files.length > 10)
      return toast.error("Maksimal 10 gambar.");

    setUploading(true);
    const toastId = toast.loading(`Mengunggah gambar...`);

    try {
      const newUrls: string[] = [];
      for (const file of files) {
        const url = await uploadImage(file);
        newUrls.push(url);
      }
      setImageUrls((prev) => [...prev, ...newUrls]);
      toast.success("Media berhasil ditambahkan!", { id: toastId });
    } catch (err) {
      toast.error("Gagal unggah gambar.", { id: toastId });
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index: number) => {
    setImageUrls((prev) => prev.filter((_, i) => i !== index));
    if (activePreview >= imageUrls.length - 1) setActivePreview(0);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isStep3Valid) return toast.error("Harga harus diisi dengan benar.");

    setLoading(true);

    // Kita buat FormData secara manual dari state 'values' agar pasti sinkron
    const finalData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      finalData.append(key, value);
    });

    // Masukkan data gambar
    finalData.append("image_url", imageUrls[0]);
    imageUrls.forEach((url) => finalData.append("gallery", url));

    const result = await saveUnit(finalData);

    if (result?.error) {
      toast.error(result.error);
      setLoading(false);
    } else {
      toast.success("Listing berhasil dipublikasikan!");
    }
  };

  return (
    <main className="flex flex-col lg:flex-row h-screen w-full bg-white overflow-hidden fixed inset-0">
      <Toaster position="top-center" />

      {/* LEFT: VISUAL PREVIEW */}
      <section className="w-full lg:w-1/2 h-[40vh] lg:h-full bg-neutral-50 relative border-r border-neutral-100 shrink-0">
        <div className="absolute top-6 left-6 z-20 flex items-center gap-4">
          <Link
            href="/admin/units"
            className="p-2.5 bg-white/90 backdrop-blur rounded-full border shadow-sm hover:bg-black hover:text-white transition-all"
          >
            <ChevronLeft size={18} />
          </Link>
          <div className="bg-black/5 backdrop-blur-md px-4 py-2 rounded-full border border-black/5">
            <StepIndicator currentStep={step} />
          </div>
        </div>

        <div className="h-full w-full flex items-center justify-center p-6 lg:p-20">
          <AnimatePresence mode="wait">
            {imageUrls.length > 0 ? (
              <motion.div
                key={imageUrls[activePreview]}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                className="relative w-full h-full lg:aspect-[4/3] rounded-[32px] overflow-hidden shadow-2xl border-[8px] lg:border-[16px] border-white"
              >
                <Image
                  src={imageUrls[activePreview]}
                  alt="Preview"
                  fill
                  className="object-cover"
                  priority
                />
              </motion.div>
            ) : (
              <div className="w-full h-full lg:aspect-[4/3] border-2 border-dashed border-neutral-200 rounded-[32px] flex flex-col items-center justify-center bg-white/50">
                <ImageIcon size={48} className="text-neutral-300 mb-4" />
                <p className="text-[10px] uppercase tracking-[0.4em] text-neutral-400 font-black text-center">
                  Menunggu Media
                </p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* RIGHT: MULTI-STEP FORM */}
      <section className="w-full lg:w-1/2 h-[60vh] lg:h-full flex flex-col relative overflow-hidden bg-white">
        <form
          id="unit-form"
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto no-scrollbar"
        >
          <div className="px-8 lg:px-20 py-12 lg:py-24 max-w-2xl mx-auto w-full">
            <AnimatePresence mode="wait">
              {/* PHASE 01: MEDIA */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-10"
                >
                  <header className="space-y-2">
                    <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral-300">
                      Phase 01
                    </h2>
                    <h1 className="text-4xl lg:text-5xl font-black uppercase tracking-tighter leading-none text-neutral-900">
                      Assets Gallery
                    </h1>
                  </header>

                  <label className="group w-full border-2 border-dashed border-neutral-100 rounded-[32px] p-10 lg:p-16 flex flex-col items-center justify-center cursor-pointer hover:bg-neutral-50 hover:border-black transition-all">
                    <div className="bg-black text-white p-4 rounded-2xl mb-4 group-hover:scale-110 transition-transform">
                      {uploading ? (
                        <Loader2 className="animate-spin" size={24} />
                      ) : (
                        <Upload size={24} />
                      )}
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 text-center">
                      Upload Foto Unit (Min 1)
                    </p>
                    <input
                      type="file"
                      multiple
                      className="hidden"
                      onChange={handleFileChange}
                      accept="image/*"
                      disabled={uploading}
                    />
                  </label>

                  <div className="grid grid-cols-4 lg:grid-cols-5 gap-3">
                    {imageUrls.map((url, i) => (
                      <div
                        key={url}
                        onClick={() => setActivePreview(i)}
                        className={`relative aspect-square rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${activePreview === i ? "border-black scale-105 shadow-lg" : "border-transparent opacity-40 grayscale"}`}
                      >
                        <Image
                          src={url}
                          alt="Thumb"
                          fill
                          className="object-cover"
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeImage(i);
                          }}
                          className="absolute top-1 right-1 bg-black/50 p-1 rounded-md text-white hover:bg-red-500 transition-colors"
                        >
                          <X size={10} />
                        </button>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* PHASE 02: IDENTITY */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-10"
                >
                  <header className="space-y-2">
                    <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral-300">
                      Phase 02
                    </h2>
                    <h1 className="text-4xl lg:text-5xl font-black uppercase tracking-tighter leading-none text-neutral-900">
                      Property Context
                    </h1>
                  </header>
                  <div className="space-y-8">
                    <FormInput
                      label="Listing Title *"
                      name="title"
                      value={values.title}
                      onChange={handleInputChange}
                      placeholder="Contoh: Casa De Kayana"
                      required
                    />
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <FormInput
                        label="Location *"
                        name="location"
                        value={values.location}
                        onChange={handleInputChange}
                        placeholder="Sleman, Yogyakarta"
                        required
                      />
                      <FormInput
                        label="URL Slug *"
                        name="slug"
                        value={values.slug}
                        onChange={handleInputChange}
                        placeholder="rumah-minimalis-sleman"
                        required
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[9px] uppercase tracking-[0.3em] text-neutral-400 font-black">
                        Description
                      </label>
                      <textarea
                        name="description"
                        value={values.description}
                        onChange={handleInputChange}
                        rows={6}
                        className="w-full bg-neutral-50 rounded-[24px] p-6 text-sm outline-none border border-transparent focus:border-black/5 focus:bg-white transition-all resize-none"
                        placeholder="Jelaskan keunggulan unit..."
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* PHASE 03: COMMERCIAL */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-10"
                >
                  <header className="space-y-2">
                    <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral-300">
                      Phase 03
                    </h2>
                    <h1 className="text-4xl lg:text-5xl font-black uppercase tracking-tighter leading-none text-neutral-900">
                      Commercial Specs
                    </h1>
                  </header>
                  <div className="space-y-8">
                    <div className="grid grid-cols-2 gap-6">
                      <FormInput
                        label="Land Area (m²)"
                        name="land_area"
                        value={values.land_area}
                        onChange={handleInputChange}
                        type="number"
                        placeholder="0"
                      />
                      <FormInput
                        label="Building (m²)"
                        name="building_area"
                        value={values.building_area}
                        onChange={handleInputChange}
                        type="number"
                        placeholder="0"
                      />
                      <FormInput
                        label="Bedrooms"
                        name="bedroom_count"
                        value={values.bedroom_count}
                        onChange={handleInputChange}
                        type="number"
                        placeholder="0"
                      />
                      <FormInput
                        label="Bathrooms"
                        name="bathroom_count"
                        value={values.bathroom_count}
                        onChange={handleInputChange}
                        type="number"
                        placeholder="0"
                      />
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4">
                      <FormInput
                        label="Base Price (IDR) *"
                        name="price"
                        value={values.price}
                        onChange={handleInputChange}
                        type="number"
                        placeholder="Contoh: 500000000"
                        required
                      />
                      <div className="space-y-3">
                        <label className="text-[9px] uppercase tracking-[0.3em] text-neutral-400 font-black">
                          Status
                        </label>
                        <select
                          name="status"
                          value={values.status}
                          onChange={handleInputChange}
                          className="w-full bg-neutral-50 p-4 rounded-xl text-xs font-black uppercase tracking-widest outline-none border border-transparent focus:border-black/5 transition-all appearance-none cursor-pointer"
                        >
                          <option value="Tersedia">Available</option>
                          <option value="Sold">Sold Out</option>
                          <option value="Booked">Booked</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </form>

        {/* FOOTER NAV */}
        <div className="p-6 lg:p-10 border-t border-neutral-100 flex justify-between items-center bg-white shrink-0 shadow-[0_-10px_40px_rgba(0,0,0,0.02)]">
          <button
            type="button"
            onClick={prevStep}
            disabled={step === 1}
            className={`flex items-center gap-3 text-[10px] font-black uppercase tracking-widest transition-all ${step === 1 ? "opacity-0 pointer-events-none" : "opacity-100 hover:-translate-x-1"}`}
          >
            <ChevronLeft size={16} /> Back
          </button>

          <div className="flex items-center gap-4">
            {step < 3 ? (
              <button
                type="button"
                onClick={nextStep}
                className={`bg-neutral-900 text-white px-10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3 transition-all ${(step === 1 && !isStep1Valid) || (step === 2 && !isStep2Valid) ? "opacity-30 cursor-not-allowed" : "hover:bg-black hover:scale-[1.02]"}`}
              >
                Next Step <ArrowRight size={16} />
              </button>
            ) : (
              <button
                type="submit"
                form="unit-form"
                disabled={loading || uploading || !isStep3Valid}
                className="bg-emerald-500 text-white px-10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3 hover:bg-emerald-600 transition-all disabled:opacity-20 shadow-xl shadow-emerald-500/20"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={16} />
                ) : (
                  <>
                    Publish Listing <ArrowRight size={16} />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

/* --- REUSABLE COMPONENTS --- */

function StepIndicator({ currentStep }: { currentStep: number }) {
  return (
    <div className="flex gap-1.5 items-center">
      {[1, 2, 3].map((s) => (
        <div
          key={s}
          className={`h-1 rounded-full transition-all duration-700 ${currentStep >= s ? "w-6 bg-black" : "w-2 bg-black/10"}`}
        />
      ))}
      <span className="ml-2 text-[9px] font-black uppercase tracking-widest text-neutral-400">
        Step 0{currentStep}
      </span>
    </div>
  );
}

function FormInput({ label, ...props }: any) {
  return (
    <div className="space-y-3">
      <label className="text-[9px] uppercase tracking-[0.3em] text-neutral-400 font-black">
        {label}
      </label>
      <input
        {...props}
        className="w-full bg-transparent border-b border-neutral-200 py-3 text-sm font-bold outline-none focus:border-black transition-all placeholder:text-neutral-200"
      />
    </div>
  );
}
