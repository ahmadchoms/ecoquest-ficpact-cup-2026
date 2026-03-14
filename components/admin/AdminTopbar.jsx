"use client";

import { usePathname } from "next/navigation";
import {
  Menu,
  Search,
  Bell,
  ChevronRight,
  TrendingUp,
  ExternalLink,
} from "lucide-react";
import { useAdminStore } from "@/store/useAdminStore";
import Link from "next/link";
import { useEffect } from "react";

const routeLabels = {
  "/admin": "Dashboard",
  "/admin/users": "Manajemen Pengguna",
  "/admin/provinces": "Daftar Provinsi",
  "/admin/missions": "Kelola Misi",
  "/admin/badges": "Koleksi Badge",
  "/admin/settings": "Pengaturan",
  "/admin/analytics": "Deep Analytics",
};

export default function AdminTopbar() {
  const pathname = usePathname();
  const { toggleMobileSidebar, sidebarOpen, searchQuery, setSearchQuery } = useAdminStore();

  useEffect(() => {
    setSearchQuery("");
  }, [pathname, setSearchQuery]);

  const currentLabel = routeLabels[pathname] || "Admin";

  return (
    <header className="fixed top-0 right-0 left-0 lg:left-0 z-30 flex items-center py-5 bg-white/80 backdrop-blur-md border-b-3 border-black shadow-">
      <div
        className={`flex items-center justify-between w-full px-4 md:px-8 transition-all duration-300
          ${sidebarOpen ? "lg:ml-64" : "lg:ml-20"}`}
      >
        {/* Left: Mobile Toggle & Breadcrumbs */}
        <div className="flex items-center gap-4">
          <button
            onClick={toggleMobileSidebar}
            className="lg:hidden p-2 bg-white border-2 border-black shadow-[2px_2px_0_#0f0f0f] rounded-lg active:shadow-none active:translate-x-0.5 active:translate-y-0.5 transition-all"
          >
            <Menu size={20} />
          </button>

          <div className="hidden md:flex items-center gap-2">
            <Link
              href="/admin"
              className="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-black transition-colors"
            >
              EcoAdmin
            </Link>
            <ChevronRight size={14} className="text-slate-300" />
            <span className="text-sm font-black text-black uppercase tracking-wide">
              {currentLabel}
            </span>
          </div>
        </div>

        {/* Center: Search (Desktop Only) */}
        {pathname !== "/admin" && pathname !== "/admin/settings" && (
          <div className="hidden sm:flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full group">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-black transition-colors"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari data pada tabel ini..."
                className="w-full pl-12 pr-4 py-2.5 bg-slate-50 border-3 border-black rounded-2xl font-body font-bold text-sm focus:outline-none focus:bg-white focus:shadow-hard transition-all"
              />
            </div>
          </div>
        )}

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          <button className="p-2.5 bg-green/20 text-emerald-700 border-2 border-black rounded-xl hidden md:flex items-center gap-2 hover:bg-green/30 transition-colors">
            <TrendingUp size={18} />
            <span className="text-xs font-black uppercase tracking-wider">
              Live Stats
            </span>
          </button>

          <div className="w-px h-8 bg-black/10 mx-2 hidden md:block" />

          <button className="relative p-2.5 hover:bg-slate-50 rounded-xl transition-colors border-2 border-transparent hover:border-black/5">
            <Bell size={20} className="text-slate-600" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-pink border border-black rounded-full" />
          </button>

          <div className="flex items-center gap-3 pl-2 border-l-2 border-black/10 md:border-none">
            <div className="text-right hidden sm:block">
              <p className="text-[10px] font-black uppercase text-slate-400 leading-none">
                Administrator
              </p>
              <p className="text-xs font-black text-black mt-1">Super Admin</p>
            </div>
            <div className="w-9 h-9 md:w-11 md:h-11 bg-purple border-3 border-black shadow-[3px_3px_0_#0f0f0f] rounded-xl overflow-hidden flex items-center justify-center font-display font-black text-white text-lg">
              A
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
