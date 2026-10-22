"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, ShieldAlert, ShieldCheck, RefreshCw } from "lucide-react";
import {
  CONSENT_CHANGE_EVENT,
  getConsentStatus,
  setConsentStatus,
  revokeConsent,
  type ConsentStatus,
} from "@/lib/tracking/consent";
import { injectGTM, trackVirtualPageView } from "@/lib/tracking/gtm";

export function ConsentPreferencePanel() {
  const [status, setStatus] = useState<ConsentStatus>("unset");
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    setStatus(getConsentStatus());

    const handleConsentChange = (event: Event) => {
      const customEvent = event as CustomEvent<{ status: ConsentStatus }>;
      if (customEvent.detail?.status) {
        setStatus(customEvent.detail.status);
      }
    };

    window.addEventListener(CONSENT_CHANGE_EVENT, handleConsentChange);
    return () => {
      window.removeEventListener(CONSENT_CHANGE_EVENT, handleConsentChange);
    };
  }, []);

  const handleGrant = () => {
    setConsentStatus("granted");
    setStatus("granted");
    setNotification("Persetujuan pelacakan analitik & pemasaran telah diaktifkan.");

    injectGTM(() => {
      trackVirtualPageView(window.location.pathname);
    });

    setTimeout(() => setNotification(null), 4000);
  };

  const handleRevoke = () => {
    revokeConsent();
    setStatus("denied");
    setNotification(
      "Persetujuan telah dicabut. Pelacakan dihentikan dan cookie telah dibersihkan."
    );
    setTimeout(() => setNotification(null), 4000);
  };

  return (
    <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8">
      <div className="flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <ShieldCheck size={22} aria-hidden="true" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-foreground">
            Panel Pengaturan Persetujuan
          </h3>
          <p className="text-xs text-foreground-soft">
            Kelola izin cookie pemasaran dan analitik di browser ini
          </p>
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-border bg-white p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-foreground-soft">
              Status Persetujuan Saat Ini
            </p>
            <div className="mt-1.5 flex items-center gap-2">
              {status === "granted" ? (
                <>
                  <CheckCircle2 size={18} className="text-emerald-600" aria-hidden="true" />
                  <span className="text-sm font-semibold text-emerald-700">
                    Disetujui (Opt-in Aktif)
                  </span>
                </>
              ) : status === "denied" ? (
                <>
                  <ShieldAlert size={18} className="text-rose-600" aria-hidden="true" />
                  <span className="text-sm font-semibold text-rose-700">
                    Ditolak / Dicabut (Pelacakan Nonaktif)
                  </span>
                </>
              ) : (
                <>
                  <RefreshCw size={18} className="text-amber-600" aria-hidden="true" />
                  <span className="text-sm font-semibold text-amber-700">
                    Belum Ditentukan (Tracking Nonaktif)
                  </span>
                </>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {status !== "granted" ? (
              <button
                type="button"
                onClick={handleGrant}
                className="inline-flex min-h-11 items-center justify-center rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-white transition-all hover:bg-primary-hover active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
              >
                Aktifkan Persetujuan
              </button>
            ) : (
              <button
                type="button"
                onClick={handleRevoke}
                className="inline-flex min-h-11 items-center justify-center rounded-lg border border-rose-300 bg-rose-50 px-4 py-2 text-xs font-semibold text-rose-700 transition-all hover:bg-rose-100 active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-rose-500"
              >
                Cabut Persetujuan
              </button>
            )}

            {status === "granted" && (
              <button
                type="button"
                onClick={handleRevoke}
                className="inline-flex min-h-11 items-center justify-center rounded-lg border border-border bg-white px-3.5 py-2 text-xs font-medium text-foreground transition hover:bg-surface"
              >
                Tolak Semua
              </button>
            )}
          </div>
        </div>

        {notification && (
          <div className="mt-4 rounded-lg bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-800 animate-in fade-in duration-200">
            {notification}
          </div>
        )}
      </div>

      <p className="mt-4 text-xs leading-relaxed text-foreground-soft">
        <strong>Catatan transparansi:</strong> Mencabut persetujuan akan langsung
        memblokir pengiriman event analitik/pemasaran berikutnya dan menghapus cookie
        pihak pertama di browser Anda. Namun, data yang telah terkirim ke server Meta
        sebelum pencabutan tidak dapat ditarik kembali secara teknis melalui browser.
      </p>
    </div>
  );
}
