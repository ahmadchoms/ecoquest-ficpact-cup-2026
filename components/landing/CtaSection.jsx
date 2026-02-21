"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import EcoButton from "@/components/design-system/EcoButton";
import IlluLeaf from "./illustrations/IlluLeaf";
import IlluGlobe from "./illustrations/IlluGlobe";
import IlluTrophy from "./illustrations/IlluTrophy";

export default function CtaSection() {
  return (
    <section className="bg-yellow border-t-[2.5px] border-black py-[100px]">
      <div className="max-w-[900px] mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="flex justify-center gap-6 mb-10">
            <IlluLeaf className="w-20 h-20 animate-float" />
            <IlluGlobe className="w-32 h-32 animate-float" />
            <IlluTrophy
              className="w-20 h-20 animate-float"
              style={{ animationDelay: "1s" }}
            />
          </div>

          <h2 className="font-display font-extrabold text-[clamp(40px,6vw,72px)] text-black leading-[1.1] mb-5">
            Dari Web2 <br />
            <span className="bg-black text-yellow px-4 rounded-xl inline-block leading-[1.3] transform -rotate-1">
              Ke Aksi Nyata!
            </span>
          </h2>

          <p className="font-body text-lg text-[#444] max-w-[540px] mx-auto mb-10 leading-[1.75]">
            Jangan hanya membaca tentang perubahan iklim. Bergabunglah dengan
            EcoQuest dan jadilah bagian dari solusi hari ini.
          </p>

          <Link href="/map" className="inline-block group">
            <EcoButton
              variant="secondary"
              size="lg"
              className="px-9 py-4 text-[17px]"
            >
              Mulai Petualangan Gratis{" "}
              <ArrowRight
                size={20}
                className="group-hover:translate-x-2 transition-all"
              />
            </EcoButton>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
