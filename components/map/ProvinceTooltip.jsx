export default function ProvinceTooltip({ province, progress }) {
  if (!province) return null;

  return (
    <div className="bg-white rounded-xl shadow-lg p-3 min-w-[180px]">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-xl">{province.illustration}</span>
        <div>
          <p className="font-heading font-bold text-sm text-gray-800">{province.name}</p>
          <p className="text-xs text-gray-500">{province.region}</p>
        </div>
      </div>
      <div className="w-full h-1.5 bg-gray-100 rounded-full mt-2 overflow-hidden">
        <div
          className="h-full rounded-full transition-all"
          style={{
            width: `${progress}%`,
            backgroundColor: progress === 100 ? '#22c55e' : progress > 0 ? '#fbbf24' : '#ef4444',
          }}
        />
      </div>
      <p className="text-[10px] text-gray-400 mt-1">{progress}% selesai</p>
    </div>
  );
}
