// src/components/ServiceWorkerRegister.js
"use client";
import { useEffect } from "react";
import { getQueuedAlerts, deleteAlert } from "@/lib/indexeddb";

export default function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("serviceWorker" in navigator)) return;

    const register = async () => {
      try {
        await navigator.serviceWorker.register("/sw.js", { scope: "/" });
      } catch (err) {
        console.warn("SW registration failed:", err);
      }
    };

    register();

    const handleMessage = async (event) => {
      if (event.data?.type === "sync-complete") {
        // Background sync finished — flush any that still failed from the page side too.
        try {
          const remaining = await getQueuedAlerts();
          await Promise.all(
            remaining.map((a) =>
              fetch("/api/emergency", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(a),
              })
                .then((r) => (r.ok ? deleteAlert(a.id) : null))
                .catch(() => {})
            )
          );
          window.dispatchEvent(new CustomEvent("alerts-updated"));
        } catch {}
      }
    };

    navigator.serviceWorker.addEventListener("message", handleMessage);
    return () => navigator.serviceWorker.removeEventListener("message", handleMessage);
  }, []);

  return null;
}
