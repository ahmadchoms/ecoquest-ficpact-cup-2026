import { Leaf } from "lucide-react";

export default function LevelBadge({ level, size = "md" }) {
  const sizes = {
    sm: "w-8 h-8 text-xs border-2",
    md: "w-12 h-12 text-sm border-2",
    lg: "w-16 h-16 text-lg border-3",
  };

  const icons = {
    sm: 10,
    md: 14,
    lg: 18,
  };

  // Simplified color logic based on new palette
  const bgColor =
    level >= 10
      ? "bg-purple"
      : level >= 5
        ? "bg-orange"
        : level >= 3
          ? "bg-yellow"
          : "bg-green";

  return (
    <div
      className={`${sizes[size]} py-0.5 px-1 rounded-full ${bgColor} border-black flex items-center justify-center shadow-hard`}
    >
      <div className="flex flex-col items-center">
        <span className="font-display font-extrabold text-black leading-none">
          {level}
        </span>
      </div>
    </div>
  );
}
