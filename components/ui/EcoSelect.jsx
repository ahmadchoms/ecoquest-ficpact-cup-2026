"use client";

import React, { useState, useEffect, useRef } from "react";
import { ChevronDown, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function EcoSelect({
  icon: Icon,
  options = [],
  value,
  onChange,
  placeholder = "Pilih opsi...",
  className = "",
  size = "md",
  disabled = false,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  const sizes = {
    sm: "py-2.5 px-4 text-xs",
    md: "py-3 px-4 text-sm",
    lg: "py-4 px-5 text-base",
  };

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [isOpen]);

  const selectedOption = options.find((opt) => opt.value === value) || null;

  return (
    <div
      className={`relative w-full ${disabled ? "opacity-60 cursor-not-allowed" : ""}`}
      ref={containerRef}
    >
      {/* Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between border-[2.5px] border-black rounded-2xl font-body font-bold transition-all
          focus:outline-none hover:bg-[#f5e642] shadow-[3px_3px_0_#0f0f0f] hover:shadow-[5px_5px_0_#0f0f0f]
          ${isOpen ? "bg-[#f5e642] shadow-[5px_5px_0_#0f0f0f]" : "bg-white"} 
          ${sizes[size]} ${className}`}
      >
        <div className="flex items-center gap-3">
          {Icon && <Icon size={18} className="text-black" strokeWidth={2.5} />}
          <span className="text-black">
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown size={18} className="text-black" strokeWidth={3} />
        </motion.div>
      </button>

      {/* Dropdown Options */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            // z-[60] memastikan menu ini selalu berada di atas popover parent
            // Ditambah mt-2 agar dropdown terpisah sedikit dari tombol untuk efek brutalism yang tegas
            className="absolute left-0 right-0 top-full mt-2 bg-white border-[2.5px] border-black rounded-2xl shadow-[6px_6px_0_#0f0f0f] z-[60] max-h-60 overflow-y-auto"
          >
            <ul className="py-2">
              {options.map((opt, idx) => (
                <li key={idx}>
                  <button
                    type="button"
                    onClick={() => {
                      // Format event diubah agar cocok dengan e.target.value di handleFilterChange
                      onChange({ target: { value: opt.value } });
                      setIsOpen(false);
                    }}
                    className="w-full text-left px-5 py-3 hover:bg-[#b5f0c0] flex items-center justify-between group transition-none border-b-2 border-transparent hover:border-black"
                  >
                    <span className="font-body font-bold text-sm text-black group-hover:translate-x-1 transition-transform">
                      {opt.label}
                    </span>
                    {value === opt.value && (
                      <Check size={18} className="text-black" strokeWidth={3} />
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
