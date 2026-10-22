"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import {
  CONSENT_CHANGE_EVENT,
  getConsentStatus,
} from "@/lib/tracking/consent";
import {
  injectGTM,
  trackVirtualPageView,
  trackWhatsAppClick,
} from "@/lib/tracking/gtm";

/**
 * GTMRouteTracker manages the single-flow PageView lifecycle and delegated WhatsApp CTA clicks.
 * Ensures:
 * 1. Zero PageView before consent is granted.
 * 2. Exactly one PageView on first load after opt-in.
 * 3. Exactly one PageView per SPA route transition.
 * 4. Deduplication between opt-in events and route transitions.
 * 5. Automatic tracking of any outbound WhatsApp CTA links on the site.
 */
export function GTMRouteTracker() {
  const pathname = usePathname();
  const lastTrackedPathRef = useRef<string | null>(null);

  // 1. Manage PageView on initial mount and SPA navigation
  useEffect(() => {
    const status = getConsentStatus();

    if (status === "granted") {
      // Ensure GTM is injected
      injectGTM(() => {
        // Only track if pathname is distinct from what was just tracked
        if (lastTrackedPathRef.current !== pathname) {
          lastTrackedPathRef.current = pathname;
          trackVirtualPageView(pathname);
        }
      });
    }

    // Listen to real-time consent updates (e.g. user clicks "Setuju" in banner or changes setting)
    const handleConsentChange = (event: Event) => {
      const customEvent = event as CustomEvent<{ status: string }>;
      const newStatus = customEvent.detail?.status;

      if (newStatus === "granted") {
        injectGTM(() => {
          if (lastTrackedPathRef.current !== pathname) {
            lastTrackedPathRef.current = pathname;
            trackVirtualPageView(pathname);
          }
        });
      } else if (newStatus === "denied") {
        // Reset tracked path on revocation
        lastTrackedPathRef.current = null;
      }
    };

    window.addEventListener(CONSENT_CHANGE_EVENT, handleConsentChange);
    return () => {
      window.removeEventListener(CONSENT_CHANGE_EVENT, handleConsentChange);
    };
  }, [pathname]);

  // 2. Global Delegated Click Listener for Outbound WhatsApp Links
  useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const anchor = target.closest<HTMLAnchorElement>('a[href*="wa.me"]');
      if (!anchor) return;

      // Extract explicit CTA location or infer from surrounding element/ID
      let ctaLocation =
        anchor.getAttribute("data-cta-location") ||
        anchor.getAttribute("data-wa-source");

      if (!ctaLocation) {
        if (anchor.closest("header") || anchor.closest("#mobile-navigation")) {
          ctaLocation = "navbar_header";
        } else if (anchor.closest("footer") || anchor.closest("#site-footer")) {
          ctaLocation = "footer_contact";
        } else if (anchor.closest("#kontak")) {
          ctaLocation = "homepage_contact";
        } else if (anchor.closest("aside")) {
          ctaLocation = "unit_detail_sidebar";
        } else if (anchor.closest(".fixed")) {
          ctaLocation = "floating_sticky_cta";
        } else {
          ctaLocation = "general_whatsapp_link";
        }
      }

      const ctaText = anchor.textContent?.trim() || "WhatsApp CTA";
      const href = anchor.href || "https://wa.me";

      trackWhatsAppClick(ctaLocation, ctaText, href);
    };

    document.addEventListener("click", handleDocumentClick, { capture: true });
    return () => {
      document.removeEventListener("click", handleDocumentClick, { capture: true });
    };
  }, []);

  return null;
}
