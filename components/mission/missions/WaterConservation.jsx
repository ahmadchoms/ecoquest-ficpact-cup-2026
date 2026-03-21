"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Droplets } from "lucide-react";
import { calculateWaterUsage, calculateProgressReward } from "@/utils/calculations";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const COLORS = [
  "#0ea5e9",
  "#06b6d4",
  "#22d3ee",
  "#67e8f9",
  "#a5f3fc",
  "#0284c7",
];

export default function WaterConservation({
  province,
  mission,
  onComplete,
  onBack,
}) {
  const [inputs, setInputs] = useState({
    bathMin: 10,
    useShower: true,
    flushCount: 5,
    useTapDish: true,
    cookingPortions: 3,
    washMachine: 3,
    plantWater: 5,
  });
  const [result, setResult] = useState(null);
  const [step, setStep] = useState(0);
  const [showTutorial, setShowTutorial] = useState(true);

  const handleStartGame = () => {
    setShowTutorial(false);
  };

  const steps = [
    {
      title: "🚿 Mandi & Toilet",
      fields: [
        {
          key: "bathMin",
          label: "Durasi mandi (menit)",
          min: 1,
          max: 30,
          emoji: "🚿",
        },
        {
          key: "flushCount",
          label: "Flush toilet (kali/hari)",
          min: 1,
          max: 10,
          emoji: "🚽",
        },
      ],
      toggles: [
        { key: "useShower", labelOn: "Shower", labelOff: "Ember", emoji: "🚿" },
      ],
    },
    {
      title: "🍳 Dapur & Cuci",
      fields: [
        {
          key: "cookingPortions",
          label: "Porsi masak per hari",
          min: 0,
          max: 10,
          emoji: "🍳",
        },
        {
          key: "washMachine",
          label: "Cuci mesin (kali/minggu)",
          min: 0,
          max: 7,
          emoji: "👕",
        },
        {
          key: "plantWater",
          label: "Siram tanaman (liter/hari)",
          min: 0,
          max: 30,
          emoji: "🌱",
        },
      ],
      toggles: [
        {
          key: "useTapDish",
          labelOn: "Kran Air",
          labelOff: "Wastafel Penuh",
          emoji: "🍽️",
        },
      ],
    },
  ];

  const handleCalculate = () => {
    const calc = calculateWaterUsage(inputs);
    setResult(calc);
  };

  const handleSubmit = () => {
    if (!result || !mission) return;

    const tips = [];
    if (inputs.useShower && inputs.bathMin > 10)
      tips.push("Kurangi durasi shower — setiap menit menghemat 12 liter air");
    if (inputs.useTapDish)
      tips.push(
        "Cuci piring pakai wastafel penuh bisa hemat hingga 50 liter per sesi",
      );
    if (inputs.washMachine > 4)
      tips.push("Kumpulkan cucian dan cuci seminggu 2-3 kali saja");
    if (inputs.plantWater > 10)
      tips.push("Gunakan air bekas cucian untuk menyiram tanaman");
    if (tips.length === 0)
      tips.push("Penggunaan airmu sudah sangat hemat — pertahankan!");

    // Calculate performance score based on water usage efficiency
    // Ideal usage is < 100L per day, less is better
    const idealUsage = 100;
    const maxUsage = 300;
    let performancePercent = 100;
    
    if (result.total > idealUsage) {
      const usageOverIdeal = result.total - idealUsage;
      const usageRange = maxUsage - idealUsage;
      performancePercent = Math.max(
        30,
        100 - (usageOverIdeal / usageRange) * 70
      );
    }

    onComplete({
      score: Math.max(0, 100 - Math.round((result.total / 300) * 100)),
      performancePercent: Math.round(performancePercent),
      impactValues: { waterSaved: Math.max(0, result.total * 0.2) },
      tips,
    });
  };

  if (showTutorial) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      >
        <motion.div
          className="bg-white rounded-3xl p-10 max-w-lg w-full shadow-2xl max-h-[90vh] overflow-y-auto"
          initial={{ y: 20 }}
          animate={{ y: 0 }}
        >
          <div className="text-center space-y-6">
            <div>
              <p className="text-6xl mb-2">💧</p>
              <h2 className="font-heading text-2xl font-bold text-gray-800">
                Water Conservation
              </h2>
            </div>

            <div className="space-y-4 bg-blue-50 p-4 rounded-xl text-left">
              <div className="flex gap-3">
                <span className="text-2xl flex-shrink-0">🎯</span>
                <div>
                  <p className="font-semibold text-gray-800">Tujuan Game:</p>
                  <p className="text-sm text-gray-600">
                    Cek penggunaan air harianmu dan pelajari cara menghemat!
                  </p>
                </div>
              </div>

              <div className="border-t pt-4">
                <p className="font-semibold text-gray-800 mb-3">📖 Cara Main:</p>
                <div className="space-y-2 text-sm">
                  <div className="flex gap-2">
                    <span className="font-bold text-blue-600 flex-shrink-0">1.</span>
                    <p className="text-gray-700">Isi data penggunaan air harianmu</p>
                  </div>
                  <div className="flex gap-2">
                    <span className="font-bold text-blue-600 flex-shrink-0">2.</span>
                    <p className="text-gray-700">Gunakan slider untuk setiap aktivitas</p>
                  </div>
                  <div className="flex gap-2">
                    <span className="font-bold text-blue-600 flex-shrink-0">3.</span>
                    <p className="text-gray-700">Pilih tipe penggunaan (shower/ember, kran/wastafel)</p>
                  </div>
                  <div className="flex gap-2">
                    <span className="font-bold text-blue-600 flex-shrink-0">4.</span>
                    <p className="text-gray-700">Klik "Hitung Konsumsi Air" untuk hasil</p>
                  </div>
                  <div className="flex gap-2">
                    <span className="font-bold text-blue-600 flex-shrink-0">5.</span>
                    <p className="text-gray-700">Dapatkan tips hemat air!</p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <p className="font-semibold text-gray-800 mb-2">🚿 Kategori:</p>
                <div className="space-y-2 text-xs">
                  <p>🚿 <strong>Mandi & Toilet:</strong> Durasi & frekuensi</p>
                  <p>🍳 <strong>Dapur & Cuci:</strong> Memasak, cuci piring, mesin</p>
                  <p>🌱 <strong>Kebutuhan Lain:</strong> Siram tanaman</p>
                </div>
              </div>

              <div className="border-t pt-4">
                <p className="text-sm text-gray-700">
                  💡 <strong>Rata-rata:</strong> Penggunaan air ideal 100 L/hari
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={onBack}
                className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-all"
              >
                Kembali
              </button>
              <button
                onClick={handleStartGame}
                className="flex-1 py-3 bg-gradient-to-r from-blue-400 to-blue-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
              >
                Mulai Game 🚀
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  if (result && result.total !== undefined && result.breakdown) {
    const chartData = Object.entries(result.breakdown)
      .filter(([, v]) => v > 0)
      .map(([key, value]) => ({
        name:
          key === "bathing"
            ? "Mandi"
            : key === "toilet"
              ? "Toilet"
              : key === "kitchen"
                ? "Dapur"
                : key === "cooking"
                  ? "Masak"
                  : key === "laundry"
                    ? "Cuci"
                    : "Tanaman",
        value: Math.round(value * 10) / 10,
      }));

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-5"
      >
        <h2 className="font-heading text-xl font-bold text-gray-800 text-center">
          💧 Hasil Konsumsi Airmu
        </h2>

        <div className="eco-card p-5 text-center">
          <p className="text-sm text-gray-500 mb-1">
            Total penggunaan per hari
          </p>
          <p
            className={`font-heading text-4xl font-bold ${
              result.rating === "excellent"
                ? "text-green-500"
                : result.rating === "good"
                  ? "text-blue-500"
                  : result.rating === "average"
                    ? "text-yellow-500"
                    : "text-red-500"
            }`}
          >
            {result.total} <span className="text-lg">liter</span>
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Rata-rata nasional: {result.nationalAverage || 150} liter/hari
          </p>
          <div
            className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-medium ${
              result.total <= (result.nationalAverage || 150)
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {result.total <= (result.nationalAverage || 150)
              ? "✅ Di bawah rata-rata"
              : "⚠️ Di atas rata-rata"}
          </div>
        </div>

        <div className="eco-card p-5">
          <p className="text-sm text-gray-500 mb-3 text-center">
            Breakdown Penggunaan
          </p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} unit="L" />
              <Tooltip />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {chartData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="eco-card p-4 text-center">
            <p className="text-2xl mb-1">🚰</p>
            <p className="font-bold text-lg text-gray-800">
              {result.bottleEquivalent}
            </p>
            <p className="text-xs text-gray-500">botol air 600ml</p>
          </div>
          <div className="eco-card p-4 text-center">
            <p className="text-2xl mb-1">📅</p>
            <p className="font-bold text-lg text-gray-800">
              {result.yearlyUsage.toLocaleString()}
            </p>
            <p className="text-xs text-gray-500">liter per tahun</p>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          className="w-full py-3 bg-linear-to-r from-sky-400 to-blue-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
        >
          Selesai & Klaim XP ⚡
        </button>
      </motion.div>
    );
  }

  const currentStep = steps[step];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <button
          onClick={step > 0 ? () => setStep(step - 1) : onBack}
          className="flex items-center gap-1 text-gray-500 hover:text-gray-700 text-sm"
        >
          <ArrowLeft size={16} /> {step > 0 ? "Sebelumnya" : "Kembali"}
        </button>
        <span className="text-sm text-gray-400">
          {step + 1}/{steps.length}
        </span>
      </div>

      <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-linear-to-r from-sky-400 to-blue-500 rounded-full transition-all"
          style={{ width: `${((step + 1) / steps.length) * 100}%` }}
        />
      </div>

      <motion.div
        key={step}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <h3 className="font-heading text-xl font-bold text-gray-800 mb-4">
          {currentStep.title}
        </h3>

        {currentStep.toggles?.map((toggle) => (
          <div key={toggle.key} className="eco-card p-4 mb-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">
                {toggle.emoji} Tipe
              </span>
              <div className="flex items-center bg-gray-100 rounded-full p-1">
                <button
                  onClick={() => setInputs({ ...inputs, [toggle.key]: true })}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all
                    ${inputs[toggle.key] ? "bg-blue-500 text-white" : "text-gray-500"}`}
                >
                  {toggle.labelOn}
                </button>
                <button
                  onClick={() => setInputs({ ...inputs, [toggle.key]: false })}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all
                    ${!inputs[toggle.key] ? "bg-blue-500 text-white" : "text-gray-500"}`}
                >
                  {toggle.labelOff}
                </button>
              </div>
            </div>
          </div>
        ))}

        <div className="space-y-4">
          {currentStep.fields.map((field) => (
            <div key={field.key} className="eco-card p-4">
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-medium text-gray-700">
                  {field.emoji} {field.label}
                </label>
                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-bold min-w-[50px] text-center">
                  {inputs[field.key]}
                </span>
              </div>
              <input
                type="range"
                min={field.min}
                max={field.max}
                value={inputs[field.key]}
                onChange={(e) =>
                  setInputs({ ...inputs, [field.key]: Number(e.target.value) })
                }
                className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-blue-500"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>{field.min}</span>
                <span>{field.max}</span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      <div className="flex gap-3">
        {step < steps.length - 1 ? (
          <button
            onClick={() => setStep(step + 1)}
            className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
          >
            Lanjut →
          </button>
        ) : (
          <button
            onClick={handleCalculate}
            className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <Droplets size={18} /> Hitung Konsumsi Air
          </button>
        )}
      </div>
    </div>
  );
}
