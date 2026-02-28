"use client";

import React, { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  MoreHorizontal,
  Search,
  Filter,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAdminStore } from "@/store/useAdminStore";
import EcoSelect from "@/components/ui/EcoSelect";

function Skeleton() {
  return (
    <div className="animate-pulse space-y-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="h-16 bg-slate-100 border-2 border-black/5 rounded-2xl"
        />
      ))}
    </div>
  );
}

export default function DataTable({
  columns,
  data,
  isLoading,
  onEdit,
  onDelete,
  emptyMessage = "Tidak ada data ditemukan",
  searchPlaceholder = "Cari data...",
  filterConfigs = [],
}) {
  const { searchQuery } = useAdminStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState({});
  const itemsPerPage = 8;

  // Apply Search (combines global and local)
  let processedData = data.filter((row) => {
    const matchGlobal = searchQuery
      ? Object.values(row).some((val) =>
          String(val).toLowerCase().includes(searchQuery.toLowerCase()),
        )
      : true;
    const matchLocal = searchTerm
      ? Object.values(row).some((val) =>
          String(val).toLowerCase().includes(searchTerm.toLowerCase()),
        )
      : true;
    return matchGlobal && matchLocal;
  });

  // Apply Filters
  if (Object.keys(activeFilters).length > 0) {
    processedData = processedData.filter((row) => {
      return Object.entries(activeFilters).every(([key, value]) => {
        if (!value || value === "ALL") return true;
        // String comparison for simplicity, can be expanded for custom predicates
        return String(row[key]).toLowerCase() === String(value).toLowerCase();
      });
    });
  }

  const totalPages = Math.ceil(processedData.length / itemsPerPage);
  const paginatedData = processedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const handleFilterChange = (key, value) => {
    setActiveFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setActiveFilters({});
    setIsFilterOpen(false);
    setCurrentPage(1);
  };

  const activeFilterCount = Object.values(activeFilters).filter(
    (v) => v && v !== "ALL",
  ).length;

  return (
    <div className="space-y-6">
      {/* Table Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-4 border-3 border-black rounded-3xl shadow-hard">
        <div className="relative w-full md:max-w-xs group flex-1">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-black transition-colors"
          />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-12 pr-4 py-2.5 bg-slate-50 border-2 border-black rounded-2xl font-body font-bold text-sm focus:outline-none focus:bg-white transition-all shadow-[2px_2px_0_#0f0f0f] focus:shadow-hard"
          />
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto relative">
          <div className="text-xs font-black text-slate-400 uppercase tracking-widest hidden lg:block">
            Menampilkan {paginatedData.length} dari {processedData.length}
          </div>
          {filterConfigs.length > 0 && (
            <div className="relative w-full md:w-auto">
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className={`w-full md:w-auto flex items-center justify-center gap-2 px-6 py-2.5 border-3 border-black rounded-2xl font-display font-black text-xs uppercase tracking-wider transition-all
                  ${activeFilterCount > 0 ? "bg-yellow shadow-[2px_2px_0_#0f0f0f]" : "bg-white hover:bg-slate-50 shadow-hard"} 
                  active:translate-x-0.5 active:translate-y-0.5 active:shadow-none`}
              >
                <Filter size={16} /> Filter{" "}
                {activeFilterCount > 0 && `(${activeFilterCount})`}
              </button>

              <AnimatePresence>
                {isFilterOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    // Buang overflow-hidden, pertahankan border tebal & hard shadow
                    className="absolute right-0 top-full mt-4 w-72 bg-white border-[2.5px] border-black rounded-3xl shadow-[8px_8px_0_#0f0f0f] z-50 flex flex-col"
                  >
                    {/* Header - Diberi rounded-t agar sudut atas tetap melengkung rapi tanpa overflow-hidden */}
                    <div className="p-4 border-b-[2.5px] border-black bg-[#d4fce8] rounded-t-[22px] flex items-center justify-between">
                      <span className="font-display font-black uppercase tracking-tight text-black">
                        Kriteria Filter
                      </span>
                      <button
                        onClick={() => setIsFilterOpen(false)}
                        className="p-1 hover:bg-white border-[2.5px] border-transparent hover:border-black rounded-lg transition-colors text-black"
                      >
                        <X size={16} strokeWidth={3} />
                      </button>
                    </div>

                    {/* Body */}
                    <div className="p-4 space-y-4">
                      {filterConfigs.map((config, idx) => (
                        <div key={idx} className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                            {config.label}
                          </label>
                          <EcoSelect
                            size="sm"
                            value={activeFilters[config.key] || "ALL"}
                            onChange={(e) =>
                              handleFilterChange(config.key, e.target.value)
                            }
                            options={[
                              { label: "Semua Kategori", value: "ALL" },
                              ...config.options,
                            ]}
                          />
                        </div>
                      ))}
                    </div>

                    {/* Footer / Reset Button */}
                    {activeFilterCount > 0 && (
                      <div className="p-4 border-t-[2.5px] border-black bg-[#ffb8d9] rounded-b-[22px]">
                        <button
                          onClick={clearFilters}
                          className="w-full py-2 bg-white border-[2.5px] border-black rounded-xl font-black text-xs uppercase tracking-widest text-black shadow-[4px_4px_0_#0f0f0f] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_#0f0f0f] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all"
                        >
                          Reset Filter
                        </button>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white border-3 border-black rounded-4xl shadow-hard overflow-hidden">
        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b-3 border-black">
                {columns.map((col, idx) => (
                  <th
                    key={idx}
                    className={`px-6 py-5 text-left text-[10px] font-black uppercase tracking-[0.2em] text-black ${col.className || ""}`}
                  >
                    <div className="flex items-center gap-2">
                      {col.label}
                      {col.sortable && (
                        <ArrowUpDown size={14} className="text-slate-400" />
                      )}
                    </div>
                  </th>
                ))}
                {(onEdit || onDelete) && (
                  <th className="px-6 py-5 text-right text-[10px] font-black uppercase tracking-[0.2em] text-black w-24">
                    Aksi
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y-3 divide-black/5">
              <AnimatePresence mode="wait">
                {isLoading ? (
                  <tr>
                    <td colSpan={columns.length + 1} className="p-8">
                      <Skeleton />
                    </td>
                  </tr>
                ) : paginatedData.length > 0 ? (
                  paginatedData.map((row, rowIdx) => (
                    <motion.tr
                      key={row.id || rowIdx}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="hover:bg-slate-50/50 transition-colors group"
                    >
                      {columns.map((col, colIdx) => (
                        <td
                          key={colIdx}
                          className={`px-6 py-5 font-body font-bold text-sm text-black ${col.className || ""}`}
                        >
                          {col.render
                            ? col.render(row[col.key], row)
                            : row[col.key]}
                        </td>
                      ))}
                      {(onEdit || onDelete) && (
                        <td className="px-6 py-5 text-right w-24">
                          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            {onEdit && (
                              <button
                                onClick={() => onEdit(row)}
                                className="p-2 hover:bg-yellow border-2 border-transparent hover:border-black rounded-lg transition-all shadow-[2px_2px_0_transparent] hover:shadow-[2px_2px_0_#0f0f0f]"
                              >
                                <MoreHorizontal size={18} />
                              </button>
                            )}
                          </div>
                        </td>
                      )}
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={columns.length + 1}
                      className="p-20 text-center"
                    >
                      <div className="flex flex-col items-center gap-4 text-slate-400">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center border-2 border-dashed border-slate-300">
                          <Search size={32} />
                        </div>
                        <p className="font-display font-black uppercase tracking-widest text-sm text-center">
                          {searchQuery || searchTerm || activeFilterCount > 0
                            ? "Tidak ada hasil pencarian/filter"
                            : emptyMessage}
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="px-6 py-4 bg-slate-50 border-t-3 border-black flex items-center justify-between">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="flex items-center gap-2 px-4 py-2 border-2 border-black rounded-xl font-black text-xs uppercase tracking-wider bg-white disabled:opacity-50 disabled:cursor-not-allowed shadow-[3px_3px_0_#0f0f0f] active:shadow-none active:translate-x-0.5 active:translate-y-0.5 transition-all"
            >
              <ChevronLeft size={16} /> Sebelumnya
            </button>
            <div className="text-xs font-black uppercase tracking-widest">
              Halaman {currentPage} dari {totalPages}
            </div>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="flex items-center gap-2 px-4 py-2 border-2 border-black rounded-xl font-black text-xs uppercase tracking-wider bg-white disabled:opacity-50 disabled:cursor-not-allowed shadow-[3px_3px_0_#0f0f0f] active:shadow-none active:translate-x-0.5 active:translate-y-0.5 transition-all"
            >
              Selanjutnya <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
