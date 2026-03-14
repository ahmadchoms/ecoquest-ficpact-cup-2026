"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Map, User, Award } from "lucide-react";

const navItems = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/map", icon: Map, label: "Peta" },
  { href: "/leaderboard", icon: Award, label: "Rank" },
  { href: "/dashboard", icon: User, label: "Profil" },
];

export default function BottomNav() {
  const pathname = usePathname();
  if (pathname === "/" || pathname === "/login" || pathname === "/register" || pathname.startsWith("/admin")) return null;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-t border-slate-200 safe-area-pb">
      <div className="flex items-center justify-around py-3 px-2">
        {navItems.map(({ href, icon: Icon, label }) => {
          // Improve active check to handle sub-routes if needed, but strict is fine for now
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center gap-1 min-w-16 rounded-xl transition-all relative
                ${isActive ? "text-emerald-600" : "text-slate-400 hover:text-slate-600"}`}
            >
              <div
                className={`p-1.5 rounded-xl transition-all ${isActive ? "bg-emerald-50" : "bg-transparent"}`}
              >
                <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span className="text-[10px] font-medium">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
