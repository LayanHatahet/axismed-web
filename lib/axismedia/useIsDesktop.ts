"use client";

import { useCallback, useSyncExternalStore } from "react";

/** SSR-safe media query: the server (and first client paint) sees `false`. */
export function useIsDesktop(query = "(min-width: 1024px)"): boolean {
  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      const mq = window.matchMedia(query);
      mq.addEventListener("change", onStoreChange);
      return () => mq.removeEventListener("change", onStoreChange);
    },
    [query]
  );

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false
  );
}
