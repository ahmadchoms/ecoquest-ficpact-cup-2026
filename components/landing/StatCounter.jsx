import useCountUp from "../../hooks/useCountUp";
import { formatCompactNumber } from "../../utils/formatters";

export default function StatCounter({ value, label, bg = "bg-yellow" }) {
    const { count, ref } = useCountUp(value, 2500);

    return (
        <div
            ref={ref}
            className={`${bg} border-3 border-black rounded-3xl shadow-hard p-6 text-center font-display`}
        >
            <div className="text-[clamp(36px,5vw,52px)] font-extrabold text-black leading-none">
                +{formatCompactNumber(count)}
            </div>
            <div className="font-body text-[13px] font-bold text-black mt-2 uppercase tracking-wide">
                {label}
            </div>
        </div>
    );
}
