"use client";

export default function EcoInput({
  icon: Icon,
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
      <div className="relative group">
        {Icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-black z-10">
            <Icon size={18} strokeWidth={2.5} />
          </div>
        )}
        <input
          {...props}
          className={`
            w-full bg-white border-[2.5px] border-black rounded-2xl px-4 py-3
            font-body font-bold text-sm text-black placeholder:text-black/40
            shadow-[3px_3px_0_#0f0f0f] transition-all
            focus:outline-none focus:bg-yellow focus:shadow-[5px_5px_0_#0f0f0f]
            hover:shadow-[5px_5px_0_#0f0f0f]
            disabled:opacity-60 disabled:cursor-not-allowed
            ${Icon ? "pl-12" : ""}
            ${error ? "border-pink bg-pink/10 shadow-none focus:shadow-none" : ""}
            ${className}
          `}
        />
      </div>
      {error && (
        <span className="text-xs font-bold text-black bg-pink px-2 py-1 rounded-md self-start border-2 border-black">
          {error}
        </span>
      )}
    </div>
  );
}
