import React from 'react';

export default function EcoCard({ 
  children, 
  className, 
  variant = 'default',
  ...props 
}) {
  const baseStyles = "border-3 border-black p-6 relative bg-white transition-all";
  
  const variants = {
    default: "rounded-3xl shadow-hard hover:-translate-y-1 hover:shadow-hard-lg",
    flat: "rounded-2xl border-2 shadow-none",
    feature: "rounded-[20px] shadow-hard hover:shadow-hard-lg hover:-translate-y-1 bg-white",
  };

  return (
    <div 
      className={`${baseStyles} ${variants[variant]} ${className || ''}`}
      {...props}
    >
      {children}
    </div>
  );
}
