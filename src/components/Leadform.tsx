"use client";

import { useRef, useState, type FormEvent } from "react";
import {
  ArrowUpRight,
  Check,
  Loader2,
  MessageCircle,
  ShieldCheck,
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { siteConfig } from "@/config/site";
import { homeUI as ui } from "@/components/marketing/home/design";

export function LeadForm({ unitId }: { unitId?: string }) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{
    name?: string;
    phone?: string;
  }>({});
  const submissionPending = useRef(false);
  const whatsapp = `https://wa.me/${siteConfig.organization.telephone.replace(/\D/g, "")}?text=${encodeURIComponent("Halo Titik Huni, saya ingin konsultasi mengenai hunian.")}`;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submissionPending.current) return;
    const form = event.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const phone = String(data.get("phone") || "").replace(/[\s()-]/g, "");
    const message = String(data.get("message") || "").trim();

    const errors: { name?: string; phone?: string } = {};
    if (name.length < 2)
      errors.name = "Tuliskan nama Anda, minimal 2 karakter.";
    if (!/^\+?\d{10,15}$/.test(phone))
      errors.phone = "Gunakan nomor WhatsApp yang valid, berisi 10–15 digit.";
    setFieldErrors(errors);
    setErrorMessage("");
    if (errors.name || errors.phone) {
      form
        .querySelector<HTMLInputElement>(
          errors.name ? "#contact-name" : "#contact-phone",
        )
        ?.focus();
      return;
    }
    submissionPending.current = true;
    setLoading(true);
    setErrorMessage("");
    try {
      const supabase = createClient();
      const { error } = await supabase.from("leads").insert([
        {
          name,
          phone,
          message,
          source_url: window.location.href,
          utm_source:
            new URLSearchParams(window.location.search).get("utm_source") ||
            "website",
          unit_id: unitId || null,
          status: "new",
          source: "website",
        },
      ]);
      if (error) throw error;
      setSuccess(true);
      // Analytics must not turn a saved enquiry into a retryable form error.
      const pixel = (
        window as Window & { fbq?: (event: string, name: string) => void }
      ).fbq;
      try {
        pixel?.("track", "Lead");
      } catch {
        /* The enquiry is already saved. */
      }
    } catch {
      setErrorMessage(
        "Pesan belum terkirim. Coba lagi atau hubungi kami melalui WhatsApp. Isian Anda tetap tersimpan di formulir ini.",
      );
    } finally {
      submissionPending.current = false;
      setLoading(false);
    }
  }

  return (
    <section id="kontak" className={ui.section} aria-labelledby="contact-title">
      <div
        className={`${ui.container} grid items-start gap-10 lg:grid-cols-2 lg:gap-20`}
      >
        <div className="lg:py-8">
          <p className={ui.eyebrow}>Konsultasi & survei</p>
          <h2 id="contact-title" className={ui.heading}>
            Temukan rumah
            <br />
            yang sesuai untuk Anda.
          </h2>
          <p className={`${ui.copy} mt-6 max-w-lg`}>
            Sampaikan lokasi, anggaran, atau unit yang Anda minati. Tim Titik
            Huni akan menghubungi Anda melalui WhatsApp untuk membahas kebutuhan
            dan mengonfirmasi jadwal survei.
          </p>
          <div className="mt-8 flex items-start gap-4 border-t border-border pt-8">
            <MessageCircle
              size={24}
              className="mt-1 shrink-0 text-emerald-700"
              aria-hidden="true"
            />
            <div>
              <p className="text-base text-foreground-muted">
                Ingin bertanya langsung?
              </p>
              <a
                href={whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className={ui.link}
              >
                WhatsApp 0851 9080 0168{" "}
                <ArrowUpRight size={18} aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
        {success ? (
          <div
            className="rounded-lg border border-emerald-200 bg-emerald-50 p-6 sm:p-8"
            role="status"
            aria-live="polite"
          >
            <Check
              size={32}
              className="mb-6 text-emerald-700"
              aria-hidden="true"
            />
            <h3 className="text-2xl font-semibold tracking-tight text-foreground">
              Permintaan berhasil dikirim.
            </h3>
            <p className="mt-4 text-base leading-7 text-foreground-muted">
              Tim Titik Huni akan menghubungi nomor WhatsApp yang Anda cantumkan
              untuk membahas kebutuhan Anda. Jika meminta survei, jadwal
              kunjungan akan dikonfirmasi terlebih dahulu.
            </p>
            <a
              href={whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className={`${ui.link} mt-6`}
            >
              Lanjutkan lewat WhatsApp{" "}
              <ArrowUpRight size={18} aria-hidden="true" />
            </a>
            <button
              type="button"
              className="mt-4 block min-h-12 text-base font-medium text-foreground-muted underline underline-offset-4"
              onClick={() => setSuccess(false)}
            >
              Kirim permintaan lain
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            noValidate
            className="space-y-6 rounded-lg border border-border bg-surface p-6 sm:p-8"
            aria-label="Formulir konsultasi"
            aria-busy={loading}
          >
            <div>
              <h3 className="text-2xl font-semibold tracking-tight">
                Ceritakan kebutuhan Anda
              </h3>
              <p className="mt-2 text-sm leading-6 text-foreground-muted">
                Isi nama dan nomor WhatsApp. Detail lainnya opsional.
              </p>
            </div>
            <div>
              <label
                htmlFor="contact-name"
                className="mb-2 block text-base font-semibold"
              >
                Nama lengkap{" "}
                <span className="font-normal text-foreground-soft">(wajib)</span>
              </label>
              <input
                id="contact-name"
                name="name"
                required
                minLength={2}
                maxLength={100}
                autoComplete="name"
                placeholder="Nama Anda"
                disabled={loading}
                className={ui.input}
                aria-invalid={!!fieldErrors.name}
                aria-describedby={
                  fieldErrors.name ? "contact-name-error" : undefined
                }
                onChange={() => {
                  if (fieldErrors.name)
                    setFieldErrors((previous) => ({
                      ...previous,
                      name: undefined,
                    }));
                }}
              />
              {fieldErrors.name && (
                <p
                  id="contact-name-error"
                  role="alert"
                  className="mt-2 text-sm text-red-700"
                >
                  {fieldErrors.name}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="contact-phone"
                className="mb-2 block text-base font-semibold"
              >
                Nomor WhatsApp{" "}
                <span className="font-normal text-foreground-soft">(wajib)</span>
              </label>
              <input
                id="contact-phone"
                name="phone"
                type="tel"
                inputMode="tel"
                required
                maxLength={22}
                autoComplete="tel"
                placeholder="Contoh: 081234567890"
                disabled={loading}
                className={ui.input}
                aria-invalid={!!fieldErrors.phone}
                aria-describedby={`contact-phone-hint${fieldErrors.phone ? " contact-phone-error" : ""}`}
                onChange={() => {
                  if (fieldErrors.phone)
                    setFieldErrors((previous) => ({
                      ...previous,
                      phone: undefined,
                    }));
                }}
              />
              <p
                id="contact-phone-hint"
                className="mt-2 text-sm text-foreground-muted"
              >
                Untuk membahas kebutuhan dan mengonfirmasi jadwal survei.
              </p>
              {fieldErrors.phone && (
                <p
                  id="contact-phone-error"
                  role="alert"
                  className="mt-2 text-sm text-red-700"
                >
                  {fieldErrors.phone}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="contact-message"
                className="mb-2 block text-base font-semibold"
              >
                Kebutuhan Anda{" "}
                <span className="font-normal text-foreground-soft">(opsional)</span>
              </label>
              <textarea
                id="contact-message"
                name="message"
                rows={3}
                maxLength={2000}
                placeholder="Misalnya: rumah di Sleman, anggaran 800 juta, ingin survei akhir pekan."
                disabled={loading}
                className={`${ui.input} resize-y`}
              />
            </div>
            <div className="flex items-start gap-3 text-sm leading-6 text-foreground-muted">
              <ShieldCheck
                size={20}
                className="mt-0.5 shrink-0 text-emerald-700"
                aria-hidden="true"
              />
              <p>
                Dengan mengirim formulir, Anda mengizinkan tim Titik Huni
                menggunakan kontak ini untuk menindaklanjuti kebutuhan yang Anda
                sampaikan.
              </p>
            </div>
            {errorMessage && (
              <div
                role="alert"
                className="rounded-md border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-800"
              >
                {errorMessage}
                <a
                  href={whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 flex min-h-12 items-center gap-2 font-semibold underline"
                >
                  Hubungi melalui WhatsApp{" "}
                  <ArrowUpRight size={16} aria-hidden="true" />
                </a>
              </div>
            )}
            <button
              disabled={loading}
              type="submit"
              className={`${ui.primary} w-full`}
            >
              {loading ? (
                <>
                  Mengirim permintaan…{" "}
                  <Loader2
                    size={18}
                    className="motion-safe:animate-spin"
                    aria-hidden="true"
                  />
                </>
              ) : (
                <>
                  Kirim permintaan konsultasi{" "}
                  <ArrowUpRight size={18} aria-hidden="true" />
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
