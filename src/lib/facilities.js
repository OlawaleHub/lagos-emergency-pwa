// src/lib/facilities.js
// Resolve the nearest facility of a given type to the user's coordinates,
// or fall back to the LGA the user picked when GPS is unavailable.

import { FACILITIES } from "./constants";
import { distanceKm } from "./geo";

/**
 * @param {{lat:number,lng:number}|null} coords  user GPS (or null)
 * @param {string} type                          "police" | "fire" | "medical"
 * @param {string} lga                           user-selected LGA (may be "")
 * @returns {{ facility: object|null, lga: string, distance: number|null }}
 */
export function resolveNearestFacility(coords, type, lga = "") {
  // 1. GPS available → search every known facility of this type and pick closest.
  if (coords && typeof coords.lat === "number") {
    let best = null;
    let bestLga = lga || "";
    let bestDist = Infinity;

    for (const [lgaName, depts] of Object.entries(FACILITIES)) {
      const fac = depts[type];
      if (!fac) continue;
      const d = distanceKm(coords, { lat: fac.lat, lng: fac.lng });
      if (d < bestDist) {
        best = fac;
        bestLga = lgaName;
        bestDist = d;
      }
    }

    if (best) {
      return { facility: best, lga: bestLga, distance: bestDist };
    }
  }

  // 2. No usable GPS → use the LGA the user picked.
  if (lga && FACILITIES[lga] && FACILITIES[lga][type]) {
    return { facility: FACILITIES[lga][type], lga, distance: null };
  }

  // 3. Last resort fallback.
  const fallbackLga = "Lagos Island";
  return {
    facility: FACILITIES[fallbackLga]?.[type] || null,
    lga: fallbackLga,
    distance: null,
  };
}

// Return all facilities of a type, sorted by distance from coords (if given).
export function facilitiesByDistance(coords, type) {
  const list = [];
  for (const [lgaName, depts] of Object.entries(FACILITIES)) {
    const fac = depts[type];
    if (!fac) continue;
    list.push({
      ...fac,
      type,
      lga: lgaName,
      distance: coords ? distanceKm(coords, { lat: fac.lat, lng: fac.lng }) : null,
    });
  }
  if (coords) list.sort((a, b) => a.distance - b.distance);
  return list;
}
