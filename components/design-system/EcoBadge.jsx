import React from 'react';

export default function EcoBadge({ 
  children, 
  variant = 'neutral',
  className 
}) {
  const baseStyles = "inline-flex items-center gap-2 font-body font-bold text-xs px-3 py-1.5 border-2 border-black rounded-full uppercase tracking-wider";
  
  const variants = {
    neutral: "bg-white text-black",
    yellow: "bg-yellow text-black",
    green: "bg-green text-black",
    mint: "bg-mint text-black",
    orange: "bg-orange text-black",
    purple: "bg-purple text-black",
  };

  return (
    <span className={`${baseStyles} ${variants[variant]} ${className || ''}`}>
      {children}
    </span>
  );
}
