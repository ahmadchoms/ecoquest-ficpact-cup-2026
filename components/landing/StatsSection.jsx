import EcoBadge from "../design-system/EcoBadge";
import StatCounter from "./StatCounter";
import IlluMap from "./illustrations/IlluMap";

export default function StatsSection() {
    return (
        <section className="bg-green border-y-[2.5px] border-black py-[80px]">
            <div className="max-w-[1100px] mx-auto px-6">
                <div className="grid md:grid-cols-2 gap-12 items-center">

                    <div>
                        <div className="border-3 border-black rounded-[32px] shadow-hard-xl overflow-hidden bg-white">
                            <IlluMap className="w-full block" />
                        </div>
                    </div>

                    <div>
                        <EcoBadge variant="yellow" className="mb-5 shadow-hard">Dampak EcoQuest</EcoBadge>
                        <h2 className="font-display font-extrabold text-[clamp(28px,4vw,46px)] text-black mb-9 leading-[1.2]">
                            EcoQuest Memberdayakan{" "}
                            <span className="underline decoration-yellow decoration-[5px]">
                                Pelajar Indonesia
                            </span>{" "}
                            Untuk Berdampak Nyata.
                        </h2>

                        <div className="grid grid-cols-2 gap-4">
                            <StatCounter value={34} label="Provinsi" bg="bg-yellow" />
                            <StatCounter value={170} label="Misi" bg="bg-orange" />
                            <StatCounter value={300} label="Spesies" bg="bg-purple" />
                            <StatCounter value={5000} label="Pemain" bg="bg-yellow" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
