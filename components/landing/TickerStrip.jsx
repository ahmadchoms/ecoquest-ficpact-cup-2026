export default function TickerStrip({ partners = [] }) {
  return (
    <section className="bg-yellow border-y-[2.5px] border-black overflow-hidden py-3.5">
      <div className="overflow-hidden">
        <div className="flex w-max animate-ticker gap-12">
          {/* Tripled for smoothness */}
          {[...partners, ...partners, ...partners].map((p, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="font-display font-extrabold text-base text-black whitespace-nowrap">
                ✦ {p}
              </span>
              <span className="w-2 h-2 rounded-full bg-black" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
