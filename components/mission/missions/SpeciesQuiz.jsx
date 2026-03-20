"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Clock,
  Check,
  X,
  Sparkles,
  AlertCircle,
} from "lucide-react";
import {
  generateQuizQuestions,
  fetchProvinceSpecies,
  enrichSpeciesWithIndonesianNames,
} from "@/services/ai";
import { calculateQuizReward } from "@/utils/calculations";
import AnimatedButton from "@/components/ui/AnimatedButton";

// Fallback questions if AI fails or key missing
const fallbackQuestions = [
  {
    id: 1,
    question:
      "Berapa perkiraan populasi Harimau Sumatera yang tersisa di alam liar?",
    options: ["< 400 ekor", "600-800 ekor", "1.000-1.200 ekor", "> 2.000 ekor"],
    correct: 0,
    explanation:
      "Harimau Sumatera (Panthera tigris sumatrae) diperkirakan hanya tersisa kurang dari 400 ekor, menjadikannya Critically Endangered.",
    species: "Harimau Sumatera 🐯",
  },
  {
    id: 2,
    question: "Mengapa Cendrawasih dilindungi ketat di Papua?",
    options: [
      "Karena bulunya beracun",
      "Karena diburu untuk perdagangan bulu ilegal",
      "Karena hanya makan satu jenis buah",
      "Karena tidak bisa terbang jauh",
    ],
    correct: 1,
    explanation:
      "Perdagangan bulu Cendrawasih ilegal menjadi ancaman utama. Burung ini juga sangat sensitif terhadap kerusakan habitat hutan.",
    species: "Cendrawasih 🦜",
  },
  {
    id: 3,
    question: "Apa nama kadal terbesar di dunia yang hanya ada di Indonesia?",
    options: ["Iguana", "Tokek Raksasa", "Komodo", "Biawak Air"],
    correct: 2,
    explanation:
      "Komodo (Varanus komodoensis) bisa tumbuh hingga 3 meter dan beratnya 70 kg. Hanya ditemukan di Nusa Tenggara Timur.",
    species: "Komodo 🦎",
  },
  {
    id: 4,
    question: "Berapa persen hutan mangrove dunia yang ada di Indonesia?",
    options: ["5%", "12%", "23%", "45%"],
    correct: 2,
    explanation:
      "Indonesia memiliki sekitar 23% hutan mangrove dunia, menjadikannya pemilik mangrove terluas di planet ini.",
    species: "Ekosistem Mangrove 🌿",
  },
  {
    id: 5,
    question: "Orangutan Tapanuli ditemukan di mana?",
    options: ["Kalimantan Barat", "Sumatera Utara", "Papua", "Sulawesi"],
    correct: 1,
    explanation:
      "Orangutan Tapanuli (Pongo tapanuliensis) hanya ditemukan di hutan Batang Toru, Sumatera Utara. Populasinya kurang dari 800 ekor.",
    species: "Orangutan Tapanuli 🦧",
  },
];

export default function SpeciesQuiz({ province, mission, onComplete, onBack }) {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [usingAI, setUsingAI] = useState(false);

  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    let abortController = new AbortController();
    let isMounted = true;
    let isRequesting = false;

    const fetchQuestions = async () => {
      if (isRequesting) return;
      isRequesting = true;

      setLoading(true);
      setError(null);

      try {
        // Step 1: Fetch spesies dari GBIF berdasarkan provinsi
        const gbifSpecies = await fetchProvinceSpecies(province?.name);

        if (!isMounted) return;

        let aiQuestions = null;

        if (gbifSpecies && gbifSpecies.length >= 2) {
          // Step 2: Enrich dengan nama Indonesia
          const enrichedSpecies =
            await enrichSpeciesWithIndonesianNames(gbifSpecies);

          if (!isMounted) return;

          // Step 3: Generate soal dari AI dengan spesies nyata
          aiQuestions = await generateQuizQuestions(
            `Wildlife and Flora in ${province?.name || "Indonesia"}`,
            5,
            enrichedSpecies,
          );
        } else {
          // Fallback: Jika GBIF gagal, generate soal umum
          aiQuestions = await generateQuizQuestions(
            `Wildlife in ${province?.name || "Indonesia"}`,
            5,
          );
        }

        if (!isMounted) return;

        if (aiQuestions && aiQuestions.length >= 3) {
          // Map AI response to our format
          const formatted = aiQuestions.map((q, i) => ({
            id: i,
            question: q.question,
            options: q.options,
            correct: q.correctAnswer, // AI returns 0-3 index
            explanation: q.explanation || "Jawaban yang benar adalah yang itu.",
            species: q.species || "Pembelajaran Spesies 🌿",
          }));
          setQuestions(formatted);
          setUsingAI(true);
        } else {
          // Fallback ke pertanyaan default
          setQuestions([...fallbackQuestions].sort(() => Math.random() - 0.5));
          setUsingAI(false);
        }
      } catch (error) {
        if (error.name === "AbortError") {
          console.error("Quiz fetch dibatalkan");
          return;
        }
        console.error("Error fetching questions:", error);
        // Final fallback
        if (isMounted) {
          setQuestions([...fallbackQuestions].sort(() => Math.random() - 0.5));
          setUsingAI(false);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
          isRequesting = false;
        }
      }
    };

    fetchQuestions();

    // Cleanup function
    return () => {
      isMounted = false;
      abortController.abort();
    };
  }, [province?.id]);

  const q = questions[currentQ];

  const handleAnswer = (optionIndex) => {
    if (selected !== null) return;
    setSelected(optionIndex);
    setShowExplanation(true);

    const isCorrect = optionIndex === q.correct;
    const newCorrect = isCorrect ? correctCount + 1 : correctCount;
    if (isCorrect) setCorrectCount(newCorrect);

    setTimeout(() => {
      setSelected(null);
      setShowExplanation(false);
      if (currentQ < questions.length - 1) {
        setCurrentQ(currentQ + 1);
      } else {
        setIsFinished(true);
        const score = newCorrect * 20;
        const performancePercent = Math.round((newCorrect / questions.length) * 100);
        onComplete({
          score,
          performancePercent: performancePercent,
          impactValues: { speciesLearned: newCorrect },
          tips: [
            "Dukung organisasi konservasi seperti WWF Indonesia.",
            "Jaga habitat satwa liar dengan tidak membuang sampah sembarangan.",
          ],
        });
      }
    }, 2500);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-500 rounded-full mb-4"
        />
        <p className="text-slate-600 font-medium animate-pulse">
          Sedang mempersiapkan kuis yang dipersonalisasi
          {province ? ` tentang spesies ${province.name}` : ""}...
        </p>
        <p className="text-xs text-slate-400 mt-2 flex items-center gap-1">
          <Sparkles size={12} className="text-purple-400" />
          Mengambil data dari GBIF & Gemini AI
        </p>
      </div>
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
          {usingAI && (
            <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded flex items-center gap-1">
              <Sparkles size={10} /> Berbasis Data Real
            </span>
          )}
          <span className="text-sm text-gray-500">
            {currentQ + 1}/{questions.length}
          </span>
          <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm font-bold">
            {correctCount} benar
          </span>
        </div>
      </div>

      <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-linear-to-r from-purple-400 to-indigo-500 rounded-full transition-all"
          style={{ width: `${((currentQ + 1) / questions.length) * 100}%` }}
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={q.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="space-y-4"
        >
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 min-h-30 flex flex-col justify-center">
            <p className="text-xs text-purple-500 font-bold mb-2 uppercase tracking-wide">
              {q.species}
            </p>
            <h3 className="font-heading text-lg font-bold text-gray-800 leading-snug">
              {q.question}
            </h3>
          </div>

          <div className="space-y-2.5">
            {q.options.map((option, i) => {
              let bgClass = "bg-white hover:bg-gray-50 border-gray-200";
              let iconEl = null;

              if (selected !== null) {
                if (i === q.correct) {
                  bgClass =
                    "bg-green-50 border-green-400 shadow-sm shadow-green-100";
                  iconEl = <Check size={16} className="text-green-600" />;
                } else if (i === selected && i !== q.correct) {
                  bgClass = "bg-red-50 border-red-400 shadow-sm shadow-red-100";
                  iconEl = <X size={16} className="text-red-600" />;
                } else {
                  bgClass = "bg-gray-50 border-gray-200 opacity-50";
                }
              }

              return (
                <motion.button
                  key={i}
                  whileTap={selected === null ? { scale: 0.98 } : {}}
                  onClick={() => handleAnswer(i)}
                  disabled={selected !== null}
                  className={`w-full text-left p-4 rounded-xl border-2 ${bgClass} transition-all flex items-center gap-3 relative overflow-hidden`}
                >
                  <span
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 transition-colors ${
                      selected !== null && i === q.correct
                        ? "bg-green-200 text-green-700"
                        : selected !== null && i === selected
                          ? "bg-red-200 text-red-700"
                          : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span className="text-sm text-gray-700 flex-1 font-medium">
                    {option}
                  </span>
                  {iconEl}
                </motion.button>
              );
            })}
          </div>

          <AnimatePresence>
            {showExplanation && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 flex gap-3"
              >
                <div className="bg-indigo-100 p-2 rounded-lg h-fit text-indigo-600">
                  <AlertCircle size={18} />
                </div>
                <div>
                  <p className="text-xs text-indigo-500 font-bold uppercase mb-1">
                    Penjelasan
                  </p>
                  <p className="text-sm text-indigo-700 leading-relaxed">
                    {q.explanation}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
