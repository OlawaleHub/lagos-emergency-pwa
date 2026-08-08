// src/components/OfflineIndicator.js
"use client";
import { useEffect, useState } from "react";
import { WifiOff, Wifi } from "lucide-react";

export default function OfflineIndicator() {
  const [online, setOnline] = useState(true);

  useEffect(() => {
    const update = () => setOnline(navigator.onLine);
    update();
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    return () => {
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
    };
  }, []);

  if (online) return null;

  return (
    <div className="flex items-center gap-2 bg-amber-500/15 border border-amber-500/40 text-amber-300 rounded-lg px-3 py-2 text-xs font-medium fade-in">
      <WifiOff size={16} />
      <span>You're offline. Alerts are queued and will auto-sync when you reconnect.</span>
    </div>
  );
}
