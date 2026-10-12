/**
 * Lightweight client tracking for user interactions like WhatsApp CTA clicks.
 * Does not block navigation or create fake DB leads.
 */
export function trackWhatsAppClick(source: string, metadata?: Record<string, string>) {
  if (typeof window === "undefined") return;

  try {
    // 1. Dispatch custom DOM event for any analytics listener (GTM / Meta Pixel)
    const event = new CustomEvent("whatsapp_click", {
      detail: { source, timestamp: Date.now(), ...metadata },
    });
    window.dispatchEvent(event);

    // 2. DataLayer push if Google Tag Manager / GA is present
    if (Array.isArray((window as unknown as { dataLayer?: unknown[] }).dataLayer)) {
      (window as unknown as { dataLayer: unknown[] }).dataLayer.push({
        event: "whatsapp_cta_click",
        cta_source: source,
        ...metadata,
      });
    }
  } catch {
    // Non-blocking fail-safe
  }
}
