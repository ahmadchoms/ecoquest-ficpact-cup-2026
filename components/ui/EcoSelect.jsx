"use client";

import React, { useState, useEffect, useRef } from "react";
import { ChevronDown, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";

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
  const [dropdownStyle, setDropdownStyle] = useState({});
  const triggerRef = useRef(null);

  const sizes = {
    sm: "py-2.5 px-4 text-xs",
    md: "py-3 px-4 text-sm",
    lg: "py-4 px-5 text-base",
  };

  const selectedOption = options.find((opt) => opt.value === value) || null;

  // Hitung posisi dropdown saat open
  useEffect(() => {
    if (!isOpen || !triggerRef.current) return;

    const rect = triggerRef.current.getBoundingClientRect();

    setDropdownStyle({
      position: "fixed",
      top: rect.bottom + 8,
      left: rect.left,
      width: rect.width,
      zIndex: 9999,
    });

    const handleScroll = () => {
      const updated = triggerRef.current.getBoundingClientRect();
      setDropdownStyle({
        position: "fixed",
        top: updated.bottom + 8,
        left: updated.left,
        width: updated.width,
        zIndex: 9999,
      });
    };

    window.addEventListener("scroll", handleScroll, true);
    window.addEventListener("resize", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll, true);
      window.removeEventListener("resize", handleScroll);
    };
  }, [isOpen]);

  // Close on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (triggerRef.current && !triggerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [isOpen]);

  return (
    <>
      {/* Trigger */}
      <button
        ref={triggerRef}
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen((prev) => !prev)}
        className={`w-full flex items-center justify-between border-[2.5px] border-black rounded-2xl font-body font-bold transition-all
          focus:outline-none hover:bg-yellow shadow-[3px_3px_0_#0f0f0f] hover:shadow-[5px_5px_0_#0f0f0f]
          ${isOpen ? "bg-yellow shadow-[5px_5px_0_#0f0f0f]" : "bg-white"} 
          ${sizes[size]} ${className}`}
      >
        <div className="flex items-center gap-3">
          {Icon && <Icon size={18} strokeWidth={2.5} />}
          <span>{selectedOption ? selectedOption.label : placeholder}</span>
        </div>

        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown size={18} strokeWidth={3} />
        </motion.div>
      </button>

      {/* Portal Dropdown */}
      {typeof window !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.15 }}
                style={dropdownStyle}
                className="bg-white border-[2.5px] border-black rounded-2xl shadow-hard-lg max-h-60 overflow-y-auto"
              >
                <ul className="py-2">
                  {options.map((opt, idx) => (
                    <li key={idx}>
                      <button
                        type="button"
                        onClick={() => {
                          onChange({ target: { value: opt.value } });
                          setIsOpen(false);
                        }}
                        className="w-full text-left px-5 py-3 hover:bg-green flex items-center justify-between border-b-2 border-transparent hover:border-black"
                      >
                        <span className="font-bold text-sm">{opt.label}</span>
                        {value === opt.value && (
                          <Check size={18} strokeWidth={3} />
                        )}
                      </button>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </>
  );
}
