"use client";

const badgeVariants = {
  // Difficulty
  easy: "bg-green-50 text-green-700 border-green-400",
  medium: "bg-yellow-50 text-yellow-700 border-yellow-400",
  hard: "bg-red-50 text-red-700 border-red-400",

  // Rarity
  bronze: "bg-amber-100 text-amber-800 border-amber-500",
  silver: "bg-slate-200 text-slate-700 border-slate-400",
  gold: "bg-yellow-100 text-yellow-800 border-yellow-500",
  platinum: "bg-cyan-100 text-cyan-800 border-cyan-500",
  diamond: "bg-blue-100 text-blue-800 border-blue-500",
  challenger: "bg-purple-100 text-purple-800 border-purple-500",

  // Status
  active: "bg-emerald-100 text-emerald-800 border-emerald-500",
  suspended: "bg-slate-200 text-slate-500 border-slate-400",
  banned: "bg-orange-100 text-orange-700 border-orange-400",
  inactive: "bg-slate-100 text-slate-500 border-slate-300",

  // Shop & Event
  limited: "bg-purple-100 text-purple-700 border-purple-400",
  permanent: "bg-blue-100 text-blue-700 border-blue-400",
  banner: "bg-pink-100 text-pink-700 border-pink-400",
  border: "bg-indigo-100 text-indigo-700 border-indigo-400",
};

export default function StatusBadge({
  children,
  variant = "suspended",
  className = "",
}) {
  const variantStyles =
    badgeVariants[variant.toLowerCase()] || badgeVariants.suspended;

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-lg border-2 font-body font-black text-[10px] uppercase tracking-wider transition-all shadow-[2px_2px_0_rgba(0,0,0,0.1)] ${variantStyles} ${className}`}
    >
      {children}
    </span>
  );
}
