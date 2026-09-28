"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Grid2X2, X } from "lucide-react";

export function UnitGallery({ images, title }: { images: string[]; title: string }) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const scrollFrameRef = useRef<number | null>(null);

  const scrollToImage = (index: number) => {
    const track = trackRef.current;
    if (!track) return;
    const nextIndex = Math.max(0, Math.min(images.length - 1, index));
    const target = track.children.item(nextIndex) as HTMLElement | null;
    if (!target) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    track.scrollTo({
      left: target.offsetLeft,
      behavior: reducedMotion ? "auto" : "smooth",
    });
  };

  const updateActiveImage = () => {
    const track = trackRef.current;
    if (!track) return;
    if (scrollFrameRef.current !== null) cancelAnimationFrame(scrollFrameRef.current);
    scrollFrameRef.current = requestAnimationFrame(() => {
      const center = track.scrollLeft + track.clientWidth / 2;
      const slides = Array.from(track.children) as HTMLElement[];
      const closestIndex = slides.reduce((closest, slide, index) => {
        const slideCenter = slide.offsetLeft + slide.offsetWidth / 2;
        const closestSlide = slides[closest];
        const closestCenter = closestSlide.offsetLeft + closestSlide.offsetWidth / 2;
        return Math.abs(slideCenter - center) < Math.abs(closestCenter - center) ? index : closest;
      }, 0);
      setActiveIndex(closestIndex);
    });
  };

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    const previousFocus = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();
    const closeOnEscape = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
      previousFocus?.focus();
    };
  }, [open]);

  useEffect(() => () => {
    if (scrollFrameRef.current !== null) cancelAnimationFrame(scrollFrameRef.current);
  }, []);

  if (!images.length) {
    return <div className="flex aspect-[4/3] items-center justify-center rounded-xl border border-border bg-surface-muted text-sm text-foreground-soft sm:aspect-[16/7]">Foto properti belum tersedia</div>;
  }

  return (
    <>
      <section className="relative" aria-label="Galeri foto properti">
        <div
          ref={trackRef}
          onScroll={updateActiveImage}
          onKeyDown={(event) => {
            if (event.key === "ArrowLeft") {
              event.preventDefault();
              scrollToImage(activeIndex - 1);
            }
            if (event.key === "ArrowRight") {
              event.preventDefault();
              scrollToImage(activeIndex + 1);
            }
          }}
          className="scrollbar-hide relative flex snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain rounded-xl"
          tabIndex={images.length > 1 ? 0 : -1}
          aria-label={images.length > 1 ? `${images.length} foto properti. Geser untuk melihat foto berikutnya.` : "1 foto properti"}
        >
          {images.map((image, index) => (
            <button
              key={`${image}-${index}`}
              type="button"
              onClick={() => setOpen(true)}
              className="relative block aspect-[4/3] w-full shrink-0 snap-start snap-always overflow-hidden rounded-xl bg-surface-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset sm:aspect-[16/9] lg:aspect-[21/9]"
              aria-label={`Buka galeri foto ${index + 1}`}
            >
              <Image
                src={image}
                alt={`${title} — foto ${index + 1}`}
                fill
                preload={index === 0}
                loading={index === 0 ? undefined : "lazy"}
                sizes="(max-width: 767px) 100vw, (max-width: 1535px) 94vw, 1340px"
                className="object-cover"
              />
            </button>
          ))}
        </div>

        <div className="mt-3 flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <span className="shrink-0 text-xs font-medium text-foreground-muted">
              {images.length === 1 ? "1 foto" : `${activeIndex + 1} dari ${images.length} foto`}
            </span>
            {images.length > 1 && images.length <= 8 && (
              <div className="hidden items-center gap-1.5 sm:flex" aria-hidden="true">
                {images.map((_, index) => (
                  <span key={index} className={`h-1.5 rounded-full ${index === activeIndex ? "w-5 bg-primary" : "w-1.5 bg-border-strong"}`} />
                ))}
              </div>
            )}
          </div>
          <div className="flex shrink-0 items-center gap-2">
            {images.length > 1 && (
              <>
                <button type="button" onClick={() => scrollToImage(activeIndex - 1)} disabled={activeIndex === 0} className="inline-flex size-11 items-center justify-center rounded-lg border border-border bg-white text-foreground hover:bg-surface disabled:cursor-not-allowed disabled:opacity-35 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary" aria-label="Foto sebelumnya">
                  <ChevronLeft size={18} aria-hidden="true" />
                </button>
                <button type="button" onClick={() => scrollToImage(activeIndex + 1)} disabled={activeIndex === images.length - 1} className="inline-flex size-11 items-center justify-center rounded-lg border border-border bg-white text-foreground hover:bg-surface disabled:cursor-not-allowed disabled:opacity-35 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary" aria-label="Foto berikutnya">
                  <ChevronRight size={18} aria-hidden="true" />
                </button>
              </>
            )}
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-border-strong bg-white px-3.5 text-sm font-semibold text-foreground hover:bg-surface focus:outline-none focus-visible:ring-2 focus-visible:ring-primary sm:px-4"
            >
              <Grid2X2 size={16} aria-hidden="true" />
              <span className="hidden sm:inline">Lihat semua foto</span>
              <span className="sm:hidden">Lihat semua</span>
            </button>
          </div>
        </div>
      </section>

      {open && (
        <div className="fixed inset-0 z-[90] flex flex-col bg-slate-950" role="dialog" aria-modal="true" aria-labelledby="gallery-title">
          <div className="flex items-center justify-between border-b border-white/15 px-4 py-3 text-white sm:px-6">
            <h2 id="gallery-title" className="text-sm font-semibold sm:text-base">Galeri {title}</h2>
            <button ref={closeButtonRef} type="button" onClick={() => setOpen(false)} className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-white/20 px-4 text-sm font-medium hover:bg-white/10"><X size={17} /> Tutup</button>
          </div>
          <div className="flex-1 overflow-y-auto p-3 sm:p-6">
            <div className="mx-auto grid max-w-6xl gap-3 sm:grid-cols-2">
              {images.map((image, index) => (
                <div key={`${image}-lightbox-${index}`} className="relative aspect-[4/3] overflow-hidden rounded-lg bg-slate-900">
                  <Image src={image} alt={`${title} — foto ${index + 1}`} fill sizes="(max-width: 639px) 100vw, 50vw" className="object-contain" loading="lazy" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
