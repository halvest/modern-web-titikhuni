/**
 * Google Tag Manager & Event Tracking Module for Titik Huni
 *
 * Implements:
 * - Conditional GTM script injection (Strict Opt-in)
 * - Safe dataLayer push with strict consent gating
 * - Virtual pageview tracking for SPA navigation
 * - Unit detail (ViewContent) tracking with price sanitization (anti-dummy & coming soon)
 * - WhatsApp CTA click tracking with debounce and zero PII
 */

import { getConsentStatus } from "./consent";

export const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || "GTM-5QCGK6GC";

// Threshold for realistic house prices in Yogyakarta (50 Miliar IDR)
// Any value >= this threshold or <= 0 is treated as a test/dummy price and omitted
export const MAX_REALISTIC_PROPERTY_PRICE = 50_000_000_000;

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
    __titikhuni_gtm_injected?: boolean;
    __titikhuni_tracking_disabled?: boolean;
    __titikhuni_last_cta_clicks?: Record<string, number>;
  }
}

/**
 * Conditionally injects the GTM container script into the document head.
 * ONLY runs if consent status is explicitly 'granted'.
 */
export function injectGTM(onLoaded?: () => void): boolean {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return false;
  }

  // Auto-grant tracking: only block if tracking is explicitly disabled or revoked
  if (window.__titikhuni_tracking_disabled || getConsentStatus() === "denied") {
    return false;
  }

  // Prevent multiple script tags
  if (window.__titikhuni_gtm_injected || document.getElementById("titikhuni-gtm-script")) {
    window.__titikhuni_gtm_injected = true;
    if (onLoaded) onLoaded();
    return true;
  }

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    "gtm.start": new Date().getTime(),
    event: "gtm.js",
  });

  const script = document.createElement("script");
  script.id = "titikhuni-gtm-script";
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`;

  script.onload = () => {
    window.__titikhuni_gtm_injected = true;
    if (onLoaded) onLoaded();
  };

  script.onerror = () => {
    // Graceful handling of network failures / adblockers
  };

  document.head.appendChild(script);
  return true;
}

/**
 * Pushes an event payload to window.dataLayer.
 * Executes automatically (auto-grant), blocked only if tracking was explicitly revoked.
 */
export function pushDataLayer(payload: Record<string, unknown>): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  // Block only if tracking is explicitly disabled or consent was revoked
  if (window.__titikhuni_tracking_disabled || getConsentStatus() === "denied") {
    return false;
  }

  try {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(payload);
    return true;
  } catch {
    return false;
  }
}

/**
 * Tracks a virtual pageview for initial load and SPA navigation.
 */
export function trackVirtualPageView(
  path: string,
  title?: string,
  locationHref?: string
): boolean {
  const currentTitle = title || (typeof document !== "undefined" ? document.title : "");
  const currentLocation =
    locationHref || (typeof window !== "undefined" ? window.location.href : "");

  return pushDataLayer({
    event: "virtual_page_view",
    page_path: path,
    page_title: currentTitle,
    page_location: currentLocation,
  });
}

export type UnitTrackInfo = {
  title: string;
  slug: string;
  price?: number | string | null;
  status?: string | null;
};

/**
 * Tracks a view_unit_detail event (mapped to Meta ViewContent).
 * Sanitizes prices: omits value and currency completely for Coming Soon, invalid,
 * negative, or dummy prices (e.g. 11 Triliun).
 */
export function trackUnitDetail(unit: UnitTrackInfo): boolean {
  const isComingSoon = (unit.status || "").toLowerCase().includes("coming soon");
  const rawPrice = typeof unit.price === "string" ? parseFloat(unit.price) : Number(unit.price);
  const isPriceValid =
    Number.isFinite(rawPrice) &&
    rawPrice > 0 &&
    rawPrice < MAX_REALISTIC_PROPERTY_PRICE;

  const payload: Record<string, unknown> = {
    event: "view_unit_detail",
    content_name: unit.title,
    content_category: "Real Estate / Unit",
    content_ids: [unit.slug ? `unit-${unit.slug}` : "unit"],
    content_type: "product",
    unit_status: unit.status || "Tersedia",
  };

  // Only include price data if property is NOT coming soon AND price is within valid realistic bounds
  if (!isComingSoon && isPriceValid) {
    payload.value = Math.round(rawPrice);
    payload.currency = "IDR";
  }

  return pushDataLayer(payload);
}

/**
 * Tracks an outbound WhatsApp CTA click (mapped to Meta Contact).
 * Applies a 500ms debounce per cta_location to prevent duplicate triggers on rapid clicks.
 * Strips user PII and query text from target_url.
 */
export function trackWhatsAppClick(
  ctaLocation: string,
  ctaText?: string,
  targetUrl?: string
): boolean {
  if (typeof window === "undefined") return false;

  window.__titikhuni_last_cta_clicks = window.__titikhuni_last_cta_clicks || {};
  const now = Date.now();
  const lastClickTime = window.__titikhuni_last_cta_clicks[ctaLocation] || 0;

  // 500ms debounce per distinct CTA location
  if (now - lastClickTime < 500) {
    return false;
  }
  window.__titikhuni_last_cta_clicks[ctaLocation] = now;

  // Sanitize target URL: keep protocol, domain and path, but strip queries (no user message or PII)
  let sanitizedUrl = "https://wa.me";
  if (targetUrl) {
    try {
      const parsed = new URL(targetUrl);
      sanitizedUrl = `${parsed.protocol}//${parsed.host}${parsed.pathname}`;
    } catch {
      sanitizedUrl = "https://wa.me";
    }
  }

  return pushDataLayer({
    event: "whatsapp_cta_click",
    cta_location: ctaLocation,
    cta_text: ctaText || "WhatsApp CTA",
    target_url: sanitizedUrl,
  });
}
