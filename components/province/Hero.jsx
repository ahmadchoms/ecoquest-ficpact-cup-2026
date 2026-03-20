"use client";
import { motion } from "framer-motion";
import { MapPin, ArrowLeft } from "lucide-react";
import NeoButton from "@/components/ui/NeoButton";
import ProgressRing from "@/components/ui/ProgressRing";

function HeroPattern() {
  return (
    <svg
      className="absolute inset-0 w-full h-full opacity-10 pointer-events-none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <pattern
        id="hero-pattern"
        x="0"
        y="0"
        width="40"
        height="40"
        patternUnits="userSpaceOnUse"
      >
        <path
          d="M0 40L40 0H20L0 20M40 40V20L20 40"
          stroke="black"
          strokeWidth="2"
          fill="none"
        />
      </pattern>
      <rect width="100%" height="100%" fill="url(#hero-pattern)" />
    </svg>
  );
}

export default function ProvinceHero({ province, progress, onBack }) {
  const province_region = province.region
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

  return (
    <div className="relative overflow-hidden bg-mint border-b-[3px] border-black pb-24 -mt-20 pt-32 rounded-b-4xl shadow-hard z-0">
      <HeroPattern />
      <div className="relative z-10 max-w-5xl mx-auto px-4">
        <NeoButton
          onClick={onBack}
          icon={<ArrowLeft size={18} strokeWidth={3} />}
          className="mb-8 w-max"
        >
          Kembali ke Peta
        </NeoButton>

        <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-8xl md:text-9xl bg-white border-3 border-black shadow-hard-xl rounded-4xl p-6 animate-float"
          >
            {province.illustration}
          </motion.div>

          <div className="flex-1 space-y-4">
            <div>
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="inline-flex items-center gap-2 bg-yellow border-3 border-black shadow-hard px-4 py-1.5 rounded-2xl font-display font-bold text-sm text-black mb-4"
              >
                <MapPin size={18} strokeWidth={2.5} /> {province_region}
              </motion.div>
              <motion.h1
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="font-display text-3xl md:text-7xl font-black text-black leading-tight uppercase tracking-tight"
              >
                {province.name}
              </motion.h1>
            </div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex flex-wrap gap-3 pt-2"
            >
              {province.ecosystems.map((eco, i) => (
                <span
                  key={i}
                  className="bg-white border-3 border-black text-black font-display font-bold text-sm px-5 py-2 rounded-2xl shadow-hard hover:-translate-x-0.5 hover:-translate-y-0.5 transition-transform cursor-default"
                >
                  {eco}
                </span>
              ))}
            </motion.div>
          </div>

          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-yellow border-3 border-black shadow-hard p-6 rounded-4xl text-center min-w-40 transform hover:rotate-3 transition-transform"
          >
            <ProgressRing
              progress={progress}
              size={90}
              color="#0f0f0f"
              strokeWidth={8}
              trackColor="#0f0f0f20"
            >
              <div className="flex flex-col items-center">
                <span className="text-3xl font-display font-black text-black">
                  {Math.round(progress)}%
                </span>
              </div>
            </ProgressRing>
            <p className="text-black text-sm font-display font-bold uppercase mt-3 tracking-widest">
              Explored
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
