import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Map as MapIcon } from "lucide-react";

const COLORS = ["#b5f0c0", "#f5e642", "#c9b8ff", "#ffcc80", "#ff9999"];

export default function RegionalChart({ data }) {
  const hasData = data && data.length > 0 && data.some((r) => r.value > 0);

  return (
    <div className="lg:col-span-2 bg-white border-3 border-black rounded-4xl p-6 shadow-hard">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-slate-100 border-2 border-black rounded-lg shadow-[2px_2px_0_#0f0f0f]">
          <MapIcon size={20} className="text-black" />
        </div>
        <h2 className="text-lg font-display font-black uppercase tracking-tight">
          Volume Berdasarkan Wilayah
        </h2>
      </div>
      <div className="h-62.5 w-full">
        {hasData ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              layout="vertical"
              data={data}
              margin={{ top: 0, right: 30, left: 20, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                horizontal={false}
                stroke="#e2e8f0"
              />
              <XAxis type="number" hide />
              <YAxis
                dataKey="name"
                type="category"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fontWeight: 900, fill: "#0f0f0f" }}
              />
              <Tooltip
                cursor={{ fill: "transparent" }}
                contentStyle={{
                  borderRadius: "16px",
                  border: "3px solid black",
                  boxShadow: "4px 4px 0 black",
                  fontFamily: "var(--font-body)",
                  fontWeight: 900,
                  textTransform: "uppercase",
                  fontSize: "10px",
                }}
              />
              <Bar
                dataKey="value"
                name="Total Misi"
                barSize={24}
                radius={[0, 8, 8, 0]}
              >
                {data
                  .filter((r) => r.value > 0)
                  .map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                      stroke="#0f0f0f"
                      strokeWidth={2}
                    />
                  ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-400 font-bold">
            Belum ada data wilayah.
          </div>
        )}
      </div>
    </div>
  );
}
