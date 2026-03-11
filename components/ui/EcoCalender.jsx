// components/ui/EcoCalendar.jsx
"use client";

import { forwardRef, useState, useRef, useEffect } from "react";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const MONTHS = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];
const DAYS = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

const EcoCalendar = forwardRef(
  (
    {
      label,
      error,
      className = "",
      icon: Icon = CalendarIcon,
      value,
      onChange,
      name,
      ...props
    },
    ref,
  ) => {
    const [isOpen, setIsOpen] = useState(false);

    // Default kalender melihat ke bulan dari value, atau bulan ini jika kosong
    const [viewDate, setViewDate] = useState(
      value ? new Date(value) : new Date(),
    );
    const containerRef = useRef(null);

    // Menutup popup jika mengklik di luar area komponen
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (
          containerRef.current &&
          !containerRef.current.contains(event.target)
        ) {
          setIsOpen(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Format tampilan tanggal di input box (misal: 12 Oktober 2026)
    const displayDate = value ? new Date(value) : null;
    const formattedDisplay =
      displayDate && !isNaN(displayDate)
        ? `${displayDate.getDate()} ${MONTHS[displayDate.getMonth()]} ${displayDate.getFullYear()}`
        : "Pilih Tanggal...";

    // Logika perhitungan grid kalender
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayIndex = new Date(year, month, 1).getDay(); // 0 = Minggu

    const days = [];
    for (let i = 0; i < firstDayIndex; i++) days.push(null); // Slot kosong awal bulan
    for (let i = 1; i <= daysInMonth; i++) days.push(i);

    // Navigasi bulan
    const prevMonth = (e) => {
      e.stopPropagation();
      setViewDate(new Date(year, month - 1, 1));
    };

    const nextMonth = (e) => {
      e.stopPropagation();
      setViewDate(new Date(year, month + 1, 1));
    };

    // Saat tanggal dipilih
    const handleDayClick = (day) => {
      const newDate = new Date(year, month, day);
      // Format kembali ke YYYY-MM-DD untuk disimpan di form
      const yyyy = newDate.getFullYear();
      const mm = String(newDate.getMonth() + 1).padStart(2, "0");
      const dd = String(newDate.getDate()).padStart(2, "0");
      const formatted = `${yyyy}-${mm}-${dd}`;

      // Memalsukan event native agar diterima oleh react-hook-form
      if (onChange) {
        onChange({ target: { name, value: formatted } });
      }
      setIsOpen(false);
    };

    // Helper untuk mengecek jika suatu sel adalah tanggal yang sedang dipilih
    const isSelected = (day) => {
      if (!displayDate || !day) return false;
      return (
        displayDate.getDate() === day &&
        displayDate.getMonth() === month &&
        displayDate.getFullYear() === year
      );
    };

    // Helper untuk hari ini (untuk styling indikator hari ini)
    const isToday = (day) => {
      const today = new Date();
      return (
        today.getDate() === day &&
        today.getMonth() === month &&
        today.getFullYear() === year
      );
    };

    return (
      <div className="w-full flex flex-col gap-2 relative" ref={containerRef}>
        {label && (
          <label className="font-display font-bold text-sm text-black ml-1">
            {label}
          </label>
        )}

        <div className="relative group flex items-center">
          {Icon && (
            <div className="absolute left-4 z-10 text-black pointer-events-none">
              <Icon size={18} strokeWidth={2.5} />
            </div>
          )}

          {/* Input tiruan untuk memicu popup */}
          <div
            onClick={() => setIsOpen(!isOpen)}
            className={`
              w-full bg-white border-[2.5px] border-black rounded-2xl px-4 py-3
              font-body font-bold text-sm select-none
              shadow-[3px_3px_0_#0f0f0f] transition-all cursor-pointer
              hover:shadow-[5px_5px_0_#0f0f0f] hover:bg-slate-50
              ${displayDate ? "text-black" : "text-black/40"}
              ${Icon ? "pl-12" : ""}
              ${error ? "border-pink bg-pink/10 shadow-none hover:shadow-none" : ""}
              ${isOpen ? "bg-yellow shadow-[5px_5px_0_#0f0f0f]" : ""}
              ${className}
            `}
          >
            {formattedDisplay}
          </div>

          {/* Hidden input asli untuk didaftarkan ke react-hook-form via ref */}
          <input
            type="text"
            className="hidden"
            ref={ref}
            name={name}
            value={value || ""}
            readOnly
            {...props}
          />
        </div>

        {error && (
          <span className="text-xs font-bold text-black bg-pink px-2 py-1 rounded-md self-start border-2 border-black">
            {error}
          </span>
        )}

        {/* --- Popup Kalender Kustom --- */}
        {isOpen && (
          <div className="absolute top-full left-0 mt-3 z-50 bg-white border-[3px] border-black rounded-2xl shadow-hard-lg p-5 w-[320px] sm:w-85 animate-in fade-in zoom-in-95 duration-200">
            {/* Header: Navigasi Bulan & Tahun */}
            <div className="flex items-center justify-between mb-4">
              <button
                type="button"
                onClick={prevMonth}
                className="p-1.5 border-2 border-transparent hover:border-black hover:bg-yellow rounded-xl transition-all"
              >
                <ChevronLeft size={20} strokeWidth={3} />
              </button>
              <h3 className="font-display font-black text-lg text-black">
                {MONTHS[month]} {year}
              </h3>
              <button
                type="button"
                onClick={nextMonth}
                className="p-1.5 border-2 border-transparent hover:border-black hover:bg-yellow rounded-xl transition-all"
              >
                <ChevronRight size={20} strokeWidth={3} />
              </button>
            </div>

            {/* Grid Hari (Min, Sen, Sel...) */}
            <div className="grid grid-cols-7 gap-1 text-center mb-2">
              {DAYS.map((d, i) => (
                <div
                  key={d}
                  className={`text-xs font-black py-1 ${i === 0 || i === 6 ? "text-pink" : "text-slate-400"}`}
                >
                  {d}
                </div>
              ))}
            </div>

            {/* Grid Tanggal */}
            <div className="grid grid-cols-7 gap-1">
              {days.map((day, idx) => {
                if (!day) return <div key={`empty-${idx}`} />;

                const selected = isSelected(day);
                const today = isToday(day);

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleDayClick(day)}
                    className={`
                      aspect-square rounded-xl text-sm font-bold border-2 transition-all flex items-center justify-center
                      ${
                        selected
                          ? "bg-black text-white border-black shadow-[2px_2px_0_#FFD700]"
                          : "border-transparent text-black hover:border-black hover:bg-mint hover:-translate-y-0.5 hover:shadow-[2px_2px_0_#0f0f0f]"
                      }
                      ${today && !selected ? "bg-slate-100 text-blue-600 underline decoration-2 underline-offset-2" : ""}
                    `}
                  >
                    {day}
                  </button>
                );
              })}
            </div>

            <div className="mt-4 pt-3 border-t-2 border-slate-100 flex justify-between items-center">
              <button
                type="button"
                onClick={() => setViewDate(new Date())}
                className="text-xs font-bold text-slate-500 hover:text-black transition-colors"
              >
                Ke Hari Ini
              </button>
            </div>
          </div>
        )}
      </div>
    );
  },
);

EcoCalendar.displayName = "EcoCalendar";

export default EcoCalendar;
