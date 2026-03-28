"use client";

import { useState } from "react";
import { loginAction } from "./actions"; // Sekarang file ini sudah ada
import { Toaster, toast } from "react-hot-toast";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);

  // Fungsi pembungkus untuk menangani loading state dan error toast
  async function handleSubmit(formData: FormData) {
    setLoading(true);
    const result = await loginAction(formData);

    if (result?.error) {
      toast.error("Login Gagal: " + result.error);
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-white px-6">
      <Toaster position="top-center" />

      <form action={handleSubmit} className="w-full max-w-sm space-y-6">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black uppercase tracking-tighter text-neutral-900">
            Admin <span className="text-neutral-400">Login</span>
          </h1>
          <p className="text-[10px] text-neutral-400 uppercase tracking-[0.2em] mt-2 font-bold">
            Titik Huni Management System
          </p>
        </div>

        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-neutral-400 ml-1">
              Email Address
            </label>
            <input
              required
              name="email" // Penting: name harus sesuai dengan formData.get('email')
              type="email"
              placeholder="admin@titikhuni.id"
              className="w-full p-4 bg-neutral-50 border border-neutral-100 rounded-2xl outline-none focus:ring-2 focus:ring-black transition-all"
              disabled={loading}
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-neutral-400 ml-1">
              Password
            </label>
            <input
              required
              name="password"
              type="password"
              placeholder="••••••••"
              className="w-full p-4 bg-neutral-50 border border-neutral-100 rounded-2xl outline-none focus:ring-2 focus:ring-black transition-all"
              disabled={loading}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-black text-white rounded-2xl font-bold uppercase tracking-widest hover:bg-neutral-800 transition-all shadow-xl shadow-black/10 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              Memproses...
            </>
          ) : (
            "Masuk Ke Dashboard"
          )}
        </button>
      </form>
    </div>
  );
}
