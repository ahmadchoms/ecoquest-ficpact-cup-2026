"use client";

import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminTopbar from "@/components/admin/AdminTopbar";
import { useAdminStore } from "@/store/useAdminStore";
import { motion } from "framer-motion";

export default function AdminLayout({ children }) {
  const { sidebarOpen } = useAdminStore();

  return (
    <div className="min-h-screen bg-white flex flex-col font-body">
      {/* Dynamic Grid Background Overlay */}
      <div className="fixed inset-0 bg-grid-pattern pointer-events-none opacity-[0.05] z-0" />

      {/* Sidebar Navigation */}
      <AdminSidebar />

      {/* Main Container */}
      <div className="flex-1 flex flex-col relative z-10">
        {/* Topbar Navigation */}
        <AdminTopbar />

        {/* Main Content Area */}
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className={`flex-1 transition-all duration-300 pt-16 md:pt-20 px-4 md:px-8 pb-12
            ${sidebarOpen ? "lg:ml-64" : "lg:ml-20"}`}
        >
          <div className="max-w-360 mx-auto mt-6 md:mt-8">{children}</div>
        </motion.main>
      </div>
    </div>
  );
}
