"use client";

import PageWrapper from "@/components/layout/PageWrapper";
import NeoButton from "./NeoButton";
import { ArrowLeft } from "lucide-react";

const VARIANT_MAP = {
  loading: {
    bgClass: "bg-yellow",
    animation: "animate-wiggle",
    emojiFilter: "",
  },
  error: {
    bgClass: "bg-pink",
    animation: "",
    emojiFilter: "grayscale opacity-80",
  },
};

export default function StatusCard({
  emoji = "🔍",
  title,
  variant = "loading",
  backHref,
  backLabel = "Kembali ke Peta",
}) {
  const { bgClass, animation, emojiFilter } = VARIANT_MAP[variant] ?? VARIANT_MAP.error;

  return (
    <PageWrapper className="min-h-screen bg-white bg-grid-pattern flex items-center justify-center px-4 pt-16 md:pt-20">
      <div
        className={`text-center ${bgClass} ${animation} border-3 border-black shadow-hard p-8 sm:p-10 rounded-4xl max-w-xs w-full`}
      >
        <p className={`text-6xl sm:text-8xl mb-4 sm:mb-6 ${emojiFilter}`}>
          {emoji}
        </p>
        <h2 className="font-display text-xl sm:text-2xl font-bold text-black mb-4 sm:mb-6">
          {title}
        </h2>
        {backHref && (
          <NeoButton
            href={backHref}
            icon={<ArrowLeft size={18} strokeWidth={3} />}
            size="sm"
          >
            {backLabel}
          </NeoButton>
        )}
      </div>
    </PageWrapper>
  );
}
