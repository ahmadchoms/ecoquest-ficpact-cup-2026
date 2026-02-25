"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, RefreshCw } from "lucide-react";

const TRASH_TYPES = {
  plastic: { emoji: "🧴", points: 10, color: "bg-blue-300", label: "Plastik" },
  can: { emoji: "🥫", points: 15, color: "bg-yellow-400", label: "Kaleng" },
  net: { emoji: "🎣", points: 25, color: "bg-gray-400", label: "Jaring Ikan" },
};

const GRID_SIZE = 10;
const GAME_DURATION = 60;
const TRASH_SPAWN_INTERVAL = 800; // ms
const TRASH_LIFETIME = 8000; // ms

export default function OceanRescue({
  province,
  mission,
  onComplete,
  onBack,
}) {
  const [gameState, setGameState] = useState("playing");
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [trash, setTrash] = useState([]);
  const [collectedCount, setCollectedCount] = useState(0);
  const [result, setResult] = useState(null);
  const [mounted, setMounted] = useState(false);
  const idCounterRef = useRef(0);

  // Only mount on client
  useEffect(() => {
    setMounted(true);
  }, []);

  // Game loop timer
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

  // Spawn trash
  useEffect(() => {
    if (gameState !== "playing" || !mounted) return;

    const spawnTimer = setInterval(() => {
      const trashTypes = Object.keys(TRASH_TYPES);
      const trashType = trashTypes[Math.floor(Math.random() * trashTypes.length)];
      const newTrash = {
        id: `trash-${++idCounterRef.current}`,
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
        type: trashType,
        createdAt: Date.now(),
      };
      setTrash((prev) => [...prev, newTrash]);
    }, TRASH_SPAWN_INTERVAL);

    return () => clearInterval(spawnTimer);
  }, [gameState, mounted]);

  // Remove old trash
  useEffect(() => {
    if (!mounted) return;

    const cleanupTimer = setInterval(() => {
      setTrash((prev) => {
        const now = Date.now();
        return prev.filter((t) => now - t.createdAt < TRASH_LIFETIME);
      });
    }, 1000);

    return () => clearInterval(cleanupTimer);
  }, [mounted]);

  // Handle trash click
  const handleTrashClick = useCallback((trashId, trashType) => {
    setTrash((prev) => prev.filter((t) => t.id !== trashId));
    const points = TRASH_TYPES[trashType].points;
    setScore((prev) => prev + points);
    setCollectedCount((prev) => prev + 1);
  }, []);

  // Finish game
  useEffect(() => {
    if (gameState === "finished" && !result && mounted) {
      const rating = calculateRating(score);
      const finalResult = {
        score,
        collectedCount,
        rating,
        earnedXP: mission?.xpReward || 0,
      };
      setResult(finalResult);
    }
  }, [gameState, score, result, mission, mounted]);

  const calculateRating = (finalScore) => {
    if (finalScore >= 500) return 5;
    if (finalScore >= 400) return 4;
    if (finalScore >= 300) return 3;
    if (finalScore >= 200) return 2;
    return 1;
  };

  const handleSubmit = () => {
    if (!result || !mission) return;

    const tips = [];
    if (score < 300)
      tips.push(
        "Fokus lebih pada sampah yang bernilai tinggi seperti jaring ikan!"
      );
    if (score >= 300 && score < 400)
      tips.push("Bagus! Cobalah lebih cepat dalam putaran berikutnya.");
    if (score >= 400)
      tips.push("Wow! Kamu pahlawan laut yang hebat! Terus pertahankan!");

    onComplete({
      score: result.score,
      earnedXP: mission.xpReward,
      impactValues: { oceanCleaned: result.collectedCount * 2 },
      tips,
      rating: result.rating,
    });
  };

  if (!mounted) {
    return (
      <div className="w-full h-96 flex items-center justify-center">
        <p className="text-gray-500">Loading game...</p>
      </div>
    );
  }

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
            <p className="text-6xl mb-4">🌊</p>

            <h2 className="font-heading text-2xl font-bold text-gray-800 mb-2">
              Game Selesai!
            </h2>

            <div className="space-y-4 my-6">
              <div className="eco-card p-4 bg-gradient-to-r from-blue-50 to-cyan-50">
                <p className="text-sm text-gray-600 mb-1">Total Poin</p>
                <p className="font-heading text-4xl font-bold text-blue-600">
                  {result.score}
                </p>
              </div>

              <div className="eco-card p-4 bg-gradient-to-r from-emerald-50 to-green-50">
                <p className="text-sm text-gray-600 mb-1">Sampah Dibersihkan</p>
                <p className="font-heading text-2xl font-bold text-emerald-600">
                  {result.collectedCount} 🗑️
                </p>
              </div>

              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">Rating</p>
                <p className="text-3xl">{stars.join("")}</p>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleSubmit}
                className="w-full py-3 bg-gradient-to-r from-sky-400 to-blue-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
              >
                Klaim Reward ⚡
              </button>
              <button
                onClick={() => window.location.reload()}
                className="w-full py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-all flex items-center justify-center gap-2"
              >
                <RefreshCw size={18} /> Main Ulang
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    );
  }

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
          🌊 Ocean Rescue
        </h3>
        <div className="w-6" />
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-3 gap-2">
        <div className="eco-card p-2 text-center bg-blue-50">
          <p className="text-xs text-gray-600 mb-0.5">Skor</p>
          <p className="font-heading text-xl font-bold text-blue-600">
            {score}
          </p>
        </div>
        <div className="eco-card p-2 text-center bg-yellow-50">
          <p className="text-xs text-gray-600 mb-0.5">Waktu</p>
          <p className="font-heading text-xl font-bold text-yellow-600">
            {timeLeft}s
          </p>
        </div>
        <div className="eco-card p-2 text-center bg-emerald-50">
          <p className="text-xs text-gray-600 mb-0.5">Dikumpul</p>
          <p className="font-heading text-xl font-bold text-emerald-600">
            {collectedCount}
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-blue-400 to-cyan-500"
          initial={{ width: "100%" }}
          animate={{ width: `${(timeLeft / GAME_DURATION) * 100}%` }}
          transition={{ duration: 1, ease: "linear" }}
        />
      </div>

      {/* Game Grid */}
      <div className="relative w-full h-[680px] bg-gradient-to-b from-blue-200 to-cyan-300 rounded-xl overflow-hidden border-2 border-blue-400 shadow-lg">
        {/* Grid Background */}
        <div className="absolute inset-0">
          <svg className="w-full h-full opacity-20">
            <defs>
              <pattern
                id="grid"
                width="10%"
                height="10%"
                patternUnits="objectBoundingBox"
              >
                <path
                  d="M 10% 0 L 0 0 0 10%"
                  fill="none"
                  stroke="white"
                  strokeWidth="0.5"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Trash Items */}
        <AnimatePresence>
          {trash.map((item) => (
            <TrashItem
              key={item.id}
              item={item}
              gridSize={GRID_SIZE}
              trashType={TRASH_TYPES[item.type]}
              onCollect={() => handleTrashClick(item.id, item.type)}
            />
          ))}
        </AnimatePresence>

        {/* Empty State */}
        {trash.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <p className="text-3xl mb-1">🐠</p>
              <p className="text-gray-500 text-xs">Tunggu sampah muncul...</p>
            </div>
          </div>
        )}
      </div>

      {/* Tips */}
      <div className="eco-card p-2 bg-blue-50 text-center">
        <p className="text-xs text-gray-600 font-medium">
          💡 Kaleng = 15 | Plastik = 10 | Jaring = 25
        </p>
      </div>
    </div>
  );
}

function TrashItem({ item, gridSize, trashType, onCollect }) {
  const cellWidth = 100 / gridSize;
  const posX = cellWidth * item.x + cellWidth / 2;
  const posY = cellWidth * item.y + cellWidth / 2;

  const age = Date.now() - item.createdAt;
  const progress = Math.min(age / 8000, 1);

  return (
    <motion.button
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{
        scale: 0,
        opacity: 0,
        transition: { duration: 0.2 },
      }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      onClick={onCollect}
      className="absolute w-12 h-12 -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
      style={{
        left: `${posX}%`,
        top: `${posY}%`,
      }}
    >
      {/* Danger Ring - grows as trash ages */}
      {progress > 0.5 && (
        <motion.div
          className="absolute inset-0 border-2 border-red-500 rounded-full"
          animate={{
            scale: [1, 1.2],
            opacity: [0.8, 0],
          }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
          }}
        />
      )}

      {/* Trash Icon Background */}
      <motion.div
        className={`absolute inset-0 rounded-full ${trashType.color} shadow-lg flex items-center justify-center text-2xl group-hover:shadow-xl transition-shadow border-2 border-white`}
        animate={{
          backgroundColor: progress > 0.7 ? "#ef4444" : trashType.color,
        }}
        transition={{ duration: 0.3 }}
      >
        {trashType.emoji}
      </motion.div>

      {/* Health Bar */}
      <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gray-300 rounded-full overflow-hidden mx-1">
        <motion.div
          className="h-full bg-green-500 rounded-full"
          animate={{ width: `${100 - progress * 100}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      {/* Points Badge */}
      <motion.div
        className="absolute -top-2 -right-2 bg-yellow-400 text-xs font-bold text-white rounded-full w-6 h-6 flex items-center justify-center shadow-md"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
      >
        +{trashType.points}
      </motion.div>
    </motion.button>
  );
}
