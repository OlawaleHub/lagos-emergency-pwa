// src/components/Footer.js
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="w-full text-center text-[11px] text-neutral-400 py-4 px-4 border-t border-white/10">
      <p>
        For life-threatening emergencies always call{" "}
        <strong className="text-white">112</strong> or{" "}
        <strong className="text-white">767</strong> directly.
      </p>

      <div className="mt-3 flex items-center justify-center gap-2">
        <Image
          src="/helpmeng-logo.png"
          alt="HelpmeNG"
          width={24}
          height={24}
          className="rounded"
        />
        <span className="text-xs font-semibold tracking-wide">
          <span className="text-white">HelpmeNG</span>
        </span>
      </div>
    </footer>
  );
}
