"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { Toaster, toast } from "react-hot-toast";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Pastikan menggunakan metode dari supabaseClient yang sudah kita buat
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast.error("Login Gagal: " + error.message);
        return;
      }

      if (data?.session) {
        toast.success("Berhasil Masuk!");
        // Berikan jeda sedikit agar cookie tersimpan sebelum redirect
        setTimeout(() => {
          router.push("/admin/dashboard");
          router.refresh(); // Penting untuk memperbarui status session di server
        }, 500);
      }
    } catch (err) {
      toast.error("Terjadi kesalahan sistem.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white px-6">
      <Toaster position="top-center" />

      <form onSubmit={handleLogin} className="w-full max-w-sm space-y-6">
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
              type="email"
              placeholder="admin@titikhuni.com"
              className="w-full p-4 bg-neutral-50 border border-neutral-100 rounded-2xl outline-none focus:ring-2 focus:ring-black transition-all"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-neutral-400 ml-1">
              Password
            </label>
            <input
              required
              type="password"
              placeholder="••••••••"
              className="w-full p-4 bg-neutral-50 border border-neutral-100 rounded-2xl outline-none focus:ring-2 focus:ring-black transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
