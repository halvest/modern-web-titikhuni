"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";

type ProjectGalleryProps = {
  images: string[];
  title: string;
  location: string;
};

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function ProjectGallery({ images, title, location }: ProjectGalleryProps) {
  const track = useRef<HTMLDivElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const touchStartX = useRef<number | null>(null);
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(images.length > 1);
  const [viewer, setViewer] = useState<number | null>(null);

  const total = images.length;
  const altFor = (index: number) =>
    `Foto ${index + 1} dari ${total} proyek ${title} di ${location}`;

  /* ── carousel state sync ─────────────────────────────── */
  const syncTrack = useCallback(() => {
    const el = track.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    const items = Array.from(el.children) as HTMLElement[];
    const paddingLeft = parseFloat(getComputedStyle(el).paddingLeft) || 0;

    let nearest = 0;
    let nearestDistance = Number.POSITIVE_INFINITY;
    items.forEach((item, index) => {
      const distance = Math.abs(item.offsetLeft - paddingLeft - el.scrollLeft);
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearest = index;
      }
    });

    // at the end of the track the last item may never reach the snap start
    if (max > 0 && el.scrollLeft >= max - 4) nearest = items.length - 1;

    setActive(nearest);
    setProgress(max > 0 ? el.scrollLeft / max : 1);
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft < max - 4);
  }, []);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(syncTrack);
    };
    syncTrack();
    el.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      el.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [syncTrack]);

  const scrollToItem = (index: number) => {
    const el = track.current;
    const item = el?.children[index] as HTMLElement | undefined;
    if (!el || !item) return;
    const paddingLeft = parseFloat(getComputedStyle(el).paddingLeft) || 0;
    el.scrollTo({
      left: item.offsetLeft - paddingLeft,
      behavior: prefersReducedMotion() ? "auto" : "smooth",
    });
  };

  /* ── lightbox ────────────────────────────────────────── */
  const openViewer = (index: number) => {
    setViewer(index);
    dialog.current?.showModal();
  };

  const closeViewer = () => dialog.current?.close();

  const stepViewer = useCallback(
    (delta: number) => {
      setViewer((current) =>
        current === null ? current : (current + delta + total) % total
      );
    },
    [total]
  );

  useEffect(() => {
    if (viewer === null) return;
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = "hidden";

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") stepViewer(1);
      if (event.key === "ArrowLeft") stepViewer(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      root.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [viewer, stepViewer]);

  if (total === 0) return null;

  return (
    <section
      id="galeri"
      aria-labelledby="project-gallery-title"
      className="scroll-mt-[var(--header-height)] py-12 md:py-16 lg:py-20"
    >
      {/* header */}
      <div className="site-container flex flex-wrap items-end justify-between gap-x-6 gap-y-4">
        <div>
          <p className="text-[0.62rem] font-bold uppercase tracking-[0.22em] text-primary">
            Galeri
          </p>
          <h2
            id="project-gallery-title"
            className="mt-2 text-2xl font-medium tracking-[-0.04em] text-foreground sm:text-[1.75rem] lg:text-3xl"
          >
            Dokumentasi proyek
          </h2>
          <p className="mt-1.5 text-sm text-foreground-soft">
            {total} foto · ketuk foto untuk memperbesar
          </p>
        </div>

        {total > 1 && (
          <div className="hidden items-center gap-2 md:flex">
            <button
              type="button"
              onClick={() => scrollToItem(Math.max(active - 1, 0))}
              disabled={!canPrev}
              aria-label="Foto sebelumnya"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-border-strong bg-white text-foreground transition hover:border-foreground disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:border-border-strong focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              <ChevronLeft size={18} aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => scrollToItem(Math.min(active + 1, total - 1))}
              disabled={!canNext}
              aria-label="Foto berikutnya"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-border-strong bg-white text-foreground transition hover:border-foreground disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:border-border-strong focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              <ChevronRight size={18} aria-hidden="true" />
            </button>
          </div>
        )}
      </div>

      {/* carousel — padding mirrors .site-container so cards align with text */}
      <div
        ref={track}
        role="list"
        className="mt-6 flex snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain px-5 pb-1 [scrollbar-width:none] scroll-px-5 sm:gap-4 sm:px-7 sm:scroll-px-7 md:mt-8 lg:gap-5 lg:px-10 lg:scroll-px-10 xl:px-[max(3rem,calc((100vw_-_90rem)/2_+_3rem))] xl:scroll-px-[max(3rem,calc((100vw_-_90rem)/2_+_3rem))] [&::-webkit-scrollbar]:hidden"
      >
        {images.map((src, index) => (
          <div
            key={src}
            role="listitem"
            className="w-[84%] shrink-0 snap-start sm:w-[62%] md:w-[46%] lg:w-[38%] xl:w-[34rem]"
          >
            <button
              type="button"
              onClick={() => openViewer(index)}
              aria-label={`Perbesar foto ${index + 1} dari ${total}`}
              className="group relative block aspect-[4/3] w-full overflow-hidden rounded-2xl bg-surface-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary md:aspect-[3/2] md:rounded-3xl"
            >
              <Image
                src={src}
                alt={altFor(index)}
                fill
                sizes="(max-width: 640px) 84vw, (max-width: 768px) 62vw, (max-width: 1024px) 46vw, (max-width: 1280px) 38vw, 544px"
                className="object-cover transition-transform duration-700 ease-out motion-safe:group-hover:scale-[1.04]"
              />
              <span className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/10" />
              <span className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-foreground opacity-100 shadow-sm transition-opacity duration-300 md:opacity-0 md:group-hover:opacity-100 md:group-focus-visible:opacity-100">
                <Expand size={15} aria-hidden="true" />
              </span>
            </button>
          </div>
        ))}
      </div>

      {/* progress + counter */}
      {total > 1 && (
        <div className="site-container mt-5 flex items-center gap-4">
          <div
            className="relative h-[3px] flex-1 overflow-hidden rounded-full bg-border"
            aria-hidden="true"
          >
            <span
              className="absolute inset-y-0 left-0 rounded-full bg-primary transition-[width] duration-200"
              style={{ width: `${Math.max(progress, 1 / total) * 100}%` }}
            />
          </div>
          <p
            className="shrink-0 text-xs font-semibold tabular-nums text-foreground-muted"
            aria-live="polite"
          >
            {active + 1} / {total}
          </p>
        </div>
      )}

      {/* lightbox */}
      <dialog
        ref={dialog}
        onClose={() => setViewer(null)}
        onClick={(event) => {
          if (event.target === event.currentTarget) closeViewer();
        }}
        aria-label={`Galeri foto ${title}`}
        className="m-0 h-[100dvh] max-h-none w-screen max-w-none bg-[#0b0c0b] p-0 text-white backdrop:bg-black"
      >
        {viewer !== null && (
          <div
            className="flex h-full flex-col"
            onTouchStart={(event) => {
              touchStartX.current = event.touches[0]?.clientX ?? null;
            }}
            onTouchEnd={(event) => {
              const start = touchStartX.current;
              const end = event.changedTouches[0]?.clientX;
              touchStartX.current = null;
              if (start === null || end === undefined) return;
              const delta = end - start;
              if (Math.abs(delta) > 50) stepViewer(delta < 0 ? 1 : -1);
            }}
          >
            <div className="flex items-center justify-between px-4 py-3 sm:px-6 sm:py-4">
              <p className="text-sm font-semibold tabular-nums text-white/80">
                {viewer + 1} / {total}
              </p>
              <button
                type="button"
                onClick={closeViewer}
                aria-label="Tutup galeri"
                autoFocus
                className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
              >
                <X size={20} aria-hidden="true" />
              </button>
            </div>

            <div
              className="relative flex-1"
              onClick={(event) => {
                if (event.target === event.currentTarget) closeViewer();
              }}
            >
              <Image
                key={images[viewer]}
                src={images[viewer]}
                alt={altFor(viewer)}
                fill
                sizes="100vw"
                className="object-contain px-2 sm:px-20"
              />
            </div>

            {total > 1 && (
              <div className="flex items-center justify-center gap-3 px-4 py-4 sm:py-5">
                <button
                  type="button"
                  onClick={() => stepViewer(-1)}
                  aria-label="Foto sebelumnya"
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
                >
                  <ChevronLeft size={22} aria-hidden="true" />
                </button>
                <p className="min-w-0 max-w-[50vw] truncate px-2 text-center text-xs text-white/60 sm:text-sm">
                  {title}
                </p>
                <button
                  type="button"
                  onClick={() => stepViewer(1)}
                  aria-label="Foto berikutnya"
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
                >
                  <ChevronRight size={22} aria-hidden="true" />
                </button>
              </div>
            )}
          </div>
        )}
      </dialog>
    </section>
  );
}
