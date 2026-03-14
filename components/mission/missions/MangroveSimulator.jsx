"use client";

import { useState, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, TreePine } from "lucide-react";
import { calculateProgressReward } from "@/data/missions";

const ROWS = 6;
const COLS = 8;

function generateGrid() {
  const grid = [];
  for (let r = 0; r < ROWS; r++) {
    const row = [];
    for (let c = 0; c < COLS; c++) {
      const rand = Math.random();
      let type;
      if (rand < 0.15) type = "water";
      else if (rand < 0.25) type = "sand";
      else type = "damaged";
      row.push({ type, planted: false });
    }
    row.push();
    grid.push(row);
  }
  return grid;
}

const cellStyles = {
  water: { bg: "bg-blue-400", emoji: "🌊" },
  sand: { bg: "bg-amber-200", emoji: "🏖️" },
  damaged: { bg: "bg-amber-700", emoji: "" },
  planted: { bg: "bg-green-500", emoji: "🌿" },
  growing: { bg: "bg-green-600", emoji: "🌳" },
};

export default function MangroveSimulator({
  province,
  mission,
  onComplete,
  onBack,
}) {
  const [grid, setGrid] = useState(() => generateGrid());
  const [budget, setBudget] = useState(30);
  const [phase, setPhase] = useState("planting"); // planting | result

  const totalDamaged = useMemo(() => {
    let count = 0;
    grid.forEach((row) =>
      row.forEach((cell) => {
        if (cell.type === "damaged" || cell.planted) count++;
      }),
    );
    return count;
  }, []);

  const plantedCount = useMemo(() => {
    let count = 0;
    grid.forEach((row) =>
      row.forEach((cell) => {
        if (cell.planted) count++;
      }),
    );
    return count;
  }, [grid]);

  const restoredPercent =
    totalDamaged > 0 ? Math.round((plantedCount / totalDamaged) * 100) : 0;

  const handleCellClick = useCallback(
    (r, c) => {
      if (phase !== "planting" || budget <= 0) return;
      const cell = grid[r][c];
      if (cell.type !== "damaged" || cell.planted) return;

      const newGrid = grid.map((row, ri) =>
        row.map((cell, ci) => {
          if (ri === r && ci === c) return { ...cell, planted: true };
          return cell;
        }),
      );
      setGrid(newGrid);
      setBudget(budget - 1);
    },
    [grid, budget, phase],
  );

  const handleFinish = () => {
    setPhase("result");
    const { earnedXP, earnedPoints } = calculateProgressReward(
      restoredPercent,
      mission.xpReward,
      mission.pointReward
    );

    onComplete({
      score: restoredPercent,
      earnedXP: earnedXP,
      earnedPoints: earnedPoints,
      performancePercent: restoredPercent,
      impactValues: {
        mangroveRestored: plantedCount,
        carbonSaved: plantedCount * 0.5,
      },
      tips: [
        "Dukung program penanaman mangrove di pesisir Indonesia",
        "Hindari konsumsi produk dari area mangrove yang dikonversi",
        "Mangrove menyerap 4x lebih banyak karbon dari hutan biasa!",
      ],
    });
  };

  const getCellDisplay = (cell) => {
    if (cell.planted) {
      const neighbors = 0; // simplified
      return cell.planted ? cellStyles.planted : cellStyles[cell.type];
    }
    return cellStyles[cell.type];
  };

  if (phase === "result") return null;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-gray-500 hover:text-gray-700 text-sm"
        >
          <ArrowLeft size={16} /> Kembali
        </button>
        <div className="flex items-center gap-3">
          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
            <TreePine size={14} /> {budget} bibit
          </span>
          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-bold">
            {restoredPercent}%
          </span>
        </div>
      </div>

      <div className="eco-card p-4">
        <h3 className="font-heading font-bold text-gray-800 mb-1">
          🌊 Pantai {province.name}
        </h3>
        <p className="text-xs text-gray-500 mb-3">
          Klik area rusak (🟫) untuk menanam mangrove. Target: 50% dipulihkan.
        </p>

        <div className="bg-linear-to-b from-sky-200 to-sky-100 rounded-xl p-3 overflow-x-auto">
          <div
            className="inline-grid gap-1"
            style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)` }}
          >
            {grid.map((row, r) =>
              row.map((cell, c) => {
                const display = getCellDisplay(cell);
                const isDamaged = cell.type === "damaged" && !cell.planted;
                const isPlanted = cell.planted;

                return (
                  <motion.button
                    key={`${r}-${c}`}
                    whileHover={isDamaged && budget > 0 ? { scale: 1.1 } : {}}
                    whileTap={isDamaged && budget > 0 ? { scale: 0.9 } : {}}
                    onClick={() => handleCellClick(r, c)}
                    className={`w-9 h-9 md:w-10 md:h-10 rounded-lg flex items-center justify-center text-sm transition-all
                      ${
                        isPlanted
                          ? "bg-green-500 shadow-sm shadow-green-300"
                          : cell.type === "water"
                            ? "bg-blue-400"
                            : cell.type === "sand"
                              ? "bg-amber-200"
                              : "bg-amber-700 hover:bg-amber-600"
                      }
                      ${isDamaged && budget > 0 ? "cursor-pointer ring-1 ring-amber-400/50" : ""}
                      ${isDamaged && budget <= 0 ? "cursor-not-allowed" : ""}`}
                  >
                    {isPlanted
                      ? "🌿"
                      : cell.type === "water"
                        ? "🌊"
                        : cell.type === "sand"
                          ? ""
                          : ""}
                  </motion.button>
                );
              }),
            )}
          </div>
        </div>

        <div className="mt-3 flex items-center gap-2">
          <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${restoredPercent >= 50 ? "bg-green-500" : "bg-amber-400"}`}
              style={{ width: `${restoredPercent}%` }}
            />
          </div>
          <span className="text-xs text-gray-500">
            {restoredPercent}% pulih
          </span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="eco-card p-3">
          <p className="text-lg font-bold text-green-600">{plantedCount}</p>
          <p className="text-[10px] text-gray-500">Ditanam</p>
        </div>
        <div className="eco-card p-3">
          <p className="text-lg font-bold text-blue-600">{budget}</p>
          <p className="text-[10px] text-gray-500">Sisa Bibit</p>
        </div>
        <div className="eco-card p-3">
          <p className="text-lg font-bold text-amber-600">
            {(plantedCount * 0.5).toFixed(1)}
          </p>
          <p className="text-[10px] text-gray-500">kg CO₂</p>
        </div>
      </div>

      <button
        onClick={handleFinish}
        disabled={plantedCount === 0}
        className={`w-full py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2
          ${
            plantedCount > 0
              ? "bg-linear-to-r from-blue-400 to-cyan-500 text-white hover:shadow-lg"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
      >
        {plantedCount > 0 ? "🌿 Selesai Menanam" : "Tanam dulu!"}
      </button>
    </div>
  );
}
