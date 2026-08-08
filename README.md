# Lagos Emergency Reporter — One-Tap PWA (Offline-First)

A production-ready Next.js (App Router) PWA that lets people in Lagos report
emergencies to the **nearest Police, Fire, or Medical** service with a single
tap — **even with zero internet**.

## How it satisfies the user story (P0, 8 pts)

| Requirement | Implementation |
|---|---|
| Three big color-coded buttons (Police/Fire/Medical) | `src/components/EmergencyButtons.js` — full-width, large touch targets, confirm-on-tap |
| Works with zero internet | Service Worker (`public/sw.js`) precaches the app shell + IndexedDB queue (`src/lib/indexeddb.js`) |
| Auto-sync when connectivity returns | Background Sync API (`sync` event in `sw.js`) + `online` event replay in the client |
| Captures GPS on tap | `src/lib/geo.js` — `navigator.geolocation.getCurrentPosition` with timeout |
| Falls back to LGA dropdown if no GPS | `LAGOS_LGAS` selector in `EmergencyButtons.js` + `FACILITIES` lookup in `src/lib/constants.js` |
| Connect to departments via mobile devices | `tel:` links on every alert result + facility cards (calls the local emergency line) |
| Map to get their locations | `/locate` page using Leaflet + OpenStreetMap (no API key) showing user + facility pins |
| Easily accessible & simple in emergencies | Single-screen home, 3 giant buttons, offline banner, installable PWA |

## Tech stack

- **Next.js 14** (App Router) + **React 18**
- **Tailwind CSS** for styling
- **lucide-react** for icons
- **IndexedDB** for the offline alert queue
- **Service Worker + Background Sync** for auto-replay
- **Leaflet / OpenStreetMap** for the map (loaded via CDN, no API key)

## Run locally

```bash
npm install
npm run dev
# open http://localhost:3000
```

> Service workers only register on `localhost` or HTTPS — local dev works fine.

### Test offline mode
1. Open the app, tap an emergency button, send an alert (works online → sends immediately).
2. In Chrome DevTools → Application → Service Workers → check **Offline**, then reload.
3. Tap a button again — the alert is **queued** in IndexedDB (see it on `/queue`).
4. Uncheck **Offline** — the queued alert **auto-syncs** via Background Sync.

## Deploy to Vercel

No `vercel.json` needed — Vercel handles Next.js natively.

```bash
git init && git add -A && git commit -m "Lagos Emergency Reporter PWA"
# push to GitHub, then import the repo at vercel.com → Deploy
```

## Project structure

```
src/
├── app/
│   ├── layout.js            # Root layout + metadata + SW registration
│   ├── page.js              # Home — the 3 emergency buttons
│   ├── globals.css          # Tailwind + emergency button styles
│   ├── offline/page.js      # Offline fallback shell
│   ├── locate/page.js       # Map of nearest facilities
│   ├── queue/page.js        # View/manage queued alerts
│   ├── not-found.js         # 404
│   └── api/emergency/route.js  # POST endpoint for alerts (online + SW replay)
├── components/
│   ├── EmergencyButtons.js  # Core: 3 buttons + GPS/LGA + queue logic
│   ├── LocateClient.js      # Leaflet map, nearest-facility routing
│   ├── QueueClient.js       # Queue management + manual sync
│   ├── OfflineIndicator.js # Online/offline banner
│   ├── ServiceWorkerRegister.js
│   ├── Navbar.js / Footer.js
└── lib/
    ├── constants.js         # LGAs, facility coords, emergency contacts
    ├── indexeddb.js         # Offline alert queue
    └── geo.js               # GPS capture + haversine distance
public/
├── sw.js                    # Offline-first service worker + Background Sync
├── manifest.json            # PWA manifest
└── icons/                   # SVG app icons
```

## Production notes

- Replace the phone numbers in `src/lib/constants.js` with verified, current
  Lagos emergency lines, and expand `FACILITIES` to all 20 LGAs.
- Wire `POST /api/emergency` (`src/app/api/emergency/route.js`) to a real dispatch
  system (agency API or SMS gateway). Currently it acknowledges and logs.
- For installable iOS PWA, add a `180x180` PNG apple-touch icon (SVG works on Android).
