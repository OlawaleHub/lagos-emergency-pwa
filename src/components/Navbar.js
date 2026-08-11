// src/components/Navbar.js
import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  return (
    <header className="fixed top-0 inset-x-0 z-40 bg-black/85 backdrop-blur border-b border-white/10">
      <nav className="max-w-2xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-white">
          <Image
            src="/helpmeng-logo.png"
            alt="HelpmeNG"
            width={32}
            height={32}
            className="rounded-lg"
          />
          <span className="text-sm sm:text-base tracking-tight">HelpmeNG</span>
        </Link>
        <div className="flex items-center gap-4 text-xs font-medium text-neutral-300">
          <Link href="/" className="hover:text-white">Home</Link>
          <Link href="/locate" className="hover:text-white">Locate</Link>
          <Link href="/queue" className="hover:text-white">Queue</Link>
        </div>
      </nav>
    </header>
  );
}
