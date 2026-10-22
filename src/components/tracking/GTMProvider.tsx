"use client";

import { ReactNode } from "react";
import { GTMRouteTracker } from "./GTMRouteTracker";

/**
 * GTMProvider wraps public marketing routes to provide:
 * 1. Automatic GTM Script Injection (Auto-grant)
 * 2. Deduplicated SPA PageView tracking
 * 3. Delegated outbound CTA click tracking
 *
 * Placed exclusively in src/app/(marketing)/layout.tsx to maintain 100% isolation of /admin/* routes.
 */
export function GTMProvider({ children }: { children: ReactNode }) {
  return (
    <>
      <GTMRouteTracker />
      {children}
    </>
  );
}
