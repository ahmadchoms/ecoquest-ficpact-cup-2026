"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useCallback } from "react";

function Confetti() {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const colors = [
      "#22c55e",
      "#0ea5e9",
      "#f97316",
      "#a855f7",
      "#f43f5e",
      "#fbbf24",
    ];
    const newParticles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      color: colors[Math.floor(Math.random() * colors.length)],
      delay: Math.random() * 0.5,
      duration: 1.5 + Math.random() * 2,
      size: 6 + Math.random() * 8,
      rotation: Math.random() * 360,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-[100]">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ y: -20, x: `${p.x}vw`, rotate: 0, opacity: 1 }}
          animate={{ y: "100vh", rotate: p.rotation + 720, opacity: 0 }}
          transition={{ duration: p.duration, delay: p.delay, ease: "linear" }}
          className="absolute"
          style={{
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            borderRadius: Math.random() > 0.5 ? "50%" : "2px",
          }}
        />
      ))}
    </div>
  );
}

export default function CelebrationOverlay({
  show,
  xpEarned,
  pointsEarned,
  performancePercent,
  badgeEarned,
  onClose,
}) {
  const [visible, setVisible] = useState(show);

  useEffect(() => {
    setVisible(show);
    if (show) {
      const timer = setTimeout(() => {
        setVisible(false);
        onClose?.();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => {
            setVisible(false);
            onClose?.();
          }}
          className="fixed inset-0 z-[99] flex items-center justify-center bg-black/40 backdrop-blur-sm cursor-pointer"
        >
          <Confetti />
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0 }}
            transition={{ type: "spring", damping: 12 }}
            className="bg-white rounded-3xl p-8 mx-4 max-w-md w-full text-center shadow-2xl relative z-[101]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="font-heading text-2xl font-bold text-gray-800 mb-2">
              Mision Selesai!
            </h2>

            {performancePercent && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, type: "spring" }}
                className="mb-4"
              >
                <p className="text-sm text-gray-600 mb-2">Performa Anda</p>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${performancePercent}%` }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                    className="bg-gradient-to-r from-emerald-400 to-emerald-500 h-full rounded-full"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">{performancePercent}% Sempurna</p>
              </motion.div>
            )}

            {xpEarned ? (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring" }}
                className="inline-flex items-center gap-2 bg-linear-to-r from-yellow-400 to-yellow-500 text-black rounded-full px-6 py-2 mb-4 font-heading font-bold shadow-md"
              >
                <span className="text-xl">⚡</span>
                <span className="text-lg">
                  +{Math.floor(xpEarned)} XP
                </span>
              </motion.div>
            ) : null}

            {pointsEarned ? (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.45, type: "spring" }}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-full px-6 py-2 ml-2 mb-4"
              >
                <span className="text-xl">💰</span>
                <span className="font-heading font-bold text-lg">
                  +{Math.floor(pointsEarned)} Poin
                </span>
              </motion.div>
            ) : null}

            {badgeEarned && (
              <motion.div
                initial={{ scale: 0, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                transition={{ delay: 0.6, type: "spring", stiffness: 100 }}
                className="mt-6 pt-6 border-t border-gray-200"
              >
                <motion.div
                  animate={{ rotate: [0, -5, 5, 0] }}
                  transition={{ delay: 0.8, duration: 0.6 }}
                  className="inline-block mb-3"
                >
                  <p className="text-sm font-heading font-bold text-amber-600">
                    🏆 Badge Baru Terbuka!
                  </p>
                </motion.div>
                <div className="inline-flex flex-col items-center gap-3 bg-linear-to-br from-amber-50 to-amber-100 border-2 border-amber-300 rounded-2xl px-6 py-4 w-full">
                  <span className="text-5xl">
                    {badgeEarned.icon || "🎖️"}
                  </span>
                  <div className="text-center">
                    <p className="font-heading font-bold text-sm text-gray-900">
                      {badgeEarned.name}
                    </p>
                    <p className="text-xs text-gray-600 mt-2">
                      {badgeEarned.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              onClick={() => {
                setVisible(false);
                onClose?.();
              }}
              className="mt-6 px-6 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl text-sm font-medium text-gray-700 transition-colors"
            >
              Lanjutkan →
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
