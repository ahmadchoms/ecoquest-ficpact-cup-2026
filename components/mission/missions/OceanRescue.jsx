"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, RefreshCw } from "lucide-react";

const TRASH_TYPES = {
  // Organik (Organic)
  leaf: { emoji: "🍃", points: 5, category: "organik", label: "Daun" },
  wood: { emoji: "🪵", points: 8, category: "organik", label: "Kayu" },
  paper: { emoji: "📄", points: 7, category: "organik", label: "Kertas" },
  food: { emoji: "🍌", points: 6, category: "organik", label: "Sampah Makanan" },
  
  // Anorganik (Inorganic)
  plastic: { emoji: "🧴", points: 10, category: "anorganik", label: "Plastik" },
  can: { emoji: "🥫", points: 12, category: "anorganik", label: "Kaleng" },
  bottle: { emoji: "🍾", points: 11, category: "anorganik", label: "Botol Kaca" },
  bag: { emoji: "🛍️", points: 10, category: "anorganik", label: "Tas Plastik" },
  
  // B3 (Hazardous)
  net: { emoji: "🎣", points: 25, category: "b3", label: "Jaring Ikan" },
  rope: { emoji: "🪢", points: 20, category: "b3", label: "Tali" },
  battery: { emoji: "🔋", points: 22, category: "b3", label: "Baterai" },
  chemicals: { emoji: "⚗️", points: 30, category: "b3", label: "Bahan Kimia" },
};

const GRID_SIZE = 10;
const GAME_DURATION = 60;
const TRASH_SPAWN_INTERVAL = 1200; // ms - lebih lambat
const TRASH_LIFETIME = 8000; // ms

const CATEGORIES = {
  organik: { label: "Organik", color: "bg-green-400", icon: "♻️" },
  anorganik: { label: "Anorganik", color: "bg-blue-400", icon: "♻️" },
  b3: { label: "B3 (Berbahaya)", color: "bg-red-400", icon: "⚠️" },
};

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
  const [draggedTrash, setDraggedTrash] = useState(null);
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [correctSorts, setCorrectSorts] = useState({ organik: 0, anorganik: 0, b3: 0 });
  const [incorrectCount, setIncorrectCount] = useState(0);
  const idCounterRef = useRef(0);
  const [isMobile, setIsMobile] = useState(false);
  const [selectedTrash, setSelectedTrash] = useState(null);
  const [showTutorial, setShowTutorial] = useState(true);

  // Only mount on client
  useEffect(() => {
    setMounted(true);
    // Detect mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Start game from tutorial
  const handleStartGame = () => {
    setShowTutorial(false);
  };

  // Game loop timer
  useEffect(() => {
    if (gameState !== "playing" || !mounted || showTutorial) return;

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
  }, [gameState, mounted, showTutorial]);

  // Spawn trash
  useEffect(() => {
    if (gameState !== "playing" || !mounted || showTutorial) return;

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
  }, [gameState, mounted, showTutorial]);

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

  // Handle drag start
  const handleDragStart = (e, trash) => {
    setDraggedTrash(trash);
    e.dataTransfer.effectAllowed = "move";
  };

  // Handle drop on category
  const handleDrop = useCallback((e, category) => {
    e.preventDefault();
    if (!draggedTrash) return;

    const trashCategory = TRASH_TYPES[draggedTrash.type].category;
    const isCorrect = trashCategory === category;

    // Remove trash from grid
    setTrash((prev) => prev.filter((t) => t.id !== draggedTrash.id));

    if (isCorrect) {
      // Correct sort
      const points = TRASH_TYPES[draggedTrash.type].points;
      setScore((prev) => prev + points);
      setCollectedCount((prev) => prev + 1);
      setCorrectSorts((prev) => ({
        ...prev,
        [category]: prev[category] + 1,
      }));
    } else {
      // Wrong sort - lose points
      setScore((prev) => Math.max(0, prev - 10));
      setIncorrectCount((prev) => prev + 1);
    }

    setDraggedTrash(null);
    setHoveredCategory(null);
  }, [draggedTrash]);

  const handleDragOver = (e, category) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setHoveredCategory(category);
  };

  const handleDragLeave = () => {
    setHoveredCategory(null);
  };

  // Handle category click on mobile
  const handleCategoryClick = (category) => {
    if (!selectedTrash || !isMobile) return;
    
    const trashCategory = TRASH_TYPES[selectedTrash.type].category;
    const isCorrect = trashCategory === category;

    setTrash((prev) => prev.filter((t) => t.id !== selectedTrash.id));

    if (isCorrect) {
      const points = TRASH_TYPES[selectedTrash.type].points;
      setScore((prev) => prev + points);
      setCollectedCount((prev) => prev + 1);
      setCorrectSorts((prev) => ({
        ...prev,
        [category]: prev[category] + 1,
      }));
    } else {
      setScore((prev) => Math.max(0, prev - 10));
      setIncorrectCount((prev) => prev + 1);
    }

    setSelectedTrash(null);
    setHoveredCategory(null);
  };

  // Finish game
  useEffect(() => {
    if (gameState === "finished" && !result && mounted) {
      const rating = calculateRating(score);
      const finalResult = {
        score,
        collectedCount,
        incorrectCount,
        rating,
        earnedXP: mission?.xpReward || 0,
      };
      setResult(finalResult);
    }
  }, [gameState, score, result, mission, mounted, incorrectCount]);

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

    // Calculate performance based on score (max score is 500)
    const performancePercent = Math.min(100, (score / 500) * 100);

    onComplete({
      score: result.score,
      performancePercent: Math.round(performancePercent),
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

  // Tutorial Screen
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
              <p className="text-6xl mb-2">🌊</p>
              <h2 className="font-heading text-2xl font-bold text-gray-800">
                Ocean Rescue
              </h2>
            </div>

            <div className="space-y-4 bg-blue-50 p-4 rounded-xl text-left">
              <div className="flex gap-3">
                <span className="text-2xl flex-shrink-0">🗑️</span>
                <div>
                  <p className="font-semibold text-gray-800">Tujuan Game:</p>
                  <p className="text-sm text-gray-600">
                    Bersihkan laut dengan memilah sampah ke kategori yang tepat!
                  </p>
                </div>
              </div>

              <div className="border-t pt-4">
                <p className="font-semibold text-gray-800 mb-3">📖 Cara Main:</p>
                <div className="space-y-3 text-sm">
                  {isMobile ? (
                    <>
                      <div className="flex gap-2">
                        <span className="font-bold text-blue-600 flex-shrink-0">1.</span>
                        <p className="text-gray-700">👆 Tap sampah yang muncul di laut</p>
                      </div>
                      <div className="flex gap-2">
                        <span className="font-bold text-blue-600 flex-shrink-0">2.</span>
                        <p className="text-gray-700">Sampah akan membesar dan bercahaya</p>
                      </div>
                      <div className="flex gap-2">
                        <span className="font-bold text-blue-600 flex-shrink-0">3.</span>
                        <p className="text-gray-700">👆 Tap tong sampah yang <strong>benar</strong> untuk sampah itu</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex gap-2">
                        <span className="font-bold text-blue-600 flex-shrink-0">1.</span>
                        <p className="text-gray-700">Drag sampah ke tong yang sesuai</p>
                      </div>
                      <div className="flex gap-2">
                        <span className="font-bold text-blue-600 flex-shrink-0">2.</span>
                        <p className="text-gray-700">Pilah sampah dengan cepat dan tepat!</p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="border-t pt-4">
                <p className="font-semibold text-gray-800 mb-2">♻️ Kategori Sampah:</p>
                <div className="space-y-2 text-xs">
                  <p>
                    <span className="font-bold text-green-600">Organik:</span> daun, kayu, kertas, makanan
                  </p>
                  <p>
                    <span className="font-bold text-blue-600">Anorganik:</span> plastik, kaleng, botol, tas
                  </p>
                  <p>
                    <span className="font-bold text-red-600">B3:</span> jaring, tali, baterai, bahan kimia
                  </p>
                </div>
              </div>

              <div className="border-t pt-4">
                <p className="text-sm text-gray-700">
                  ⏱️ <strong>Waktu:</strong> 60 detik untuk mengumpulkan poin sebanyak-banyaknya!
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
                className="flex-1 py-3 bg-gradient-to-r from-sky-400 to-blue-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
              >
                Mulai Game 🚀
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
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
          className="bg-white rounded-3xl p-10 max-w-lg w-full shadow-2xl"
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
                <p className="text-sm text-gray-600 mb-1">Sampah Berhasil Dipilah</p>
                <p className="font-heading text-2xl font-bold text-emerald-600">
                  {result.collectedCount} ✅
                </p>
              </div>

              <div className="eco-card p-4 bg-gradient-to-r from-red-50 to-orange-50">
                <p className="text-sm text-gray-600 mb-1">Sampah Salah Pilah</p>
                <p className="font-heading text-2xl font-bold text-red-600">
                  {result.incorrectCount} ❌
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
      <div className={`relative w-full ${isMobile ? 'h-115' : 'h-[560px]'} bg-gradient-to-b from-blue-200 to-cyan-300 rounded-xl overflow-hidden border-2 border-blue-400 shadow-lg`}>
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
                  d="M 0.1 0 L 0 0 0 0.1"
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
              onDragStart={(e) => handleDragStart(e, item)}
              isMobile={isMobile}
              isSelected={selectedTrash?.id === item.id}
              onTapSelect={() => setSelectedTrash(item)}
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

      {/* Category Boxes */}
      <div className="grid grid-cols-3 gap-2">
        {Object.entries(CATEGORIES).map(([key, category]) => {
          const isCorrectCategory = draggedTrash && TRASH_TYPES[draggedTrash.type].category === key;
          const isHovered = hoveredCategory === key;
          const isSelected = selectedTrash !== null;
          
          return (
            <motion.div
              key={key}
              onDrop={(e) => handleDrop(e, key)}
              onDragOver={(e) => handleDragOver(e, key)}
              onDragLeave={handleDragLeave}
              onClick={() => handleCategoryClick(key)}
              whileHover={{ scale: 1.05 }}
              className={`rounded-xl p-3 text-center cursor-pointer border-2 transition-all ${
                isSelected
                  ? `${category.color} border-yellow-400 ring-4 ring-yellow-300 scale-103`
                  : `${category.color} border-white`
              } ${
                draggedTrash && !isSelected
                  ? isCorrectCategory && isHovered
                    ? "border-yellow-300 ring-2 ring-yellow-300"
                    : !isCorrectCategory && isHovered
                    ? "border-yellow-300 ring-2 ring-yellow-300"
                    : "border-white"
                  : ""
              } shadow-lg`}
            >
              <p className="text-2xl mb-1">{category.icon}</p>
              <p className="font-heading text-sm font-bold text-white">
                {category.label}
              </p>
              <p className="text-xs text-white/80">
                {correctSorts[key]} dikumpul
              </p>
            </motion.div>
          );
        })}
      </div>

      {/* Instructions */}
      <div className="eco-card p-2 bg-blue-50 text-center">
        <p className="text-xs text-gray-600 font-medium">
          {isMobile 
            ? "👉 Tap sampah → pilih tong sampah"
            : "💡 Drag sampah ke kategori yang tepat!"
          }
        </p>
      </div>
    </div>
  );
}

function TrashItem({ item, gridSize, trashType, onDragStart, isMobile, isSelected, onTapSelect }) {
  const cellWidth = 100 / gridSize;
  const posX = cellWidth * item.x + cellWidth / 2;
  const posY = cellWidth * item.y + cellWidth / 2;

  const age = Date.now() - item.createdAt;
  const progress = Math.min(age / 8000, 1);
  const [showLabel, setShowLabel] = useState(false);

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{
        scale: 0,
        opacity: 0,
        transition: { duration: 0.2 },
      }}
      draggable={!isMobile}
      onDragStart={(e) => {
        if (!isMobile) {
          e.dataTransfer.effectAllowed = "move";
          onDragStart(e);
        }
      }}
      onClick={() => {
        if (isMobile) {
          onTapSelect();
        }
      }}
      onMouseEnter={() => setShowLabel(true)}
      onMouseLeave={() => setShowLabel(false)}
      className={`absolute w-12 h-12 -translate-x-1/2 -translate-y-1/2 cursor-${isMobile ? 'pointer' : 'grab'} active:cursor-grabbing group transition-transform ${
        isMobile && isSelected ? "scale-125" : ""
      }`}
      style={{
        left: `${posX}%`,
        top: `${posY}%`,
        zIndex: isSelected ? 50 : 1,
      }}
    >
      {/* Label Tooltip */}
      <AnimatePresence>
        {showLabel && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap z-10 pointer-events-none"
          >
            {trashType.label}
          </motion.div>
        )}
      </AnimatePresence>

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
        className={`absolute inset-0 rounded-full shadow-lg flex items-center justify-center text-2xl group-hover:shadow-xl transition-shadow border-2 ${
          isSelected
            ? "border-yellow-300 shadow-yellow-300/50"
            : "border-white"
        } ${
          progress > 0.7
            ? "bg-red-500"
            : "bg-white"
        }`}
        animate={{
          backgroundColor: progress > 0.7 ? "#ef4444" : "#ffffff",
          boxShadow: isSelected ? "0 0 12px rgba(253, 224, 71, 0.8)" : "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
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
    </motion.div>
  );
}
