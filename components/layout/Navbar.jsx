"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUserStore } from "@/store/useUserStore";
import XPBar from "@/components/ui/XPBar";
import LevelBadge from "@/components/ui/LevelBadge";
import { signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Leaf,
  User,
  Map,
  LogOut,
  Award,
  Menu,
  X,
  ShoppingBag,
} from "lucide-react";
import { useState, useEffect, useTransition } from "react";

export default function Navbar() {
  const { totalXP, level, explorerName, coins } = useUserStore();
  const pathname = usePathname();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [, startTransition] = useTransition();

  useEffect(() => {
    startTransition(() => {
      setMobileOpen(false);
      setDropdownOpen(false);
    });
  }, [pathname]);

  if (
    pathname === "/" ||
    pathname === "/auth/login" ||
    pathname === "/auth/register" ||
    pathname === "/auth/error" ||
    pathname.startsWith("/admin")
  ) {
    return null;
  }

  const navLinks = [
    { href: "/map", icon: <Map size={18} strokeWidth={2.5} />, label: "Peta" },
    {
      href: "/dashboard",
      icon: <User size={18} strokeWidth={2.5} />,
      label: "Dashboard",
    },
    {
      href: "/leaderboard",
      icon: <Award size={18} strokeWidth={2.5} />,
      label: "Peringkat",
    },
    {
      href: "/shop",
      icon: <ShoppingBag size={18} strokeWidth={2.5} />,
      label: "Shop",
    },
  ];

  const NavLink = ({ href, icon, label }) => {
    const isActive = pathname === href;
    return (
      <Link
        href={href}
        className={`flex items-center gap-2 px-4 py-2 rounded-2xl font-display font-bold text-sm transition-all duration-200 border-3 ${
          isActive
            ? "bg-mint border-black shadow-hard -translate-x-0.5 -translate-y-0.5 text-black"
            : "bg-transparent border-transparent text-black hover:bg-yellow hover:border-black hover:shadow-hard hover:-translate-x-0.5 hover:-translate-y-0.5"
        }`}
      >
        {icon}
        <span className="mt-0.5">{label}</span>
      </Link>
    );
  };

  const handleLogout = async () => {
    await signOut({
      callbackUrl: "/auth/login",
    });
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 120, damping: 20 }}
        className="fixed top-0 left-0 right-0 h-16 md:h-20 bg-white border-b-[2.5px] border-black z-50 px-4 md:px-8"
      >
        <div className="h-full flex items-center justify-between max-w-7xl mx-auto">
          <Link href="/" className="flex items-center gap-2 group shrink-0">
            <div className="w-9 h-9 md:w-10 md:h-10 bg-green border-3 border-black rounded-2xl flex items-center justify-center text-black shadow-hard transition-all duration-200 group-hover:translate-x-0.5 group-hover:translate-y-0.5 group-hover:shadow-none">
              <Leaf size={20} strokeWidth={2.5} />
            </div>
            <span className="font-display font-bold text-lg md:text-xl text-black hidden sm:block mt-0.5">
              EcoQuest
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-2">
            {navLinks.map((link) => (
              <NavLink key={link.href} {...link} />
            ))}
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-yellow border-3 border-black shadow-hard transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none cursor-default">
              <span className="text-lg">💰</span>
              <div className="leading-tight">
                <p className="text-[10px] font-bold text-black uppercase tracking-wide">
                  Poin
                </p>
                <p className="font-display font-bold text-sm text-black">
                  {coins}
                </p>
              </div>
            </div>

            <div className="hidden lg:block w-32">
              <XPBar currentXP={totalXP} />
            </div>

            <div className="relative hidden md:block">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 bg-white hover:bg-pink p-1.5 pr-3 rounded-2xl transition-all border-3 border-transparent hover:border-black hover:shadow-hard outline-none"
              >
                <LevelBadge level={level} size="sm" />
                <div className="text-left hidden lg:block">
                  <p className="text-sm font-display font-bold text-black leading-none mt-0.5">
                    {explorerName || "Explorer"}
                  </p>
                </div>
              </button>

              <AnimatePresence>
                {dropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setDropdownOpen(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: 5 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 5 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-4 w-56 bg-white rounded-3xl shadow-hard border-3 border-black p-2 z-50 overflow-hidden"
                    >
                      <Link
                        href="/profile"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-mint text-black font-display font-bold text-sm border-2 border-transparent hover:border-black transition-all"
                      >
                        <User size={18} strokeWidth={2.5} /> Profil Saya
                      </Link>
                      <Link
                        href="/leaderboard"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-yellow text-black font-display font-bold text-sm border-2 border-transparent hover:border-black transition-all"
                      >
                        <Award size={18} strokeWidth={2.5} /> Papan Peringkat
                      </Link>
                      <div className="h-[2.5px] bg-black my-2 rounded-full" />
                      <button
                        onClick={() => handleLogout()}
                        className="flex items-center gap-3 px-4 py-3 w-full rounded-xl hover:bg-orange text-black font-display font-bold text-sm border-2 border-transparent hover:border-black transition-all"
                      >
                        <LogOut size={18} strokeWidth={2.5} /> Keluar
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-xl bg-white border-3 border-black shadow-hard hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all text-black outline-none"
              aria-label="Toggle menu"
            >
              <AnimatePresence mode="wait">
                {mobileOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <X size={20} strokeWidth={3} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="open"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <Menu size={20} strokeWidth={3} />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, x: "100%" }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-16 right-0 bottom-0 w-72 bg-white z-50 md:hidden border-l-[2.5px] border-black"
            >
              <div className="p-6 flex flex-col h-full bg-grid-pattern">
                <div className="flex items-center gap-3 p-4 bg-yellow border-3 border-black shadow-hard rounded-2xl mb-8">
                  <LevelBadge level={level} size="sm" />
                  <div>
                    <p className="font-display font-bold text-black text-sm">
                      {explorerName || "Explorer"}
                    </p>
                    <p className="text-[11px] font-bold text-black/70 uppercase">
                      Level {level} • {totalXP} XP
                    </p>
                  </div>
                </div>

                <div className="space-y-3 flex-1">
                  {navLinks.map((link, i) => {
                    const isActive = pathname === link.href;
                    return (
                      <motion.div
                        key={link.href}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                      >
                        <Link
                          href={link.href}
                          onClick={() => setMobileOpen(false)}
                          className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all font-display font-bold border-3 ${
                            isActive
                              ? "bg-mint border-black shadow-hard text-black -translate-x-0.5 -translate-y-0.5"
                              : "bg-white border-black text-black hover:bg-yellow hover:shadow-hard hover:-translate-x-0.5 hover:-translate-y-0.5"
                          }`}
                        >
                          {link.icon}
                          <span className="mt-0.5">{link.label}</span>
                        </Link>
                      </motion.div>
                    );
                  })}

                  <div className="h-[2.5px] bg-black my-6 rounded-full" />

                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <Link
                      href="/profile"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-white border-3 border-black text-black hover:bg-pink hover:shadow-hard transition-all font-display font-bold hover:-translate-x-0.5 hover:-translate-y-0.5"
                    >
                      <User size={18} strokeWidth={2.5} /> Profil Saya
                    </Link>
                  </motion.div>
                </div>

                <button
                  onClick={() => handleLogout()}
                  className="flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-orange border-3 border-black text-black font-display font-bold mt-auto shadow-hard hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all active:scale-95"
                >
                  <LogOut size={18} strokeWidth={2.5} /> Keluar
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
