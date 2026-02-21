import { PROGRESS_COLORS } from "@/utils/constants";

export default function MapLegend() {
  const items = [
    { color: PROGRESS_COLORS.notStarted, label: "Belum Dimulai" },
    { color: PROGRESS_COLORS.inProgress, label: "Dalam Progress" },
    { color: PROGRESS_COLORS.completed, label: "Selesai" },
  ];

  return (
    <div className="absolute bottom-4 right-4 z-[500] glass rounded-xl p-3">
      <p className="text-xs font-semibold text-gray-700 mb-2">Legenda</p>
      <div className="space-y-1.5">
        {items.map((item) => (
          <div key={item.label} className="flex items-center gap-2">
            <div
              className="w-3.5 h-3.5 rounded"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-[11px] text-gray-600">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
