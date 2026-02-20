import { Link, useLocation } from "react-router-dom";
import { useUserStore } from "../../store/useUserStore";
import XPBar from "../ui/XPBar";
import LevelBadge from "../ui/LevelBadge";
import { motion, AnimatePresence } from "framer-motion";
import { Leaf, User, Map, LogOut, Award, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";

export default function Navbar() {
  const { totalXP, level, explorerName, resetProgress } = useUserStore();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Hide navbar on landing page and auth pages
  const hiddenRoutes = ["/", "/login", "/register"];
  if (hiddenRoutes.includes(location.pathname)) return null;

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
    setDropdownOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { to: "/map", icon: <Map size={18} />, label: "Peta" },
    { to: "/dashboard", icon: <User size={18} />, label: "Dashboard" },
    { to: "/leaderboard", icon: <Award size={18} />, label: "Peringkat" },
  ];

  const NavLink = ({ to, icon, label }) => {
    const isActive = location.pathname === to;
    return (
      <Link 
        to={to} 
        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all font-medium text-sm ${
          isActive 
            ? "bg-emerald-50 text-emerald-600" 
            : "text-slate-600 hover:bg-slate-50 hover:text-emerald-500"
        }`}
      >
        {icon}
        <span>{label}</span>
      </Link>
    );
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
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group flex-shrink-0">
            <div className="w-9 h-9 md:w-10 md:h-10 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <Leaf size={18} />
            </div>
            <span className="font-heading font-bold text-lg md:text-xl text-slate-800 hidden sm:block">EcoQuest</span>
          </Link>
          
          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <NavLink key={link.to} {...link} />
            ))}
          </div>

          {/* Right section */}
          <div className="flex items-center gap-3">
            {/* XP Bar (desktop only) */}
            <div className="hidden lg:block">
              <XPBar currentXP={totalXP} />
            </div>
            
            {/* Profile dropdown */}
            <div className="relative hidden md:block">
              <button 
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 hover:bg-slate-50 p-2 rounded-xl transition-colors outline-none focus:ring-2 focus:ring-emerald-500/20"
              >
                <div className="text-right hidden lg:block">
                  <p className="text-sm font-bold text-slate-700 leading-none">{explorerName || "Explorer"}</p>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">Level {level}</p>
                </div>
                <LevelBadge level={level} size="sm" />
              </button>

              <AnimatePresence>
                {dropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: 5 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 5 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 p-1.5 z-50"
                    >
                      <Link to="/profile" onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-50 text-slate-600 hover:text-emerald-600 transition-colors text-sm font-medium">
                        <User size={16} /> Profil Saya
                      </Link>
                      <Link to="/leaderboard" onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-50 text-slate-600 hover:text-emerald-600 transition-colors text-sm font-medium">
                        <Award size={16} /> Papan Peringkat
                      </Link>
                      <div className="h-px bg-slate-100 my-1" />
                      <Link to="/" onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 text-slate-600 hover:text-red-600 transition-colors text-sm font-medium">
                        <LogOut size={16} /> Keluar
                      </Link>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Hamburger button (mobile) */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-xl hover:bg-slate-50 transition-colors text-slate-600"
              aria-label="Toggle menu"
            >
              <AnimatePresence mode="wait">
                {mobileOpen ? (
                  <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                    <X size={24} />
                  </motion.div>
                ) : (
                  <motion.div key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
                    <Menu size={24} />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, x: "100%" }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-16 right-0 bottom-0 w-72 bg-white z-50 md:hidden shadow-2xl border-l border-slate-100"
            >
              <div className="p-6 flex flex-col h-full">
                {/* User info */}
                <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl mb-6">
                  <LevelBadge level={level} size="sm" />
                  <div>
                    <p className="font-bold text-slate-800 text-sm">{explorerName || "Explorer"}</p>
                    <p className="text-xs text-slate-500">Level {level} • {totalXP} XP</p>
                  </div>
                </div>

                {/* Navigation Links */}
                <div className="space-y-1 flex-1">
                  {navLinks.map((link, i) => (
                    <motion.div
                      key={link.to}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <Link
                        to={link.to}
                        onClick={() => setMobileOpen(false)}
                        className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all font-medium ${
                          location.pathname === link.to
                            ? "bg-emerald-50 text-emerald-600"
                            : "text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        {link.icon}
                        {link.label}
                      </Link>
                    </motion.div>
                  ))}

                  <div className="h-px bg-slate-100 my-3" />

                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                    <Link to="/profile" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-slate-600 hover:bg-slate-50 font-medium">
                      <User size={18} /> Profil Saya
                    </Link>
                  </motion.div>
                </div>

                {/* Logout */}
                <Link to="/" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 font-medium mt-auto">
                  <LogOut size={18} /> Keluar
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
