"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart3,
  Users,
  Map as MapIcon,
  Target,
  Award,
  LogOut,
  X,
  Leaf,
} from "lucide-react";
import { useAdminStore } from "@/store/useAdminStore";
import { signOut } from "next-auth/react";

const menuItems = [
  { id: "dashboard", label: "Dashboard", icon: BarChart3, href: "/admin" },
  { id: "users", label: "Pengguna", icon: Users, href: "/admin/users" },
  {
    id: "provinces",
    label: "Provinsi",
    icon: MapIcon,
    href: "/admin/provinces",
  },
  { id: "missions", label: "Misi", icon: Target, href: "/admin/missions" },
  { id: "badges", label: "Badges", icon: Award, href: "/admin/badges" },
];

function SidebarContent({ pathname, setMobileSidebar }) {
  const handleLogout = async () => {
      await signOut({
        callbackUrl: "/auth/login",
      });
    };
  return (
    <div className="flex flex-col h-full bg-white border-r-3 border-black">
      {/* Sidebar Header */}
      <div className="px-6 py-5.75 border-b-3 border-black flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center text-white shadow-hard group-hover:scale-105 transition-transform">
            <Leaf size={20} />
          </div>
          <span className="font-display font-black text-lg text-black tracking-tight">
            ECO<span className="text-emerald-600">ADMIN</span>
          </span>
        </Link>
        <button
          onClick={() => setMobileSidebar(false)}
          className="lg:hidden p-2 hover:bg-slate-100 rounded-lg border-2 border-black"
        >
          <X size={20} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-4 mb-4">
          Menu Utama
        </p>
        {menuItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.id !== "dashboard" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.id}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl border-3 transition-all group font-body font-bold
                ${
                  isActive
                    ? "bg-yellow border-black shadow-hard translate-x-0.5 translate-y-0.5 text-black"
                    : "bg-transparent border-transparent hover:border-black/10 hover:bg-slate-50 text-slate-500 hover:text-black"
                }`}
            >
              <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
              <span className="flex-1">{item.label}</span>
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="w-1.5 h-1.5 bg-black rounded-full"
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Sidebar Footer */}
      <div className="p-4 border-t-3 border-black space-y-2">
        <Link
          href=""
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 text-red-500 transition-colors font-bold"
        >
          <LogOut size={20} />
          <span>Keluar</span>
        </Link>
      </div>
    </div>
  );
}

export default function AdminSidebar() {
  const pathname = usePathname();
  const { sidebarOpen, mobileSidebarOpen, setMobileSidebar } = useAdminStore();

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`fixed left-0 top-0 bottom-0 z-40 transition-all duration-300 hidden lg:block
          ${sidebarOpen ? "w-64" : "w-20"}`}
      >
        <div className={`h-full ${!sidebarOpen && "nav-collapsed"}`}>
          <SidebarContent
            pathname={pathname}
            setMobileSidebar={setMobileSidebar}
          />
        </div>
      </aside>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 lg:hidden"
              onClick={() => setMobileSidebar(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed left-0 top-0 bottom-0 w-80 z-50 lg:hidden shadow-2xl"
            >
              <SidebarContent
                pathname={pathname}
                setMobileSidebar={setMobileSidebar}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
