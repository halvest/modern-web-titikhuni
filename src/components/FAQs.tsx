import Image from "next/image";
import Link from "next/link";
import { Plus } from "lucide-react";
import { ScrollReveal } from "@/components/ScrollReveal";

const faqItems = [
  {
    question: "Bagaimana cara melihat rumah yang tersedia?",
    answer:
      "Buka halaman Pilihan Rumah untuk melihat lokasi, harga, foto, dan spesifikasi masing-masing hunian. Hubungi tim kami untuk memastikan ketersediaan unit yang Anda minati.",
  },
  {
    question: "Apakah saya bisa berkunjung ke lokasi?",
    answer:
      "Bisa. Sampaikan unit yang ingin Anda lihat dan waktu kunjungan melalui WhatsApp. Tim kami akan membantu mengonfirmasi jadwal dan titik temu.",
  },
  {
    question: "Bagaimana dengan pilihan pembayarannya?",
    answer:
      "Pilihan dan tahapan pembayaran bergantung pada unit yang dipilih. Diskusikan rencana Anda dengan tim kami agar rincian biaya, dokumen, dan ketentuannya jelas sebelum mengambil keputusan.",
  },
  {
    question: "Sudah punya lahan. Bisakah dibantu membangun?",
    answer:
      "Ya. Titik Huni menyediakan layanan arsitek dan kontraktor di Yogyakarta. Konsultasi dimulai dari kebutuhan ruang, kondisi lahan, dan anggaran, lalu dilanjutkan ke desain serta rencana biaya.",
  },
  {
    question: "Apa yang perlu disiapkan untuk konsultasi awal?",
    answer:
      "Cukup ceritakan lokasi yang diminati, perkiraan anggaran, dan kebutuhan ruang Anda. Untuk jasa bangun, tambahkan informasi lokasi serta ukuran lahan jika sudah tersedia.",
  },
];

export function FAQs() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  return (
    <section
      id="faq"
      className="scroll-mt-[var(--header-height)] bg-transparent pt-10 pb-8 text-foreground md:pt-12 md:pb-10 lg:pb-10"
      aria-labelledby="faq-title"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="site-container">
        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.45fr)] lg:gap-14">
          <ScrollReveal>
          <div>
            <div className="relative h-12 w-36 lg:h-14 lg:w-40">
              <Image
                src="/assets/icons/dark-titik-huni.png"
                alt="Logo Titik Huni"
                fill
                sizes="(max-width: 1023px) 9rem, 11rem"
                className="object-contain object-left"
              />
            </div>

            <header className="mt-7 lg:mt-8">
              <p className="site-eyebrow text-primary before:bg-primary">Informasi &amp; bantuan</p>
              <h2
                id="faq-title"
                className="mt-4 max-w-[30rem] text-balance text-[clamp(2rem,3vw,2.75rem)] font-medium leading-[1.08] tracking-[-0.045em]"
              >
                Pertanyaan yang sering ditanyakan.
              </h2>
              <p className="mt-4 max-w-md text-pretty text-sm leading-7 text-foreground-muted sm:text-base">
                Jawaban seputar pilihan rumah, kunjungan lokasi, pembayaran, dan layanan bangun rumah di Yogyakarta.
              </p>
            </header>
          </div>
          </ScrollReveal>

          <div className="min-w-0">
            {faqItems.map((item, index) => (
              <details
                key={item.question}
                name="home-faq"
                open={index === 0}
                className="group border-b border-border"
              >
                <summary className="flex min-h-[4.75rem] cursor-pointer list-none items-center justify-between gap-4 py-4 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary [&::-webkit-details-marker]:hidden">
                  <span className="flex min-w-0 items-start gap-3 sm:gap-4">
                    <span className="mt-1 text-[0.65rem] font-semibold tabular-nums tracking-[0.12em] text-primary">
                      0{index + 1}
                    </span>
                    <span className="text-[0.9375rem] font-medium leading-6 tracking-[-0.02em] text-foreground transition-colors duration-300 group-hover:text-primary group-open:text-primary sm:text-base sm:leading-7">
                      {item.question}
                    </span>
                  </span>
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border-strong text-primary transition-all duration-300 group-open:rotate-45 group-open:border-primary group-open:bg-primary group-open:text-white">
                    <Plus size={15} aria-hidden="true" />
                  </span>
                </summary>
                <div className="pb-5 pl-8 pr-10 sm:pb-6 sm:pl-9 sm:pr-14">
                  <p className="max-w-2xl text-sm leading-7 text-foreground-muted sm:text-[0.9375rem]">
                    {index === 3 ? (
                      <>
                        Ya. Titik Huni menyediakan{" "}
                        <Link
                          href="/arsitek-kontraktor"
                          className="font-medium text-primary underline underline-offset-4 transition-colors hover:text-primary-hover"
                        >
                          layanan arsitek dan kontraktor
                        </Link>{" "}
                        di Yogyakarta. Konsultasi dimulai dari kebutuhan ruang, kondisi lahan, dan anggaran, lalu dilanjutkan ke desain serta rencana biaya.
                      </>
                    ) : (
                      item.answer
                    )}
                  </p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
