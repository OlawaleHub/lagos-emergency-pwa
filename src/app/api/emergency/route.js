// src/app/api/emergency/route.js
import { NextResponse } from "next/server";

// POST /api/emergency
// Receives an emergency alert from the client (online) or replayed by the
// service worker's Background Sync when connectivity returns.
// In production, wire this to dispatch to the relevant agency / SMS gateway.
export async function POST(request) {
  try {
    const body = await request.json();

    // Minimal validation — keep it permissive so offline replays never get rejected.
    if (!body || !body.type) {
      return NextResponse.json({ ok: false, error: "missing type" }, { status: 400 });
    }

    // TODO: replace with real dispatch — e.g. forward to emergency ops centre,
    // SMS gateway, or agency API. For now we acknowledge and log server-side.
    console.log("[emergency] received:", {
      id: body.id,
      type: body.type,
      lga: body.lga,
      coords: body.coords,
      facility: body.facility,
      timestamp: body.timestamp,
    });

    return NextResponse.json({ ok: true, id: body.id, status: "sent" });
  } catch (err) {
    return NextResponse.json({ ok: false, error: "invalid payload" }, { status: 400 });
  }
}

export async function GET() {
  return NextResponse.json({ ok: true, service: "lagos-emergency-reporter" });
}
