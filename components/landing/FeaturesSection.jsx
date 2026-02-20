import { motion } from "framer-motion";
import { Globe, Target, Leaf, Users } from "lucide-react";
import EcoBadge from "../design-system/EcoBadge";
import { features } from "../../data/landing";

const iconMap = {
    Globe: <Globe size={28} />,
    Target: <Target size={28} />,
    Leaf: <Leaf size={28} />,
    Users: <Users size={28} />,
};

export default function FeaturesSection() {
    return (
        <section className="bg-white py-[100px]">
            <div className="max-w-[1100px] mx-auto px-6">

                <div className="text-center mb-14">
                    <EcoBadge variant="mint" className="mb-4">Fitur</EcoBadge>
                    <h2 className="font-display font-extrabold text-[clamp(36px,5vw,60px)] text-black">
                        Fitur Unggulan
                    </h2>
                    <p className="text-[17px] text-[#666] mt-3">Teknologi modern untuk pengalaman belajar yang imersif.</p>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {features.map((feat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className={`border-3 border-black rounded-[20px] p-7 shadow-hard hover:shadow-hard-lg hover:-translate-y-1 transition-all ${feat.bg}`}
                        >
                            <div
                                className="w-[52px] h-[52px] rounded-xl bg-white border-2 border-black flex items-center justify-center mb-[18px]"
                            >
                                {iconMap[feat.iconName]}
                            </div>
                            <h3 className="font-display font-extrabold text-lg text-black mb-2.5">{feat.title}</h3>
                            <p className="font-body text-sm text-[#444] leading-[1.65]">{feat.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
