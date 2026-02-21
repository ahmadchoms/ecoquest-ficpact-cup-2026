"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-black border-t-[2.5px] border-black py-10 px-6">
      <div className="max-w-[1100px] mx-auto flex flex-wrap justify-between items-center gap-4">
        <div className="font-display font-extrabold text-[22px] text-yellow flex items-center gap-2">
          <span>🌿</span> EcoQuest
        </div>
        <div className="font-body text-[13px] text-[#666]">
          Platform Edukasi Lingkungan untuk Indonesia · 2025
        </div>
        <div className="flex gap-4">
          {["Beranda", "Peta", "Dashboard", "Tentang"].map((l) => (
            <Link
              key={l}
              href="/"
              className="font-body text-[13px] text-[#888] hover:text-white transition-colors"
            >
              {l}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
