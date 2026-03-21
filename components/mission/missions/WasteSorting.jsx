"use client";

import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Check, X } from "lucide-react";
import { calculateQuizReward } from "@/utils/calculations";

const allWasteItems = [
  {
    id: 1,
    name: "Kulit Pisang",
    emoji: "🍌",
    category: "organik",
    tip: "Bisa dijadikan kompos!",
  },
  {
    id: 2,
    name: "Botol Plastik",
    emoji: "🍶",
    category: "anorganik",
    tip: "Cuci dulu, lalu ke bank sampah.",
  },
  {
    id: 3,
    name: "Baterai Bekas",
    emoji: "🔋",
    category: "b3",
    tip: "Jangan dibuang sembarangan! Mengandung merkuri.",
  },
  {
    id: 4,
    name: "Kertas Koran",
    emoji: "📰",
    category: "anorganik",
    tip: "Bisa didaur ulang menjadi kertas baru.",
  },
  {
    id: 5,
    name: "Sisa Nasi",
    emoji: "🍚",
    category: "organik",
    tip: "Bisa jadi pupuk organik untuk tanaman.",
  },
  {
    id: 6,
    name: "Kaleng Minuman",
    emoji: "🥫",
    category: "anorganik",
    tip: "Aluminium bisa didaur ulang 100%!",
  },
  {
    id: 7,
    name: "Obat Kadaluarsa",
    emoji: "💊",
    category: "b3",
    tip: "Kembalikan ke apotek atau puskesmas.",
  },
  {
    id: 8,
    name: "Daun Gugur",
    emoji: "🍂",
    category: "organik",
    tip: "Jadikan mulsa untuk kebunmu.",
  },
  {
    id: 9,
    name: "Kantong Plastik",
    emoji: "🛍️",
    category: "anorganik",
    tip: "Kumpulkan dan bawa ke dropbox plastik.",
  },
  {
    id: 10,
    name: "Cat Bekas",
    emoji: "🎨",
    category: "b3",
    tip: "Serahkan ke tempat pengelolaan limbah B3.",
  },
  {
    id: 11,
    name: "Tulang Ayam",
    emoji: "🍗",
    category: "organik",
    tip: "Bisa dijadikan kaldu atau kompos.",
  },
  {
    id: 12,
    name: "Kardus",
    emoji: "📦",
    category: "anorganik",
    tip: "Lipat dan kumpulkan untuk daur ulang.",
  },
  {
    id: 13,
    name: "Termometer Rusak",
    emoji: "🌡️",
    category: "b3",
    tip: "Mengandung merkuri — serahkan ke pengelola B3.",
  },
  {
    id: 14,
    name: "Kulit Jeruk",
    emoji: "🍊",
    category: "organik",
    tip: "Bisa dijadikan pengharum ruangan alami!",
  },
  {
    id: 15,
    name: "Botol Kaca",
    emoji: "🍾",
    category: "anorganik",
    tip: "Kaca bisa didaur ulang tanpa batas.",
  },
  {
    id: 16,
    name: "Ampas Kopi",
    emoji: "☕",
    category: "organik",
    tip: "Pupuk alami terbaik untuk tanaman!",
  },
  {
    id: 17,
    name: "Styrofoam",
    emoji: "🥡",
    category: "anorganik",
    tip: "Sulit didaur ulang — kurangi penggunaan!",
  },
  {
    id: 18,
    name: "Lampu Neon",
    emoji: "💡",
    category: "b3",
    tip: "Mengandung merkuri — jangan buang di tempat biasa.",
  },
  {
    id: 19,
    name: "Cangkang Telur",
    emoji: "🥚",
    category: "organik",
    tip: "Kaya kalsium — kompos terbaik!",
  },
  {
    id: 20,
    name: "Pestisida Bekas",
    emoji: "☠️",
    category: "b3",
    tip: "Sangat beracun — harus ke pengelola B3.",
  },
];

const bins = [
  {
    id: "organik",
    label: "Organik",
    emoji: "🟢",
    color: "from-green-400 to-green-600",
    desc: "Sisa makanan & alam",
  },
  {
    id: "anorganik",
    label: "Anorganik",
    emoji: "🔵",
    color: "from-blue-400 to-blue-600",
    desc: "Plastik, kertas, kaca",
  },
  {
    id: "b3",
    label: "B3",
    emoji: "🔴",
    color: "from-red-400 to-red-600",
    desc: "Bahan berbahaya",
  },
];

export default function WasteSorting({
  province,
  mission,
  onComplete,
  onBack,
}) {
  const items = useMemo(() => {
    const shuffled = [...allWasteItems].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 10);
  }, []);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [isFinished, setIsFinished] = useState(false);
  const [showTutorial, setShowTutorial] = useState(true);

  const handleStartGame = () => {
    setShowTutorial(false);
  };

  const currentItem = items[currentIndex];

  const handleDrop = useCallback(
    (binId) => {
      if (feedback) return;

      const isCorrect = currentItem.category === binId;
      const newScore = isCorrect ? score + 1 : score;
      const newAnswers = [
        ...answers,
        { item: currentItem, chosen: binId, correct: isCorrect },
      ];

      setScore(newScore);
      setAnswers(newAnswers);
      setFeedback({ correct: isCorrect, tip: currentItem.tip });

      setTimeout(() => {
        setFeedback(null);
        if (currentIndex < items.length - 1) {
          setCurrentIndex(currentIndex + 1);
        } else {
          setIsFinished(true);
          const finalScore = newScore * 10;
          const performancePercent = Math.round((newScore / items.length) * 100);
          onComplete({
            score: finalScore,
            performancePercent: performancePercent,
            impactValues: { wasteClassified: newScore },
            tips: [
              "Selalu pisahkan sampah organik dan anorganik di rumah",
              "Bawa tas belanja sendiri untuk mengurangi plastik",
              "Cari tahu lokasi bank sampah terdekat di komunitasmu",
            ],
          });
        }
      }, 1500);
    },
    [
      currentIndex,
      currentItem,
      feedback,
      score,
      answers,
      items,
      mission,
      onComplete,
    ],
  );

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
              <p className="text-6xl mb-2">♻️</p>
              <h2 className="font-heading text-2xl font-bold text-gray-800">
                Waste Sorting
              </h2>
            </div>

            <div className="space-y-4 bg-blue-50 p-4 rounded-xl text-left">
              <div className="flex gap-3">
                <span className="text-2xl flex-shrink-0">🎯</span>
                <div>
                  <p className="font-semibold text-gray-800">Tujuan Game:</p>
                  <p className="text-sm text-gray-600">
                    Pilah 10 sampah ke kategori yang benar!
                  </p>
                </div>
              </div>

              <div className="border-t pt-4">
                <p className="font-semibold text-gray-800 mb-3">📖 Cara Main:</p>
                <div className="space-y-2 text-sm">
                  <div className="flex gap-2">
                    <span className="font-bold text-blue-600 flex-shrink-0">1.</span>
                    <p className="text-gray-700">Lihat sampah yang ditampilkan</p>
                  </div>
                  <div className="flex gap-2">
                    <span className="font-bold text-blue-600 flex-shrink-0">2.</span>
                    <p className="text-gray-700">Klik tong sampah yang sesuai kategorinya</p>
                  </div>
                  <div className="flex gap-2">
                    <span className="font-bold text-blue-600 flex-shrink-0">3.</span>
                    <p className="text-gray-700">Dapatkan poin jika benar ✅</p>
                  </div>
                  <div className="flex gap-2">
                    <span className="font-bold text-blue-600 flex-shrink-0">4.</span>
                    <p className="text-gray-700">Lanjut ke sampah berikutnya</p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <p className="font-semibold text-gray-800 mb-2">🗑️ Kategori Sampah:</p>
                <div className="space-y-2 text-xs">
                  <p><span className="inline-block w-4 h-4 bg-green-400 rounded mr-2"></span><strong>Organik:</strong> Makanan, daun, tulang</p>
                  <p><span className="inline-block w-4 h-4 bg-blue-400 rounded mr-2"></span><strong>Anorganik:</strong> Plastik, kertas, kaca</p>
                  <p><span className="inline-block w-4 h-4 bg-red-400 rounded mr-2"></span><strong>B3:</strong> Baterai, obat, cat</p>
                </div>
              </div>

              <div className="border-t pt-4">
                <p className="text-sm text-gray-700">
                  💡 <strong>Info:</strong> Jawab dengan benar untuk poin maksimal!
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

  if (isFinished) return null;

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
          <span className="text-sm text-gray-500">
            {currentIndex + 1}/{items.length}
          </span>
          <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm font-bold">
            Skor: {score * 10}
          </span>
        </div>
      </div>

      <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-linear-to-r from-green-400 to-teal-500 rounded-full transition-all"
          style={{ width: `${((currentIndex + 1) / items.length) * 100}%` }}
        />
      </div>

      {/* Current Item */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentItem.id}
          initial={{ opacity: 0, y: -20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="eco-card p-6 text-center"
        >
          <p className="text-xs text-gray-400 mb-1">Buang ke tong mana?</p>
          <div className="text-6xl mb-2">{currentItem.emoji}</div>
          <p className="font-heading text-lg font-bold text-gray-800">
            {currentItem.name}
          </p>
        </motion.div>
      </AnimatePresence>

      {/* Feedback */}
      <AnimatePresence>
        {feedback && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`rounded-xl p-3 text-sm flex items-start gap-2 ${
              feedback.correct
                ? "bg-green-50 text-green-700"
                : "bg-red-50 text-red-700"
            }`}
          >
            {feedback.correct ? (
              <Check size={18} className="mt-0.5 shrink-0" />
            ) : (
              <X size={18} className="mt-0.5 shrink-0" />
            )}
            <div>
              <p className="font-semibold">
                {feedback.correct ? "Benar! ✅" : "Salah! ❌"}
              </p>
              <p className="text-xs mt-0.5 opacity-80">{feedback.tip}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bins */}
      <div className="grid grid-cols-3 gap-3">
        {bins.map((bin) => (
          <motion.button
            key={bin.id}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => handleDrop(bin.id)}
            disabled={!!feedback}
            className={`bg-linear-to-br ${bin.color} text-white rounded-2xl p-4 text-center transition-all
              ${feedback ? "opacity-60 cursor-not-allowed" : "hover:shadow-lg cursor-pointer"}`}
          >
            <div className="text-3xl mb-1">{bin.emoji}</div>
            <p className="font-heading font-bold text-sm">{bin.label}</p>
            <p className="text-[10px] opacity-80">{bin.desc}</p>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
