"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";

export default function FunFactBanner({ funFact }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-pink border-3 border-black rounded-4xl p-6 flex flex-col md:flex-row items-center gap-6 shadow-hard"
    >
      {/* Icon Section */}
      <div className="bg-yellow border-3 border-black text-black p-4 rounded-2xl shrink-0 shadow-hard animate-wiggle">
        <Star size={32} strokeWidth={2.5} fill="currentColor" />
      </div>

      {/* Content Section */}
      <div className="text-black font-medium text-lg leading-relaxed">
        <strong className="font-display font-black text-xl block mb-1 uppercase tracking-wide">
          Tahukah kamu?
        </strong>
        <p>{funFact}</p>
      </div>
    </motion.div>
  );
}
