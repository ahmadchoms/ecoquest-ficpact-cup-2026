"use client";

export default function EcoTextArea({
  label,
  error,
  className = "",
  ...props
}) {
  return (
    <div className="w-full flex flex-col gap-2">
      {label && (
        <label className="font-display font-bold text-sm text-black ml-1">
          {label}
        </label>
      )}
      <textarea
        {...props}
        className={`
          w-full bg-white border-[2.5px] border-black rounded-2xl px-4 py-3 min-h-30
          font-body font-bold text-sm text-black placeholder:text-black/40
          shadow-[3px_3px_0_#0f0f0f] transition-all
          focus:outline-none focus:bg-mint focus:shadow-[5px_5px_0_#0f0f0f]
          hover:shadow-[5px_5px_0_#0f0f0f]
          disabled:opacity-60 disabled:cursor-not-allowed resize-none
          ${error ? "border-pink bg-pink/10" : ""}
          ${className}
        `}
      />
      {error && (
        <span className="text-xs font-bold text-black ml-1">{error}</span>
      )}
    </div>
  );
}
