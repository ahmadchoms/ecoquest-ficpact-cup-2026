"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
    scale: 0.98,
  },
  in: {
    opacity: 1,
    y: 0,
    scale: 1,
  },
  out: {
    opacity: 0,
    y: -20,
    scale: 0.98,
  },
};

const pageTransition = {
  type: "spring",
  stiffness: 100,
  damping: 20,
  duration: 0.4,
};

export default function PageWrapper({ children, className = "" }) {
  const pathname = usePathname();

  return (
    <motion.div
      key={pathname}
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
      className={`w-full ${className}`}
    >
      {children}
    </motion.div>
  );
}
