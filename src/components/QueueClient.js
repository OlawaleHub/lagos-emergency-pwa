// src/components/QueueClient.js
"use client";
import { useEffect, useState, useCallback } from "react";
import { Trash2, RefreshCw, CheckCircle, Loader2 } from "lucide-react";
import { getQueuedAlerts, deleteAlert, clearQueued } from "@/lib/indexeddb";

export default function QueueClient() {
  const [alerts, setAlerts] = useState([]);
  const [syncing, setSyncing] = useState(false);

  const load = useCallback(async () => {
    try {
      const q = await getQueuedAlerts();
      q.sort((a, b) => b.timestamp - a.timestamp);
      setAlerts(q);
    } catch {}
  }, []);

  useEffect(() => {
    load();
    const onUpdate = () => load();
    window.addEventListener("alerts-updated", onUpdate);
    window.addEventListener("online", onUpdate);
    return () => {
      window.removeEventListener("alerts-updated", onUpdate);
      window.removeEventListener("online", onUpdate);
    };
  }, [load]);

  const remove = async (id) => {
    await deleteAlert(id);
    load();
  };

  const clearAll = async () => {
    await clearQueued();
    load();
  };

  const syncNow = async () => {
    setSyncing(true);
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
    setSyncing(false);
    load();
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Queued Alerts</h1>
          <p className="text-sm text-neutral-400">
            {alerts.length} pending — auto-syncs when online.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={syncNow}
            disabled={syncing || alerts.length === 0}
            className="bg-white text-black font-bold rounded-lg px-3 py-2 text-xs flex items-center gap-1 disabled:opacity-40"
          >
            {syncing ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
            Sync now
          </button>
          {alerts.length > 0 && (
            <button
              onClick={clearAll}
              className="bg-red-600/20 text-red-400 font-bold rounded-lg px-3 py-2 text-xs flex items-center gap-1"
            >
              <Trash2 size={14} /> Clear
            </button>
          )}
        </div>
      </div>

      {alerts.length === 0 ? (
        <div className="rounded-xl border border-white/10 bg-neutral-900 p-6 text-center text-neutral-400 flex flex-col items-center gap-2">
          <CheckCircle size={32} className="text-green-500" />
          <p className="text-sm">No alerts queued. Everything is synced.</p>
        </div>
      ) : (
        <ul className="flex flex-col gap-2">
          {alerts.map((a) => (
            <li
              key={a.id}
              className="rounded-xl border border-white/15 bg-neutral-900 p-3 flex items-center gap-3"
            >
              <span className="text-xs font-bold uppercase text-amber-400 bg-amber-500/15 px-2 py-1 rounded-full">
                queued
              </span>
              <div className="flex-1">
                <p className="text-sm font-semibold text-white">{a.label}</p>
                <p className="text-xs text-neutral-400">
                  {a.coords ? `GPS ${a.coords.lat.toFixed(3)}, ${a.coords.lng.toFixed(3)}` : `LGA ${a.lga}`}
                  {" • "}
                  {new Date(a.timestamp).toLocaleString()}
                </p>
                {a.facility && <p className="text-xs text-neutral-500">→ {a.facility}</p>}
              </div>
              <button
                onClick={() => remove(a.id)}
                className="text-neutral-400 hover:text-red-400"
                aria-label="Delete queued alert"
              >
                <Trash2 size={16} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
