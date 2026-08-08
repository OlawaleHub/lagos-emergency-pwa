// src/components/EmergencyButtons.js
"use client";
import { useState, useCallback } from "react";
import { Shield, Flame, HeartPulse, Loader2, Check, MapPin, Phone } from "lucide-react";
import { EMERGENCY_TYPES, LAGOS_LGAS } from "@/lib/constants";
import { getPosition } from "@/lib/geo";
import { resolveNearestFacility } from "@/lib/facilities";
import { queueAlert, getQueuedAlerts, deleteAlert } from "@/lib/indexeddb";

const ICONS = { police: Shield, fire: Flame, medical: HeartPulse };

function uid() {
  return `alert_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export default function EmergencyButtons() {
  const [status, setStatus] = useState("idle"); // idle | locating | submitting | done | error
  const [lastResult, setLastResult] = useState(null);
  const [geo, setGeo] = useState(null);
  const [lga, setLga] = useState("");
  const [showLga, setShowLga] = useState(false);
  const [queued, setQueued] = useState(0);
  const [confirmType, setConfirmType] = useState(null);

  const refreshQueue = useCallback(async () => {
    try {
      const q = await getQueuedAlerts();
      setQueued(q.length);
    } catch {}
  }, []);

  const handleTap = useCallback(
    async (type) => {
      setConfirmType(type);
    },
    []
  );

  const confirmAndSend = useCallback(
    async (type) => {
      setConfirmType(null);
      setStatus("locating");
      setLastResult(null);

      let coords = null;
      let usedLga = lga || "";
      try {
        coords = await getPosition();
        setGeo(coords);
      } catch {
        coords = null;
        // Fall back to LGA dropdown if no GPS.
        if (!usedLga) {
          setShowLga(true);
          setStatus("idle");
          return;
        }
      }

      setStatus("submitting");
      // Resolve the nearest facility from real GPS coords (not a hardcoded LGA).
      const resolved = resolveNearestFacility(coords, type, usedLga);
      const facility = resolved.facility || {};
      const alert = {
        id: uid(),
        type,
        label: EMERGENCY_TYPES.find((t) => t.key === type)?.label,
        coords,
        lga: resolved.lga,
        facility: facility.name || null,
        distance: resolved.distance,
        timestamp: Date.now(),
        status: "queued",
      };

      try {
        await queueAlert(alert);
      } catch {}

      // Try immediate send; if it fails, the SW background sync will replay it.
      const online = typeof navigator !== "undefined" ? navigator.onLine : true;
      if (online) {
        try {
          const res = await fetch("/api/emergency", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(alert),
          });
          if (res.ok) {
            await deleteAlert(alert.id);
            setStatus("done");
            setLastResult({ ...alert, status: "sent", facility });
            refreshQueue();
            // Register for background sync as a safety net for future drops.
            registerSync();
            return;
          }
        } catch {
          // fall through to queued state
        }
      }

      setStatus("done");
      setLastResult({ ...alert, status: "queued", facility });
      refreshQueue();
      registerSync();
    },
    [lga, refreshQueue]
  );

  function registerSync() {
    if (typeof navigator !== "undefined" && "serviceWorker" in navigator && "SyncManager" in window) {
      navigator.serviceWorker.ready
        .then((reg) => reg.sync.register("emergency-sync"))
        .catch(() => {});
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4">
        {EMERGENCY_TYPES.map((t) => {
          const Icon = ICONS[t.key];
          const isConfirming = confirmType === t.key;
          return (
            <div key={t.key} className="relative">
              <button
                type="button"
                onClick={() => (isConfirming ? null : handleTap(t.key))}
                disabled={status === "locating" || status === "submitting"}
                aria-label={`Report ${t.label} emergency`}
                className={`emergency-btn w-full rounded-2xl py-7 px-6 flex items-center gap-5 text-white shadow-lg bg-${t.color} ${
                  isConfirming ? "ring-4 ring-white/60 pulse-urgent" : ""
                }`}
                style={{ backgroundColor: t.accent }}
              >
                <span className="bg-white/20 rounded-xl p-3">
                  <Icon size={40} strokeWidth={2.2} />
                </span>
                <span className="flex-1 text-left">
                  <span className="block text-2xl font-extrabold tracking-tight">{t.label}</span>
                  <span className="block text-sm font-medium text-white/85">Tap to report</span>
                </span>
                <span className="bg-white/25 rounded-full h-12 w-12 flex items-center justify-center font-bold">
                  {t.phone}
                </span>
              </button>

              {isConfirming && (
                <div className="absolute inset-0 flex flex-col gap-2 justify-center items-center bg-black/70 rounded-2xl fade-in px-4">
                  <p className="text-white font-bold text-lg text-center">
                    Send {t.label} alert?
                  </p>
                  <div className="flex gap-3 w-full max-w-xs">
                    <button
                      onClick={() => confirmAndSend(t.key)}
                      className="flex-1 bg-white text-black font-bold rounded-xl py-3 flex items-center justify-center gap-1"
                    >
                      <Check size={18} /> Yes, send
                    </button>
                    <button
                      onClick={() => setConfirmType(null)}
                      className="flex-1 bg-white/15 text-white font-bold rounded-xl py-3"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Status row */}
      {status === "locating" && (
        <div className="flex items-center gap-2 text-neutral-300 text-sm fade-in">
          <Loader2 size={18} className="animate-spin" /> Capturing GPS location…
        </div>
      )}
      {status === "submitting" && (
        <div className="flex items-center gap-2 text-neutral-300 text-sm fade-in">
          <Loader2 size={18} className="animate-spin" /> Sending alert…
        </div>
      )}

      {status === "done" && lastResult && (
        <div className="rounded-xl border border-white/15 bg-neutral-900 p-4 fade-in">
          <div className="flex items-center gap-2 mb-2">
            {lastResult.status === "sent" ? (
              <span className="bg-green-600/20 text-green-400 text-xs font-bold px-2 py-1 rounded-full">
                SENT
              </span>
            ) : (
              <span className="bg-amber-500/20 text-amber-400 text-xs font-bold px-2 py-1 rounded-full">
                QUEUED (OFFLINE)
              </span>
            )}
            <span className="text-white font-semibold">{lastResult.label} alert</span>
          </div>
          {lastResult.coords ? (
            <p className="text-xs text-neutral-400 flex items-center gap-1">
              <MapPin size={12} /> {lastResult.coords.lat.toFixed(4)}, {lastResult.coords.lng.toFixed(4)}
              {lastResult.lga ? ` • ${lastResult.lga}` : ""}
            </p>
          ) : (
            <p className="text-xs text-neutral-400 flex items-center gap-1">
              <MapPin size={12} /> LGA: {lastResult.lga}
            </p>
          )}
          {lastResult.facility?.name && (
            <p className="text-xs text-neutral-300 mt-1">
              Nearest {lastResult.label} facility:{" "}
              <span className="text-white font-medium">{lastResult.facility.name}</span>
              {typeof lastResult.distance === "number" && (
                <span className="text-neutral-400"> ({lastResult.distance.toFixed(1)} km away)</span>
              )}
            </p>
          )}
          <a
            href={`tel:${lastResult.facility?.phone || "112"}`}
            className="mt-3 inline-flex items-center gap-2 bg-white text-black font-bold rounded-lg px-4 py-2 text-sm"
          >
            <Phone size={16} /> Call {lastResult.facility?.phone || "112"}
          </a>
        </div>
      )}

      {/* LGA fallback selector */}
      {showLga && (
        <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 p-4 fade-in">
          <p className="text-sm text-amber-200 mb-2 font-medium">
            Couldn't get GPS. Pick your LGA to send the alert:
          </p>
          <select
            value={lga}
            onChange={(e) => setLga(e.target.value)}
            className="w-full rounded-lg bg-neutral-900 border border-white/15 px-3 py-2 text-white text-sm"
          >
            <option value="">Select LGA…</option>
            {LAGOS_LGAS.map((l) => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>
          <p className="text-xs text-neutral-400 mt-2">
            Select an LGA, then tap the emergency button again.
          </p>
          <button
            onClick={() => setShowLga(false)}
            className="mt-2 text-xs text-neutral-300 underline"
          >
            Hide
          </button>
        </div>
      )}

      {/* Queue summary */}
      <div className="flex items-center justify-between text-xs text-neutral-400 mt-1">
        <span>{queued > 0 ? `${queued} alert(s) queued — will auto-sync` : "No alerts queued"}</span>
        <button onClick={refreshQueue} className="underline">Refresh</button>
      </div>
    </div>
  );
}
