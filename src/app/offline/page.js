// src/app/offline/page.js
import Link from "next/link";
import { WifiOff } from "lucide-react";

export const metadata = {
  title: "Offline — Lagos Emergency Reporter",
};

export default function OfflinePage() {
  return (
    <div className="flex flex-col items-center text-center gap-4 py-10">
      <WifiOff size={48} className="text-amber-400" />
      <h1 className="text-xl font-bold text-white">You're offline</h1>
      <p className="text-sm text-neutral-400 max-w-sm">
        Don't worry — your emergency alerts are saved on this device and will send
        automatically the moment you reconnect.
      </p>
      <div className="flex flex-col gap-2 w-full max-w-xs">
        <Link
          href="/"
          className="bg-red-600 text-white font-bold rounded-xl py-3"
        >
          Back to Emergency Buttons
        </Link>
        <p className="text-xs text-neutral-500">
          For life-threatening emergencies, call <strong className="text-white">112</strong> directly.
        </p>
      </div>
    </div>
  );
}
