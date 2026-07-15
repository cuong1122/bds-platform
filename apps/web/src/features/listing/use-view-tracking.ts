"use client";

import { useEffect, useRef } from "react";
import { getSessionId } from "@/lib/session";

export function useViewTracking(listingId: number) {
  const startRef = useRef<number>(Date.now());
  const isVisibleRef = useRef<boolean>(true);
  const accumulatedRef = useRef<number>(0);

  useEffect(() => {
    startRef.current = Date.now();
    accumulatedRef.current = 0;
    isVisibleRef.current = document.visibilityState === "visible";

    function handleVisibilityChange() {
      const now = Date.now();
      if (document.visibilityState === "hidden" && isVisibleRef.current) {
        accumulatedRef.current += (now - startRef.current) / 1000;
        isVisibleRef.current = false;
      } else if (document.visibilityState === "visible" && !isVisibleRef.current) {
        startRef.current = now;
        isVisibleRef.current = true;
      }
    }

    function sendBeacon() {
      let duration = accumulatedRef.current;
      if (isVisibleRef.current) {
        duration += (Date.now() - startRef.current) / 1000;
      }
      if (duration < 1) return;

      const payload = JSON.stringify({
        session_id: getSessionId(),
        duration_seconds: Math.round(duration),
      });
      const url = `${process.env.NEXT_PUBLIC_API_URL}/listings/${listingId}/views`;

      if (navigator.sendBeacon) {
        navigator.sendBeacon(url, new Blob([payload], { type: "application/json" }));
      } else {
        fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: payload,
          keepalive: true,
        });
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("pagehide", sendBeacon);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("pagehide", sendBeacon);
      sendBeacon();
    };
  }, [listingId]);
}
