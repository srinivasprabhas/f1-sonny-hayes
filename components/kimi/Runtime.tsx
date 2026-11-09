"use client";

import { useEffect, useRef } from "react";

/**
 * Mounts the hand-written runtime once the server markup is on the page.
 *
 * Scoped to its own page: with Cache Components, routes you navigate away
 * from stay in the DOM inside a hidden <Activity>, so a document-wide query
 * would find the previous page's elements too.
 */
export function Runtime() {
  const marker = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const root = marker.current?.closest<HTMLElement>("[data-page]");
    if (!root) return;
    let stop: (() => void) | undefined;
    let cancelled = false;
    import("@/lib/kimi/runtime").then(({ start }) => {
      if (!cancelled) stop = start(root);
    });
    return () => {
      cancelled = true;
      stop?.();
    };
  }, []);
  return <span ref={marker} hidden />;
}
