"use client";

import React from "react";

const badgeVariants = {
    // Threat Levels
    low: "bg-green/20 text-green-700 border-green-500",
    medium: "bg-yellow/20 text-yellow-700 border-yellow-500",
    high: "bg-orange/20 text-orange-700 border-orange-500",
    critical: "bg-red/20 text-red-700 border-red-500",

    // Rarities
    common: "bg-slate-100 text-slate-600 border-slate-300",
    uncommon: "bg-emerald-50 text-emerald-600 border-emerald-300",
    rare: "bg-blue-50 text-blue-600 border-blue-300",
    epic: "bg-purple-50 text-purple-600 border-purple-300",
    legendary: "bg-amber-50 text-amber-600 border-amber-300",

    // Statuses
    active: "bg-mint text-emerald-800 border-emerald-500",
    inactive: "bg-slate-200 text-slate-500 border-slate-400",
    pending: "bg-orange/10 text-orange-600 border-orange-300",
};

export default function StatusBadge({
    children,
    variant = "common",
    className = ""
}) {
    const variantStyles = badgeVariants[variant.toLowerCase()] || badgeVariants.common;

    return (
        <span className={`inline-flex items-center px-2.5 py-1 rounded-lg border-2 font-body font-black text-[10px] uppercase tracking-wider transition-all shadow-[2px_2px_0_rgba(0,0,0,0.1)] ${variantStyles} ${className}`}>
            {children}
        </span>
    );
}
