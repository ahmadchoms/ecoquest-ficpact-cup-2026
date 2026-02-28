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
  disabled = false
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  const sizes = {
    sm: "py-2.5 px-4 text-xs",
    md: "py-3 px-4 text-sm",
    lg: "py-4 px-5 text-base"
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

  const selectedOption = options.find(opt => opt.value === value) || null;

  return (
    <div className={`relative w-full ${disabled ? "opacity-60 cursor-not-allowed" : ""}`} ref={containerRef}>
      {/* Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between bg-slate-50 border-3 border-black rounded-2xl font-body font-bold transition-all
          focus:outline-none focus:bg-white hover:bg-white shadow-[3px_3px_0_transparent] hover:shadow-[3px_3px_0_#0f0f0f]
          ${isOpen ? "bg-white shadow-[3px_3px_0_#0f0f0f] border-b-transparent rounded-b-none" : ""} 
          ${sizes[size]} ${className}`}
      >
        <div className="flex items-center gap-3">
          {Icon && <Icon size={18} className="text-slate-400" />}
          <span className={selectedOption ? "text-black" : "text-slate-400"}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </div>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown size={18} className="text-black" />
        </motion.div>
      </button>

      {/* Dropdown Options */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 right-0 top-full bg-white border-3 border-t-0 border-black rounded-b-2xl shadow-[3px_6px_0_#0f0f0f] z-50 max-h-60 overflow-y-auto"
          >
            <ul className="py-2">
              {options.map((opt, idx) => (
                <li key={idx}>
                  <button
                    type="button"
                    onClick={() => {
                      onChange(opt.value);
                      setIsOpen(false);
                    }}
                    className="w-full text-left px-5 py-3 hover:bg-slate-100 flex items-center justify-between group transition-colors"
                  >
                    <span className="font-body font-bold text-sm text-black group-hover:pl-2 transition-all">
                      {opt.label}
                    </span>
                    {value === opt.value && <Check size={16} className="text-emerald-600" />}
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
