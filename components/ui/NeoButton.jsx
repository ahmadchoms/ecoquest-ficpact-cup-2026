"use client";

import Link from "next/link";

const BASE_CLASSES =
  "inline-flex items-center gap-2 bg-white border-3 border-black text-black font-display font-bold rounded-2xl shadow-hard hover:-translate-x-1 hover:-translate-y-1 active:translate-x-0 active:translate-y-0 active:shadow-none transition-all";

const SIZE_MAP = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-base",
  lg: "px-6 py-3 text-lg",
};

export default function NeoButton({
  children,
  href,
  onClick,
  icon,
  size = "md",
  bgClass = "bg-white",
  className = "",
  ...props
}) {
  const classes = `${BASE_CLASSES} ${SIZE_MAP[size]} ${bgClass} ${className}`.replace("bg-white", bgClass);

  if (href) {
    return (
      <Link href={href} className={classes} {...props}>
        {icon}
        {children && <span className="mt-0.5">{children}</span>}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={classes} {...props}>
      {icon}
      {children && <span className="mt-0.5">{children}</span>}
    </button>
  );
}
