"use client";
import { motion } from "framer-motion";
import { Info, Shield } from "lucide-react";
import { fadeIn, staggerContainer } from "@/utils/motion-variants";

export default function ProvinceInfoCards({ province, threat }) {
  return (
    <motion.div
      variants={staggerContainer()}
      initial="hidden"
      animate="visible"
      className="grid md:grid-cols-3 gap-6"
    >
      <motion.div
        variants={fadeIn("up", 0.1)}
        className="md:col-span-2 bg-white rounded-4xl p-8 border-3 border-black shadow-hard flex flex-col justify-center"
      >
        <h3 className="font-display text-2xl font-bold text-black mb-4 flex items-center gap-3">
          <span className="bg-green border-3 border-black p-2 rounded-xl shadow-hard">
            <Info size={24} strokeWidth={3} />
          </span>
          Tentang Provinsi
        </h3>
        <p className="text-black font-medium leading-relaxed text-lg border-l-4 border-black pl-4 ml-2">
          {province.description}
        </p>
      </motion.div>

      <motion.div
        variants={fadeIn("up", 0.2)}
        className="bg-purple rounded-4xl p-8 border-3 border-black shadow-hard space-y-8"
      >
        <div>
          <h3 className="font-display text-sm font-bold text-black/70 uppercase tracking-widest mb-3">
            Status Konservasi
          </h3>
          <div
            className={`inline-flex items-center gap-2 ${threat.bg} ${threat.color} font-display font-bold px-4 py-3 rounded-2xl w-full justify-center border-3 border-black shadow-hard`}
          >
            <Shield size={20} strokeWidth={2.5} />
            {threat.text}
          </div>
        </div>
        <div>
          <h3 className="font-display text-sm font-bold text-black/70 uppercase tracking-widest mb-3">
            Fauna Ikonik
          </h3>
          <div className="flex flex-wrap gap-2">
            {province.species.map((sp, i) => (
              <span
                key={i}
                className="bg-white border-[2.5px] border-black text-black font-display font-bold text-xs px-3 py-1.5 rounded-xl shadow-[2px_2px_0px_#0f0f0f]"
              >
                {sp}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
