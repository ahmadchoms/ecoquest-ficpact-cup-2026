import { motion } from "framer-motion";
import { buttonHover } from "@/utils/motion-variants";

export default function AnimatedButton({
  children,
  onClick,
  className = "",
  variant = "primary",
  type = "button",
  disabled = false,
  icon = null,
}) {
  const baseStyles =
    "relative overflow-hidden transition-all duration-300 px-2 flex items-center justify-center gap-2 font-medium rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary:
      "bg-linear-to-r from-primary-500 to-primary-600 text-white shadow-lg hover:shadow-primary-500/30 cursor-pointer",
    secondary:
      "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 hover:border-gray-300 shadow-sm cursor-pointer",
    danger: "bg-red-50 text-red-600 hover:bg-red-100 cursor-pointer",
    ghost: "bg-transparent text-gray-600 hover:bg-gray-100 cursor-pointer",
    outline:
      "border-2 border-primary-500 text-primary-600 hover:bg-primary-50 cursor-pointer",
    brutal:
      "bg-yellow border-3 border-black text-black font-bold uppercase shadow-hard hover:bg-orange active:translate-x-[2px] active:translate-y-[2px] active:shadow-none cursor-pointer",
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${className}`}
      variants={buttonHover}
      whileHover={!disabled ? "hover" : ""}
      whileTap={!disabled ? "tap" : ""}
    >
      {icon && <span className="text-lg">{icon}</span>}
      {children}
    </motion.button>
  );
}
