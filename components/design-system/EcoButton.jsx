// variants: primary (black), secondary (yellow), ghost (white), outline
// size: sm, md, lg

export default function EcoButton({ 
  children, 
  variant = 'primary', 
  className, 
  onClick,
  ...props 
}) {
  const baseStyles = "inline-flex items-center justify-center gap-2 font-display font-extrabold border-3 border-black rounded-xl transition-all active:translate-x-[2px] active:translate-y-[2px] active:shadow-none hover:-translate-y-[2px] hover:-translate-x-[2px]";
  
  const variants = {
    primary: "bg-black text-white shadow-hard hover:shadow-hard-lg",
    secondary: "bg-yellow text-black shadow-hard hover:shadow-hard-lg",
    ghost: "bg-white text-black shadow-hard hover:shadow-hard-lg",
    outline: "bg-transparent text-black border-3 hover:bg-black/5"
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-7 py-3.5 text-base",
    lg: "px-10 py-4 text-lg"
  };

  return (
        <button 
      className={`${baseStyles} ${variants[variant]} ${sizes['md']} ${className || ''}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
}
