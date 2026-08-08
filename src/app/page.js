// src/app/page.js
import EmergencyButtons from "@/components/EmergencyButtons";
import OfflineIndicator from "@/components/OfflineIndicator";

export default function HomePage() {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
          Emergency? Tap one button.
        </h1>
        <p className="text-sm text-neutral-400 mt-1">
          Connect to the nearest Police, Fire, or Medical service in Lagos. Works offline — your alert is queued and auto-syncs when you reconnect.
        </p>
      </div>

      <OfflineIndicator />
      <EmergencyButtons />

      <div className="text-xs text-neutral-500 border-t border-white/10 pt-3">
        <p>
          On tap we capture your GPS and route you to the closest facility. If GPS is unavailable, pick your LGA and we route by area.
        </p>
      </div>
    </div>
  );
}
