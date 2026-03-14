export default function NumBadge({ n }) {
  return (
    <div className="shrink-0 w-[52px] h-[52px] rounded-full bg-yellow border-3 border-black flex items-center justify-center font-display font-extrabold text-[18px] text-black shadow-hard">
      #{n}
    </div>
  );
}
