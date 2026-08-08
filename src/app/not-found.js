// src/app/not-found.js
import Link from "next/link";
import { ShieldAlert } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center text-center gap-4 py-16">
      <ShieldAlert size={48} className="text-red-500" />
      <h1 className="text-2xl font-bold text-white">Page not found</h1>
      <Link href="/" className="bg-red-600 text-white font-bold rounded-xl px-6 py-3">
        Go to Emergency Buttons
      </Link>
    </div>
  );
}
