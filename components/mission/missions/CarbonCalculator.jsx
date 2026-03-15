"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Calculator } from "lucide-react";
import {
  calculateCarbonFootprint,
  calculateProgressReward,
} from "@/utils/calculations";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const COLORS = ["#f97316", "#0ea5e9", "#22c55e"];

export default function CarbonCalculator({
  province,
  mission,
  onComplete,
  onBack,
}) {
  const [inputs, setInputs] = useState({
    carKm: 10,
    motorKm: 15,
    busKm: 0,
    acHour: 4,
    fridgeSize: "Medium",
    lampCount: 5,
    beefPortions: 3,
    chickenPortions: 5,
  });
  const [result, setResult] = useState(null);
  const [step, setStep] = useState(0);
  console.log(mission);

  const steps = [
    {
      title: "🚗 Transportasi",
      fields: [
        {
          key: "carKm",
          label: "Mobil (km/hari)",
          min: 0,
          max: 100,
          emoji: "🚗",
        },
        {
          key: "motorKm",
          label: "Motor (km/hari)",
          min: 0,
          max: 100,
          emoji: "🏍️",
        },
        {
          key: "busKm",
          label: "Bus/KRL (km/hari)",
          min: 0,
          max: 80,
          emoji: "🚌",
        },
      ],
    },
    {
      title: "🏠 Rumah Tangga",
      fields: [
        { key: "acHour", label: "AC (jam/hari)", min: 0, max: 24, emoji: "❄️" },
        {
          key: "lampCount",
          label: "Jumlah Lampu",
          min: 0,
          max: 20,
          emoji: "💡",
        },
      ],
    },
    {
      title: "🍖 Pola Makan",
      fields: [
        {
          key: "beefPortions",
          label: "Daging Merah (porsi/minggu)",
          min: 0,
          max: 14,
          emoji: "🥩",
        },
        {
          key: "chickenPortions",
          label: "Ayam/Ikan (porsi/minggu)",
          min: 0,
          max: 21,
          emoji: "🍗",
        },
      ],
    },
  ];

  const handleCalculate = () => {
    try {
      const calc = calculateCarbonFootprint(inputs);
      if (calc && calc.total !== undefined) {
        setResult(calc);
      } else {
        console.error("Invalid calculation result:", calc);
      }
    } catch (error) {
      console.error("Error calculating carbon footprint:", error);
    }
  };

  const handleSubmit = () => {
    if (!result || result.total === undefined) {
      console.error("Result data is missing!");
      return;
    }

    const tips = [];
    if (inputs.carKm > 20)
      tips.push(
        "Coba gunakan transportasi umum untuk mengurangi emisi kendaraan pribadi",
      );
    if (inputs.acHour > 6)
      tips.push(
        "Kurangi penggunaan AC dan gunakan kipas angin sebagai alternatif",
      );
    if (inputs.beefPortions > 5)
      tips.push("Kurangi konsumsi daging merah — coba meatless Monday!");
    if (inputs.lampCount > 8)
      tips.push("Ganti lampu pijar dengan LED untuk menghemat energi 80%");
    if (tips.length === 0)
      tips.push("Pertahankan gaya hidupmu yang ramah lingkungan!");

    // Calculate performance score (lower carbon = better performance)
    // If carbon footprint is low (< 5 ton/year), give full points
    // If carbon footprint is high (> 15 ton/year), give minimum points
    const maxCarbonForFullScore = 5;
    const minCarbonForMinScore = 15;
    let performancePercent = 100;

    if (result.total > maxCarbonForFullScore) {
      const carbonOverMax = result.total - maxCarbonForFullScore;
      const carbonRange = minCarbonForMinScore - maxCarbonForFullScore;
      performancePercent = Math.max(
        30,
        100 - (carbonOverMax / carbonRange) * 70,
      );
    }

    const { earnedXP, earnedPoints } = calculateProgressReward(
      performancePercent,
      mission.xpReward,
      mission.pointReward,
    );

    onComplete({
      score: Math.max(0, 100 - Math.round(result.total * 5)),
      earnedXP: earnedXP,
      earnedPoints: earnedPoints,
      performancePercent: Math.round(performancePercent),
      impactValues: { carbonSaved: result.total * 0.3 },
      tips,
    });
  };

  if (result) {
    const chartData = [
      { name: "Transportasi", value: result.breakdown.transport },
      { name: "Rumah Tangga", value: result.breakdown.household },
      { name: "Makanan", value: result.breakdown.food },
    ].filter((d) => d.value > 0);

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-5"
      >
        <h2 className="font-heading text-xl font-bold text-gray-800 text-center">
          📊 Hasil Jejak Karbonmu
        </h2>

        <div className="eco-card p-5 text-center">
          <p className="text-sm text-gray-500 mb-1">Total CO₂ per hari</p>
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
            {result.total} <span className="text-lg">kg</span>
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Rata-rata nasional: {result.nationalAverage} kg CO₂/hari
          </p>
          <div
            className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-medium ${
              result.comparison <= 0
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {result.comparison <= 0 ? "✅" : "⚠️"} {Math.abs(result.comparison)}
            % {result.comparison <= 0 ? "di bawah" : "di atas"} rata-rata
          </div>
        </div>

        <div className="eco-card p-5">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={3}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value.toFixed(1)}`}
              >
                {chartData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="eco-card p-4 text-center">
            <p className="text-2xl mb-1">🌳</p>
            <p className="font-bold text-lg text-gray-800">
              {result.treesNeeded}
            </p>
            <p className="text-xs text-gray-500">
              pohon dibutuhkan untuk menyerap
            </p>
          </div>
          <div className="eco-card p-4 text-center">
            <p className="text-2xl mb-1">📅</p>
            <p className="font-bold text-lg text-gray-800">
              {(result.total * 365).toFixed(0)}
            </p>
            <p className="text-xs text-gray-500">kg CO₂ per tahun</p>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          className="w-full py-3 bg-linear-to-r from-orange-500 to-orange-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
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
          className="h-full bg-linear-to-r from-orange-400 to-orange-600 rounded-full transition-all"
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

        <div className="space-y-5">
          {currentStep.fields.map((field) => (
            <div key={field.key} className="eco-card p-4">
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-medium text-gray-700">
                  {field.emoji} {field.label}
                </label>
                <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-bold min-w-12.5 text-center">
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
                className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-orange-500"
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
            className="flex-1 py-3 bg-linear-to-r from-orange-500 to-orange-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
          >
            Lanjut →
          </button>
        ) : (
          <button
            onClick={handleCalculate}
            className="flex-1 py-3 bg-linear-to-r from-orange-400 to-red-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <Calculator size={18} /> Hitung Jejak Karbon
          </button>
        )}
      </div>
    </div>
  );
}
