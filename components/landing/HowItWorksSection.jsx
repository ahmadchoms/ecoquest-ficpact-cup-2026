import { motion } from "framer-motion";
import EcoBadge from "@/components/design-system/EcoBadge";
import NumBadge from "./NumBadge";
import IlluMap from "./illustrations/IlluMap";
import IlluTarget from "./illustrations/IlluTarget";
import IlluTrophy from "./illustrations/IlluTrophy";
const illustrations = {
  IlluMap: <IlluMap className="w-full h-full block" />,
  IlluTarget: <IlluTarget className="w-[200px] h-[200px] animate-float" />,
  IlluTrophy: <IlluTrophy className="w-[180px] h-[180px] animate-float" />,
};

export default function HowItWorksSection({ steps = [] }) {
  return (
    <section className="bg-white py-[100px] font-body">
      <div className="max-w-[1100px] mx-auto px-6">
        <div className="text-center mb-[72px]">
          <EcoBadge variant="green" className="mb-4">
            Cara Kerja
          </EcoBadge>
          <h2 className="font-display font-extrabold text-[clamp(36px,5vw,60px)] text-black leading-[1.1]">
            Cara Kerja EcoQuest
          </h2>
          <p className="text-[17px] text-[#666] mt-3">
            Tiga langkah mudah menjadi pahlawan lingkungan.
          </p>
        </div>

        {howItWorksSteps.map(({ num, title, desc, illustration, bg, flip }) => (
          <motion.div
            key={num}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className={`grid md:grid-cols-2 gap-10 items-center mb-16 ${flip ? "direction-rtl md:rtl" : ""}`}
          >
            <div
              className={`
                ${bg} border-3 border-black rounded-[32px] shadow-hard-lg 
                min-h-[280px] flex items-center justify-center p-8 
                ${flip ? "md:order-2" : "md:order-1"}
            `}
            >
              {illustrations[illustration]}
            </div>

            <div className={`${flip ? "md:order-1" : "md:order-2"}`}>
              <div className="flex items-center gap-3.5 mb-5">
                <NumBadge n={num} />
                <span className="font-body text-[13px] font-bold text-[#999] uppercase tracking-widest">
                  Step {num}
                </span>
              </div>
              <h3 className="font-display font-extrabold text-[clamp(28px,4vw,44px)] text-black leading-[1.15] mb-4">
                {title}
              </h3>
              <p className="text-[17px] text-[#555] leading-[1.75]">{desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
