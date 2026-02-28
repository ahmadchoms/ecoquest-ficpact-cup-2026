"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, RefreshCw, Zap } from "lucide-react";

const VEHICLES = {
  walk: { name: "Jalan Kaki", emoji: "🚶", emissionPerTile: 0, color: "bg-green-400" },
  bike: { name: "Sepeda", emoji: "🚴", emissionPerTile: 0, color: "bg-green-500" },
  motorcycle: { name: "Motor", emoji: "🏍️", emissionPerTile: 0.05, color: "bg-yellow-400" },
  car: { name: "Mobil", emoji: "🚗", emissionPerTile: 0.12, color: "bg-red-400" },
  bus: { name: "Bus", emoji: "🚌", emissionPerTile: 0.06, color: "bg-blue-400" },
  train: { name: "Kereta", emoji: "🚂", emissionPerTile: 0.03, color: "bg-cyan-400" },
};

const TILE_TYPES = {
  normal: { name: "Normal", emoji: "⬜", modifier: 1 },
  park: { name: "Taman", emoji: "🌳", modifier: 0.9 }, // -10%
  traffic: { name: "Macet", emoji: "🚦", modifier: 1.2 }, // +20%
};

const GRID_SIZE = 10;
const GAME_DURATION = 120;

export default function EcoRoute({ province, mission, onComplete, onBack }) {
  const [gameState, setGameState] = useState("vehicleSelect"); // vehicleSelect, playing, finished
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [grid, setGrid] = useState([]);
  const [path, setPath] = useState([]);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [result, setResult] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [startPos, setStartPos] = useState({ x: 1, y: 1 });
  const [endPos, setEndPos] = useState({ x: 8, y: 8 });

  // Initialize grid with random tiles
  useEffect(() => {
    setMounted(true);
    const newGrid = Array(GRID_SIZE)
      .fill(null)
      .map(() =>
        Array(GRID_SIZE)
          .fill(null)
          .map(() => {
            const rand = Math.random();
            if (rand < 0.2) return "park";
            if (rand < 0.4) return "traffic";
            return "normal";
          })
      );
    setGrid(newGrid);
  }, []);

  // Game timer
  useEffect(() => {
    if (gameState !== "playing" || !mounted) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setGameState("finished");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState, mounted]);

  const startGame = (vehicleKey) => {
    setSelectedVehicle(vehicleKey);
    setPath([startPos]);
    setGameState("playing");
    setTimeLeft(GAME_DURATION);
  };

  const isAdjacent = (pos1, pos2) => {
    return Math.abs(pos1.x - pos2.x) + Math.abs(pos1.y - pos2.y) === 1;
  };

  const handleTileClick = useCallback(
    (x, y) => {
      if (gameState !== "playing" || !selectedVehicle || !grid.length) return;

      const newPos = { x, y };
      const lastPos = path[path.length - 1];

      // Check if position is adjacent
      if (!isAdjacent(lastPos, newPos)) return;

      // Check if already in path
      if (path.some((p) => p.x === x && p.y === y)) return;

      const newPath = [...path, newPos];
      setPath(newPath);

      // Check if reached destination
      if (x === endPos.x && y === endPos.y) {
        finishGame(newPath);
      }
    },
    [path, gameState, selectedVehicle, grid, endPos]
  );

  const finishGame = (finalPath) => {
    const tilesTraversed = finalPath.length - 1;
    const vehicleEmission = VEHICLES[selectedVehicle].emissionPerTile;

    let totalCarbon = 0;
    for (let i = 1; i < finalPath.length; i++) {
      const pos = finalPath[i];
      const tileType = grid[pos.y][pos.x];
      const modifier = TILE_TYPES[tileType].modifier;
      totalCarbon += vehicleEmission * modifier;
    }

    const rating = calculateRating(totalCarbon);

    setResult({
      tilesTraversed,
      totalCarbon: Math.round(totalCarbon * 100) / 100,
      vehicleName: VEHICLES[selectedVehicle].name,
      rating,
      earnedXP: mission?.xpReward || 0,
    });

    setGameState("finished");
  };

  const calculateRating = (carbon) => {
    if (carbon === 0) return 5;
    if (carbon <= 0.3) return 5;
    if (carbon <= 0.5) return 4;
    if (carbon <= 1.0) return 3;
    if (carbon <= 1.5) return 2;
    return 1;
  };

  const getCarbonColor = (carbon) => {
    if (carbon === 0) return "bg-green-500";
    if (carbon <= 0.3) return "bg-green-400";
    if (carbon <= 0.6) return "bg-yellow-400";
    if (carbon <= 1.2) return "bg-orange-400";
    return "bg-red-500";
  };

  const calculateCurrentCarbon = () => {
    if (!selectedVehicle || !grid.length || path.length < 2) return 0;

    let total = 0;
    const vehicleEmission = VEHICLES[selectedVehicle].emissionPerTile;

    for (let i = 1; i < path.length; i++) {
      const pos = path[i];
      const tileType = grid[pos.y][pos.x];
      const modifier = TILE_TYPES[tileType].modifier;
      total += vehicleEmission * modifier;
    }

    return Math.round(total * 100) / 100;
  };

  const handleReset = () => {
    setPath([startPos]);
    setTimeLeft(GAME_DURATION);
  };

  if (!mounted) {
    return (
      <div className="w-full h-96 flex items-center justify-center">
        <p className="text-gray-500">Loading game...</p>
      </div>
    );
  }

  // Vehicle Selection Screen
  if (gameState === "vehicleSelect") {
    return (
      <div className="space-y-5">
        <div className="flex items-center justify-between gap-2">
          <button
            onClick={onBack}
            className="flex items-center gap-1 text-gray-500 hover:text-gray-700 text-xs"
          >
            <ArrowLeft size={14} /> Kembali
          </button>
          <h3 className="font-heading text-base font-bold text-gray-800">
            🚗 EcoRoute - Smart Travel Simulator
          </h3>
          <div className="w-6" />
        </div>

        <div className="eco-card p-4 bg-gradient-to-r from-green-50 to-blue-50 text-center">
          <p className="text-sm text-gray-600 mb-2">Pilih kendaraanmu untuk memulai perjalanan!</p>
          <p className="text-xs text-gray-500">Kendaraan ramah lingkungan = lebih sedikit karbon</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {Object.entries(VEHICLES).map(([key, vehicle]) => (
            <motion.button
              key={key}
              onClick={() => startGame(key)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`eco-card p-4 text-center transition-all border-2 ${
                vehicle.color
              } hover:shadow-lg cursor-pointer`}
            >
              <p className="text-3xl mb-2">{vehicle.emoji}</p>
              <p className="font-heading text-sm font-bold text-gray-800 mb-1">{vehicle.name}</p>
              <p className="text-xs text-gray-600">
                {vehicle.emissionPerTile === 0
                  ? "Nol Emisi ✨"
                  : `${vehicle.emissionPerTile} kg/tile`}
              </p>
            </motion.button>
          ))}
        </div>

        <div className="eco-card p-3 bg-blue-50 text-xs text-gray-600">
          <p className="font-medium mb-1">💡 Tips:</p>
          <p>
            Gunakan kendaraan ramah lingkungan untuk mendapatkan rating yang lebih baik!
          </p>
        </div>
      </div>
    );
  }

  // Game Finished Screen
  if (gameState === "finished" && result) {
    const stars = Array(result.rating)
      .fill(0)
      .map((_, i) => "⭐");

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      >
        <motion.div
          className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl"
          initial={{ y: 20 }}
          animate={{ y: 0 }}
        >
          <div className="text-center">
            <p className="text-6xl mb-4">🎉</p>

            <h2 className="font-heading text-2xl font-bold text-gray-800 mb-2">
              Perjalanan Selesai!
            </h2>

            <div className="space-y-4 my-6">
              <div className="eco-card p-4 bg-gradient-to-r from-green-50 to-cyan-50">
                <p className="text-sm text-gray-600 mb-1">Kendaraan</p>
                <p className="font-heading text-xl font-bold text-green-600">
                  {VEHICLES[selectedVehicle].emoji} {result.vehicleName}
                </p>
              </div>

              <div className="eco-card p-4 bg-gradient-to-r from-blue-50 to-cyan-50">
                <p className="text-sm text-gray-600 mb-1">Jarak Tempuh</p>
                <p className="font-heading text-2xl font-bold text-blue-600">
                  {result.tilesTraversed} tiles
                </p>
              </div>

              <div className="eco-card p-4 bg-gradient-to-r from-orange-50 to-red-50">
                <p className="text-sm text-gray-600 mb-1">Total Karbon</p>
                <p className="font-heading text-2xl font-bold text-orange-600">
                  {result.totalCarbon} kg CO₂
                </p>
              </div>

              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">Rating</p>
                <p className="text-3xl">{stars.join("")}</p>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => {
                  onComplete({
                    score: Math.max(0, 100 - Math.round(result.totalCarbon * 50)),
                    earnedXP: mission.xpReward,
                    impactValues: { carbonReduced: 100 - result.totalCarbon * 10 },
                    tips: [
                      result.totalCarbon === 0
                        ? "Wow! Perjalanan zero-carbon yang sempurna! 🌍"
                        : result.totalCarbon <= 0.5
                          ? "Bagus! Kamu sudah menggunakan transportasi ramah lingkungan! 🌱"
                          : "Coba gunakan transportasi publik atau sepeda di lain waktu! 🚴",
                    ],
                    rating: result.rating,
                  });
                }}
                className="w-full py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
              >
                Klaim Reward ⚡
              </button>
              <button
                onClick={() => setGameState("vehicleSelect")}
                className="w-full py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-all flex items-center justify-center gap-2"
              >
                <RefreshCw size={18} /> Coba Lagi
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  // Playing Screen
  const currentCarbon = calculateCurrentCarbon();

  return (
    <div className="w-full space-y-3 px-2">
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-gray-500 hover:text-gray-700 text-xs"
        >
          <ArrowLeft size={14} /> Kembali
        </button>
        <h3 className="font-heading text-base font-bold text-gray-800">
          🚗 EcoRoute
        </h3>
        <div className="w-6" />
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-3 gap-2">
        <div className="eco-card p-2 text-center bg-green-50">
          <p className="text-xs text-gray-600 mb-0.5">Jarak</p>
          <p className="font-heading text-xl font-bold text-green-600">{path.length - 1}</p>
        </div>
        <div className="eco-card p-2 text-center bg-orange-50">
          <p className="text-xs text-gray-600 mb-0.5">Karbon</p>
          <p className="font-heading text-xl font-bold text-orange-600">{currentCarbon}</p>
        </div>
        <div className="eco-card p-2 text-center bg-blue-50">
          <p className="text-xs text-gray-600 mb-0.5">Waktu</p>
          <p className="font-heading text-xl font-bold text-blue-600">{timeLeft}s</p>
        </div>
      </div>

      {/* Carbon Meter */}
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-gray-600">Meter Karbon</span>
          <span className="text-xs font-bold text-gray-700">{currentCarbon} kg CO₂</span>
        </div>
        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            className={`h-full ${getCarbonColor(currentCarbon)}`}
            animate={{ width: `${Math.min((currentCarbon / 2) * 100, 100)}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Vehicle Info */}
      <div className="eco-card p-3 bg-gradient-to-r from-blue-50 to-cyan-50">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">
            {VEHICLES[selectedVehicle].emoji} {VEHICLES[selectedVehicle].name}
          </span>
          <span className="text-xs text-gray-600">
            {VEHICLES[selectedVehicle].emissionPerTile === 0
              ? "Nol Emisi ✨"
              : `${VEHICLES[selectedVehicle].emissionPerTile} kg/tile`}
          </span>
        </div>
      </div>

      {/* Grid Map */}
      <div className="space-y-2 flex flex-col items-center">
        <p className="text-xs font-medium text-gray-600">
          Dari 🏠 ke 🏢 (Klik kotak yang berdekatan)
        </p>
        <div className="border-2 border-green-400 rounded-xl overflow-hidden bg-green-50 p-0 inline-block">
          <div className="grid gap-0" style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)` }}>
            {grid.map((row, y) =>
              row.map((tileType, x) => {
                const isStart = x === startPos.x && y === startPos.y;
                const isEnd = x === endPos.x && y === endPos.y;
                const isInPath = path.some((p) => p.x === x && p.y === y);
                const isLastPos = path[path.length - 1].x === x && path[path.length - 1].y === y;
                const canClick =
                  path.length > 0 && isAdjacent(path[path.length - 1], { x, y }) && !isInPath;

                return (
                  <motion.button
                    key={`${x}-${y}`}
                    onClick={() => handleTileClick(x, y)}
                    whileHover={canClick ? { scale: 1.1 } : {}}
                    whileTap={canClick ? { scale: 0.95 } : {}}
                    disabled={!canClick}
                    className={`w-12 h-12 rounded text-sm flex items-center justify-center transition-all border-2 ${
                      isStart
                        ? "bg-green-500 border-green-700 text-white"
                        : isEnd
                          ? "bg-red-500 border-red-700 text-white"
                          : isInPath
                            ? isLastPos
                              ? "bg-blue-500 border-blue-700 text-white scale-105"
                              : "bg-green-300 border-green-500"
                            : canClick
                              ? "bg-white border-gray-400 cursor-pointer hover:bg-green-100"
                              : tileType === "park"
                                ? "bg-green-100 border-green-300"
                                : tileType === "traffic"
                                  ? "bg-red-100 border-red-300"
                                  : "bg-gray-100 border-gray-300"
                    } ${!canClick && "opacity-60"}`}
                    title={
                      isStart
                        ? "Start"
                        : isEnd
                          ? "End"
                          : `${TILE_TYPES[tileType].name} (${TILE_TYPES[tileType].modifier}x)`
                    }
                  >
                    {isStart ? "🏠" : isEnd ? "🏢" : TILE_TYPES[tileType].emoji}
                  </motion.button>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="eco-card p-2 bg-gray-50">
        <p className="text-xs font-medium text-gray-700 mb-2">Legenda:</p>
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="flex items-center gap-1">
            <span className="text-lg">🌳</span>
            <span className="text-gray-600">Taman (-10%)</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-lg">🚦</span>
            <span className="text-gray-600">Macet (+20%)</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-lg">⬜</span>
            <span className="text-gray-600">Normal</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={handleReset}
          className="py-2 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-all flex items-center justify-center gap-1 text-sm"
        >
          <RefreshCw size={16} /> Reset
        </button>
        <button
          onClick={() => setGameState("vehicleSelect")}
          className="py-2 bg-red-200 text-red-700 rounded-xl font-semibold hover:bg-red-300 transition-all flex items-center justify-center gap-1 text-sm"
        >
          <ArrowLeft size={16} /> Ubah Kendaraan
        </button>
      </div>
    </div>
  );
}
