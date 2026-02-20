import { useRef, useCallback } from "react";
import { useUserStore } from "../../store/useUserStore";
import { IMPACT_LABELS } from "../../utils/constants";
import EcoButton from "../design-system/EcoButton";

export default function ShareCard() {
  const cardRef = useRef(null);
  const { explorerName, level, totalXP, earnedBadges, completedMissions, exploredProvinces, impactData } = useUserStore();

  const handleShare = useCallback(async () => {
    if (!cardRef.current) return;
    try {
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        backgroundColor: '#f5e642', // Yellow bg
      });
      const link = document.createElement('a');
      link.download = 'ecoquest-impact.png';
      link.href = canvas.toDataURL();
      link.click();
    } catch (err) {
      console.error('Failed to generate image:', err);
    }
  }, []);

  return (
    <div>
      <div
        ref={cardRef}
        className="bg-yellow rounded-3xl p-6 border-3 border-black shadow-hard relative overflow-hidden font-body"
      >
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/20 rounded-full blur-2xl pointer-events-none" />

        <div className="text-center mb-5 relative z-10">
          <div className="text-3xl mb-1">🌿</div>
          <h3 className="font-display font-extrabold text-lg text-black">EcoQuest Indonesia</h3>
          <p className="text-xs font-bold text-black/60 uppercase tracking-widest">Dampak Lingkunganku</p>
        </div>

        <div className="flex items-center justify-center gap-4 mb-6 relative z-10">
          <div className="text-center">
            <p className="text-2xl font-display font-extrabold text-black">{level}</p>
            <p className="text-[10px] font-bold text-black/60 uppercase">Level</p>
          </div>
          <div className="w-0.5 h-8 bg-black/10" />
          <div className="text-center">
            <p className="text-2xl font-display font-extrabold text-black">{totalXP}</p>
            <p className="text-[10px] font-bold text-black/60 uppercase">Total XP</p>
          </div>
          <div className="w-0.5 h-8 bg-black/10" />
          <div className="text-center">
            <p className="text-2xl font-display font-extrabold text-black">{exploredProvinces.length}</p>
            <p className="text-[10px] font-bold text-black/60 uppercase">Provinsi</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 relative z-10">
          {Object.entries(IMPACT_LABELS).map(([key, { icon, label, unit }]) => (
            <div key={key} className="bg-white border-2 border-black rounded-xl p-2 text-center shadow-[2px_2px_0_rgba(0,0,0,0.1)]">
              <span className="text-lg block mb-1">{icon}</span>
              <p className="text-sm font-extrabold text-black">{impactData[key] || 0}</p>
              <p className="text-[9px] font-bold text-gray-500 uppercase">{unit}</p>
            </div>
          ))}
        </div>

        <p className="text-center text-[10px] font-bold text-black/40 mt-4 uppercase tracking-widest">ecoquest.id</p>
      </div>

      <EcoButton
        onClick={handleShare}
        variant="primary"
        className="w-full mt-4"
      >
        📸 Download & Share
      </EcoButton>
    </div>
  );
}
