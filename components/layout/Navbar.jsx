"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUserStore } from "@/store/useUserStore";
import { useNavbarData } from "@/hooks/useNavbarData"; 
import XPBar from "@/components/ui/XPBar";
import LevelBadge from "@/components/ui/LevelBadge";
import { signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { Leaf, User, Map, LogOut, Award, Menu, X, ShoppingBag } from "lucide-react";
import { useState, useEffect, useTransition } from "react";

// Konstanta XP per level
const XP_PER_LEVEL = 500;

export default function Navbar() {
  const pathname = usePathname();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false); 
  const [, startTransition] = useTransition();

  const { data: dbUser, isLoading } = useNavbarData();
  const store = useUserStore();

  const displayPoints = dbUser?.points ?? store.coins;
  const displayXP = dbUser?.xp ?? store.totalXP;
  const displayLevel = dbUser?.level ?? store.level;
  const displayName = dbUser?.name ?? store.explorerName;

  // LOGIKA PERHITUNGAN XPBAR
  // currentXP = sisa XP setelah dibagi XP_PER_LEVEL
  const currentXP = displayXP % XP_PER_LEVEL;
  const xpToNextLevel = XP_PER_LEVEL;

  useEffect(() => {
    setMounted(true);
    startTransition(() => {
      setMobileOpen(false);
      setDropdownOpen(false);
    });
  }, [pathname]);

  if (
    !mounted || 
    pathname === "/" ||
    pathname === "/auth/login" ||
    pathname === "/auth/register" ||
    pathname === "/auth/error" ||
    pathname.startsWith("/admin")
  )
    return null;

  const navLinks = [
    { href: "/map", icon: <Map size={18} />, label: "Peta" },
    { href: "/dashboard", icon: <User size={18} />, label: "Dashboard" },
    { href: "/leaderboard", icon: <Award size={18} />, label: "Peringkat" },
    { href: "/shop", icon: <ShoppingBag size={18} />, label: "Shop" },
  ];

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/auth/login" });
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 120, damping: 20 }}
        className="fixed top-0 left-0 right-0 h-16 md:h-20 bg-white/80 backdrop-blur-xl border-b border-slate-200/50 z-50 px-4 md:px-8"
      >
        <div className="h-full flex items-center justify-between max-w-7xl mx-auto">
          <Link href="/" className="flex items-center gap-2 group shrink-0">
            <div className="w-9 h-9 md:w-10 md:h-10 bg-linear-to-br from-emerald-400 to-teal-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <Leaf size={18} />
            </div>
            <span className="font-display font-bold text-lg md:text-xl text-slate-800 hidden sm:block">
              EcoQuest
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all font-medium text-sm ${
                    isActive
                      ? "bg-emerald-50 text-emerald-600"
                      : "text-slate-600 hover:bg-slate-50 hover:text-emerald-500"
                  }`}
                >
                  {link.icon}
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50/80">
              <span className="text-lg">💰</span>
              <div>
                <p className="text-xs font-bold text-slate-600">Points</p>
                <p className="font-bold text-sm text-emerald-700">
                  {isLoading ? "..." : displayPoints}
                </p>
              </div>
            </div>

            {/* XP Bar dengan props baru */}
            <div className="hidden lg:block w-32">
              <XPBar 
                current={currentXP} 
                max={xpToNextLevel} 
                level={displayLevel} 
              />
            </div>

            <div className="relative hidden md:block">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 hover:bg-slate-50 p-2 rounded-xl transition-colors outline-none focus:ring-2 focus:ring-emerald-500/20"
              >
                <div className="text-right hidden lg:block">
                  <p className="text-sm font-bold text-slate-700 leading-none">
                    {displayName || "Explorer"}
                  </p>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    Level {displayLevel}
                  </p>
                </div>
                <LevelBadge level={displayLevel} size="sm" />
              </button>

              <AnimatePresence>
                {dropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: 5 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 5 }}
                      className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 p-1.5 z-50"
                    >
                      <Link href="/profile" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-50 text-slate-600 hover:text-emerald-600 transition-colors text-sm font-medium">
                        <User size={16} /> Profil Saya
                      </Link>
                      <div className="h-px bg-slate-100 my-1" />
                      <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 text-slate-600 hover:text-red-600 transition-colors text-sm font-medium">
                        <LogOut size={16} /> Keluar
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 rounded-xl text-slate-600">
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden" onClick={() => setMobileOpen(false)} />
            <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} className="fixed top-16 right-0 bottom-0 w-72 bg-white z-50 md:hidden shadow-2xl border-l border-slate-100">
              <div className="p-6 flex flex-col h-full">
                <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl mb-6">
                  <LevelBadge level={displayLevel} size="sm" />
                  <div>
                    <p className="font-bold text-slate-800 text-sm">{displayName || "Explorer"}</p>
                    <p className="text-xs text-slate-500">Level {displayLevel} • {displayXP} XP</p>
                    <p className="text-xs font-bold text-emerald-600 mt-1">{displayPoints} Points</p>
                  </div>
                </div>
                <div className="space-y-1 flex-1">
                  {navLinks.map((link) => (
                    <Link key={link.href} href={link.href} className={`flex items-center gap-3 px-4 py-3.5 rounded-xl font-medium ${pathname === link.href ? "bg-emerald-50 text-emerald-600" : "text-slate-600"}`}>
                      {link.icon} {link.label}
                    </Link>
                  ))}
                </div>
                <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 font-medium mt-auto">
                  <LogOut size={18} /> Keluar
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}