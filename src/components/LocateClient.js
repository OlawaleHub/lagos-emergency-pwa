// src/components/LocateClient.js
"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { MapPin, Loader2, Navigation, Phone } from "lucide-react";
import { LAGOS_LGAS, FACILITIES, EMERGENCY_TYPES } from "@/lib/constants";
import { getPosition, distanceKm } from "@/lib/geo";

export default function LocateClient() {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const userMarkerRef = useRef(null);
  const facilityMarkersRef = useRef([]);
  const [coords, setCoords] = useState(null);
  const [lga, setLga] = useState("");
  const [locating, setLocating] = useState(false);
  const [error, setError] = useState("");
  const [nearest, setNearest] = useState([]);

  const center = coords || { lat: 6.5244, lng: 3.3792 }; // default: Lagos

  // Load Leaflet once.
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.L) {
      initMap();
      return;
    }
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
    document.head.appendChild(link);
    const script = document.createElement("script");
    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    script.onload = initMap;
    document.body.appendChild(script);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function initMap() {
    if (!window.L || mapInstance.current) return;
    mapInstance.current = window.L.map(mapRef.current, {
      zoomControl: true,
      attributionControl: true,
    }).setView([center.lat, center.lng], 12);
    window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
      maxZoom: 19,
    }).addTo(mapInstance.current);
    renderFacilities();
    renderUser();
  }

  function renderFacilities() {
    if (!mapInstance.current || !window.L) return;
    facilityMarkersRef.current.forEach((m) => m.remove());
    facilityMarkersRef.current = [];

    const colorMap = { police: "#2563eb", fire: "#ea580c", medical: "#16a34a" };
    EMERGENCY_TYPES.forEach((t) => {
      const fac = resolveFacility(t.key);
      if (!fac) return;
      const icon = window.L.divIcon({
        html: `<div style="background:${colorMap[t.key]};width:26px;height:26px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);border:2px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,.5)"></div>`,
        className: "",
        iconSize: [26, 26],
        iconAnchor: [13, 26],
      });
      const m = window.L.marker([fac.lat, fac.lng], { icon }).addTo(mapInstance.current);
      m.bindPopup(
        `<b>${fac.name}</b><br/>${t.label}<br/><a href="tel:${fac.phone}">Call ${fac.phone}</a>`
      );
      facilityMarkersRef.current.push(m);
    });
  }

  function renderUser() {
    if (!mapInstance.current || !window.L) return;
    if (userMarkerRef.current) userMarkerRef.current.remove();
    if (!coords) return;
    const icon = window.L.divIcon({
      html: `<div style="background:#dc2626;width:16px;height:16px;border-radius:50%;border:3px solid #fff;box-shadow:0 0 0 4px rgba(220,38,38,.3)"></div>`,
      className: "",
      iconSize: [16, 16],
      iconAnchor: [8, 8],
    });
    userMarkerRef.current = window.L
      .marker([coords.lat, coords.lng], { icon })
      .addTo(mapInstance.current)
      .bindPopup("Your location");
    mapInstance.current.setView([coords.lat, coords.lng], 13);
  }

  function resolveFacility(type) {
    const lgaKey = lga || "Lagos Island";
    const entry = FACILITIES[lgaKey] || FACILITIES["Lagos Island"];
    return entry ? entry[type] : null;
  }

  const locate = useCallback(async () => {
    setLocating(true);
    setError("");
    try {
      const c = await getPosition();
      setCoords(c);
      setNearest(computeNearest(c));
    } catch (e) {
      setError("Couldn't get GPS. Choose your LGA below to see facilities.");
    } finally {
      setLocating(false);
    }
  }, []);

  function computeNearest(c) {
    const list = [];
    EMERGENCY_TYPES.forEach((t) => {
      const fac = resolveFacility(t.key);
      if (fac) {
        list.push({ ...fac, type: t.key, label: t.label, dist: distanceKm(c, fac) });
      }
    });
    return list.sort((a, b) => a.dist - b.dist);
  }

  useEffect(() => {
    renderFacilities();
    renderUser();
    if (coords) setNearest(computeNearest(coords));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lga, coords]);

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-xl font-bold text-white">Locate Services</h1>
        <p className="text-sm text-neutral-400">Find the nearest police, fire, and medical facilities.</p>
      </div>

      <div className="flex gap-2">
        <button
          onClick={locate}
          className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl py-3 flex items-center justify-center gap-2"
        >
          {locating ? <Loader2 size={18} className="animate-spin" /> : <Navigation size={18} />}
          Use my GPS
        </button>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-xs text-neutral-400">or LGA:</span>
        <select
          value={lga}
          onChange={(e) => setLga(e.target.value)}
          className="flex-1 rounded-lg bg-neutral-900 border border-white/15 px-3 py-2 text-white text-sm"
        >
          <option value="">Select LGA…</option>
          {LAGOS_LGAS.map((l) => (
            <option key={l} value={l}>{l}</option>
          ))}
        </select>
      </div>

      {error && <p className="text-xs text-amber-400">{error}</p>}

      <div
        ref={mapRef}
        className="w-full h-72 rounded-xl overflow-hidden border border-white/15 bg-neutral-800"
        aria-label="Map of nearby emergency facilities"
      />

      {nearest.length > 0 ? (
        <div className="flex flex-col gap-2">
          <h2 className="text-sm font-bold text-white">Nearest facilities</h2>
          {nearest.map((f) => (
            <div key={f.type} className="rounded-xl border border-white/15 bg-neutral-900 p-3 flex items-center gap-3">
              <span className="bg-white/10 rounded-lg p-2">
                <MapPin size={18} className="text-white" />
              </span>
              <div className="flex-1">
                <p className="text-sm font-semibold text-white">{f.name}</p>
                <p className="text-xs text-neutral-400">{f.label} • {f.dist.toFixed(1)} km away</p>
              </div>
              <a
                href={`tel:${f.phone}`}
                className="bg-white text-black font-bold rounded-lg px-3 py-2 text-xs flex items-center gap-1"
              >
                <Phone size={14} /> Call
              </a>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-xs text-neutral-500">
          {lga || coords ? "Loading facilities…" : "Use GPS or pick an LGA to see facilities and distances."}
        </p>
      )}
    </div>
  );
}
