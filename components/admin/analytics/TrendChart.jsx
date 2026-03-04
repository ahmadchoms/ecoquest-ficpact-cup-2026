import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { BarChart3 } from "lucide-react";

export default function TrendChart({ data }) {
  return (
    <div className="bg-white border-3 border-black rounded-4xl p-6 md:p-8 shadow-hard">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 bg-slate-100 border-2 border-black rounded-lg shadow-[2px_2px_0_#0f0f0f]">
          <BarChart3 size={20} className="text-black" />
        </div>
        <h2 className="text-xl font-display font-black uppercase tracking-tight">
          Tren Partisipasi vs Dampak Lingkungan
        </h2>
      </div>
      <div className="h-100 w-full">
        {data && data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient
                  id="colorPartisipasi"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="5%" stopColor="#f5e642" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#f5e642" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorEmisi" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#b5f0c0" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#b5f0c0" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fontWeight: 900, fill: "#64748b" }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fontWeight: 900, fill: "#64748b" }}
              />
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#e2e8f0"
              />
              <Tooltip
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
              <Area
                type="monotone"
                dataKey="partisipasi"
                name="Partisipasi"
                stroke="#000"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorPartisipasi)"
              />
              <Area
                type="monotone"
                dataKey="emisiDitekan"
                name="XP/Emisi"
                stroke="#000"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorEmisi)"
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-400 font-bold">
            Belum ada data di rentang waktu ini.
          </div>
        )}
      </div>
    </div>
  );
}
