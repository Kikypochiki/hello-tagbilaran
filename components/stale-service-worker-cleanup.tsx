"use client";

import { useEffect } from "react";

const cleanupMarker = "hello-tagbilaran-retired-service-worker-v1";

/**
 * Removes the service worker used by an earlier prototype. That worker can
 * otherwise serve deleted Turbopack chunks after the prototype is rolled back.
 */
export function StaleServiceWorkerCleanup() {
  useEffect(() => {
    if (process.env.NEXT_PUBLIC_ENABLE_LEGACY_SW_CLEANUP === "false") return;
    if (!("serviceWorker" in navigator)) return;

    let cancelled = false;

    async function retirePrototypeWorker() {
      const registrations = await navigator.serviceWorker.getRegistrations();
      const sameOriginRegistrations = registrations.filter(
        (registration) => new URL(registration.scope).origin === window.location.origin,
      );
      const hasPrototypeWorker =
        Boolean(navigator.serviceWorker.controller) || sameOriginRegistrations.length > 0;

      if (!hasPrototypeWorker) return;

      await Promise.all(
        sameOriginRegistrations.map((registration) => registration.unregister()),
      );

      if ("caches" in window) {
        const cacheNames = await window.caches.keys();
        await Promise.all(cacheNames.map((name) => window.caches.delete(name)));
      }

      if (cancelled || window.sessionStorage.getItem(cleanupMarker)) return;
      window.sessionStorage.setItem(cleanupMarker, "done");
      window.location.reload();
    }

    void retirePrototypeWorker().catch(() => {
      // Storage and service-worker APIs can be blocked by browser policy.
      // Cleanup failure must never prevent the guide itself from rendering.
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return null;
}
