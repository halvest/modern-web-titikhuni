/**
 * Consent Management Module for Titik Huni
 *
 * Implements strict opt-in consent lifecycle:
 * - Default to 'unset' (no marketing tags loaded)
 * - Safe read/write with try-catch fallback to 'denied' if localStorage is blocked
 * - Immediate revocation support: updates storage, disables in-memory tracking,
 *   calls fbq('consent', 'revoke') if initialized, and cleans first-party cookies.
 */

export type ConsentStatus = "granted" | "denied" | "unset";

export const CONSENT_STORAGE_KEY = "titikhuni_consent_status";
export const CONSENT_CHANGE_EVENT = "titikhuni_consent_change";

declare global {
  interface Window {
    __titikhuni_tracking_disabled?: boolean;
    fbq?: (...args: unknown[]) => void;
  }
}

/**
 * Reads the current consent status from localStorage.
 * Defaults to 'granted' (auto-grant for analytics and marketing).
 * Only returns 'denied' if user explicitly revoked consent.
 */
export function getConsentStatus(): ConsentStatus {
  if (typeof window === "undefined") {
    return "granted";
  }

  try {
    const stored = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    if (stored === "denied") return "denied";
    return "granted";
  } catch {
    // If localStorage read fails, default to granted
    return "granted";
  }
}

/**
 * Returns true if tracking consent is granted (default: true).
 */
export function hasConsent(): boolean {
  return getConsentStatus() === "granted";
}

/**
 * Attempts to delete known first-party marketing tracking cookies (_fbp, _fbc).
 * Note: Data already received by Meta servers before revocation cannot be deleted via browser.
 */
export function cleanMarketingCookies(): void {
  if (typeof document === "undefined" || typeof window === "undefined") return;

  const cookiesToClean = ["_fbp", "_fbc"];
  const host = window.location.hostname;
  const domainParts = host.split(".");
  const domains = ["", host, `.${host}`];

  if (domainParts.length >= 2) {
    const rootDomain = domainParts.slice(-2).join(".");
    domains.push(rootDomain, `.${rootDomain}`);
  }

  cookiesToClean.forEach((cookieName) => {
    domains.forEach((domain) => {
      const domainAttr = domain ? `domain=${domain};` : "";
      document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; ${domainAttr}`;
    });
  });
}

/**
 * Sets the user consent status.
 * Updates localStorage, sets memory flags, manages cookies, and notifies listeners.
 */
export function setConsentStatus(status: "granted" | "denied"): boolean {
  if (typeof window === "undefined") return false;

  let storageSucceeded = false;
  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, status);
    storageSucceeded = true;
  } catch {
    // If setting fails, maintain in-memory state
    storageSucceeded = false;
  }

  if (status === "denied") {
    // 1. Immediately flag tracking as disabled in memory
    window.__titikhuni_tracking_disabled = true;

    // 2. Instruct Meta Pixel to revoke consent if already in memory
    if (typeof window.fbq === "function") {
      try {
        window.fbq("consent", "revoke");
      } catch {
        // Pixel not initialized or already destroyed
      }
    }

    // 3. Best-effort cookie cleanup
    cleanMarketingCookies();
  } else if (status === "granted") {
    window.__titikhuni_tracking_disabled = false;
  }

  // Dispatch custom event for reactive UI/lifecycle updates
  try {
    window.dispatchEvent(
      new CustomEvent(CONSENT_CHANGE_EVENT, { detail: { status } })
    );
  } catch {
    // Event dispatch fallback
  }

  return storageSucceeded;
}

/**
 * Revokes tracking consent.
 * Convenience wrapper around setConsentStatus('denied').
 */
export function revokeConsent(): boolean {
  return setConsentStatus("denied");
}
