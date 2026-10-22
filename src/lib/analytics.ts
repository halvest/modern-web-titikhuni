/**
 * Unified Analytics Bridge for Titik Huni
 *
 * Ensures all analytics calls route through the strict opt-in consent-gated
 * GTM tracking module.
 */

import { trackWhatsAppClick as gtmTrackWhatsAppClick } from "./tracking/gtm";

export function trackWhatsAppClick(
  source: string,
  metadata?: Record<string, string>
) {
  gtmTrackWhatsAppClick(source, metadata?.text, metadata?.url);
}
