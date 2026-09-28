"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="id">
      <body style={{ margin: 0, background: "#f8fafc", color: "#0f172a", fontFamily: "Arial, sans-serif" }}>
        <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24 }}>
          <section style={{ width: "min(100%, 480px)", border: "1px solid #e2e8f0", borderRadius: 16, background: "white", padding: 32, textAlign: "center", boxShadow: "0 8px 30px rgba(15,23,42,.08)" }}>
            <p style={{ margin: 0, color: "#059669", fontSize: 12, fontWeight: 700, letterSpacing: ".14em", textTransform: "uppercase" }}>Titik Huni</p>
            <h1 style={{ margin: "16px 0 8px", fontSize: 24 }}>Halaman mengalami gangguan</h1>
            <p style={{ margin: 0, color: "#64748b", fontSize: 14, lineHeight: 1.7 }}>Tampilan tetap aman. Coba muat ulang atau kembali ke dashboard.</p>
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 8, marginTop: 24 }}>
              <button type="button" onClick={reset} style={{ minHeight: 44, border: 0, borderRadius: 8, background: "#0f172a", color: "white", padding: "0 16px", fontWeight: 700, cursor: "pointer" }}>Coba lagi</button>
              <a href="/admin" style={{ minHeight: 44, display: "inline-flex", alignItems: "center", border: "1px solid #cbd5e1", borderRadius: 8, color: "#334155", padding: "0 16px", fontWeight: 700, textDecoration: "none" }}>Ke dashboard</a>
            </div>
          </section>
        </main>
      </body>
    </html>
  );
}
