"use client";

import { Suspense, lazy } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Globe, Star } from "lucide-react";
import EcoBadge from "@/components/design-system/EcoBadge";
import EcoButton from "@/components/design-system/EcoButton";
import { fadeIn, staggerContainer } from "@/utils/motion-variants";
import IlluGlobe from "./illustrations/IlluGlobe";
import ErrorBoundary from "@/components/ui/ErrorBoundary";

// Lazy load 3D component
const EcoGlobe = lazy(() => import("../3d/EcoGlobe"));

export default function HeroSection({ firstVisit }) {
  return (
    <section className="bg-white overflow-hidden font-body">
      <div className="max-w-7xl mx-auto px-6 pt-[60px]">
        <div className="flex justify-center mb-8">
          <EcoBadge variant="yellow" className="shadow-hard">
            <span className="w-2 h-2 rounded-full bg-black inline-block mr-2" />
            Edu-Game Lingkungan #1 Indonesia
          </EcoBadge>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            variants={staggerContainer()}
            initial="hidden"
            animate="visible"
          >
            <motion.h1
              variants={fadeIn("up", 0)}
              className="font-display font-extrabold text-[clamp(48px,6vw,82px)] leading-[1.05] text-black mb-6 tracking-tight"
            >
              Platform{" "}
              <span className="bg-yellow px-3 py-1 rounded-xl border-3 border-black inline-block leading-tight">
                Edukasi
              </span>
              <br />
              Untuk{" "}
              <span className="underline decoration-green decoration-[6px]">
                Indonesia
              </span>
            </motion.h1>

            <motion.p
              variants={fadeIn("up", 0.2)}
              className="text-lg text-[#444] leading-relaxed mb-9 max-w-md"
            >
              Bergabunglah dalam misi menyelamatkan bumi. Pelajari, mainkan, dan
              buat dampak nyata dari rumahmu.
            </motion.p>

            <motion.div
              variants={fadeIn("up", 0.4)}
              className="flex flex-wrap gap-4"
            >
              <Link href="/map" className="group">
                <EcoButton variant="primary" size="lg">
                  Mulai Sekarang{" "}
                  <ArrowRight
                    size={18}
                    className="group-hover:translate-x-1.5 transition-all"
                  />
                </EcoButton>
              </Link>
              {!firstVisit && (
                <Link href="/dashboard">
                  <EcoButton variant="secondary" size="lg">
                    Dashboard Saya
                  </EcoButton>
                </Link>
              )}
            </motion.div>

            <motion.div
              variants={fadeIn("up", 0.6)}
              className="flex flex-wrap gap-3 mt-7"
            >
              {["🌿 Gratis Selamanya", "🏆 5000+ Pemain", "🗺️ 34 Provinsi"].map(
                (t) => (
                  <EcoBadge key={t} variant="mint">
                    {t}
                  </EcoBadge>
                ),
              )}
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.85, rotate: 3 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative"
          >
            <div className="border-3 border-black rounded-[32px] shadow-hard-xl bg-[#0b1a2e] overflow-hidden aspect-square w-full">
              <ErrorBoundary
                fallback={
                  <div className="w-full h-full bg-green rounded-3xl flex items-center justify-center">
                    <IlluGlobe className="w-[200px] h-[200px] text-black" />
                  </div>
                }
              >
                <Suspense fallback={null}>
                  <EcoGlobe />
                </Suspense>
              </ErrorBoundary>
            </div>

            <div className="absolute -bottom-5 -left-6 bg-yellow border-3 border-black rounded-2xl px-5 py-3 font-display font-extrabold text-sm flex items-center gap-2 shadow-hard">
              <Globe size={18} /> +1M Dampak Nyata
            </div>

            <div className="absolute -top-4 -right-4 w-[52px] h-[52px] bg-green border-3 border-black rounded-full flex items-center justify-center shadow-hard animate-wiggle">
              <Star size={22} fill="#0f0f0f" />
            </div>
          </motion.div>
        </div>
      </div>

      <div className="mt-[60px] h-3 bg-[repeating-linear-gradient(90deg,var(--color-black)_0,var(--color-black)_20px,var(--color-yellow)_20px,var(--color-yellow)_40px)]" />
    </section>
  );
}
