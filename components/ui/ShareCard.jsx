"use client";

import { useRef, useCallback } from "react";
import { IMPACT_LABELS } from "@/utils/constants";
import { toast } from "@/lib/toast";
import EcoButton from "@/components/design-system/EcoButton";

export default function ShareCard({
  explorerName = "Eco Explorer",
  level = 1,
  totalXP = 0,
  earnedBadges = [],
  completedMissions = 0,
  exploredProvinces = [],
  impactData = {
    carbonSaved: 0,
    waterSaved: 0,
    wasteClassified: 0,
    speciesLearned: 0,
    mangroveRestored: 0,
  },
}) {
  const cardRef = useRef(null);

  const badgeCount = Array.isArray(earnedBadges)
    ? earnedBadges.length
    : typeof earnedBadges === "number"
    ? earnedBadges
    : 0;
  const missionCount = Array.isArray(completedMissions)
    ? completedMissions.length
    : typeof completedMissions === "number"
    ? completedMissions
    : 0;

  const handleShare = useCallback(async () => {
    if (!cardRef.current) return;

    try {
      const { toBlob } = await import("html-to-image");

      const blob = await toBlob(cardRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: "#f5e642",
        // Skip external stylesheets — they carry lab()/oklch() colors
        // that the canvas renderer can't handle
        filter: (node) => {
          if (node.tagName === "LINK" && node.rel === "stylesheet") return false;
          if (node.tagName === "STYLE") return false;
          return true;
        },
      });

      if (!blob) {
        toast.error("Gagal download!", "Tidak dapat membuat gambar");
        return;
      }

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.download = `ecoquest-impact-${Date.now()}.png`;
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);

      toast.success("Berhasil!", "Gambar berhasil didownload");
    } catch (err) {
      console.error("Failed to generate image:", err);
      toast.error("Gagal download!", err.message || "Silakan coba lagi");
    }
  }, []);

  // Shared reset for text elements to prevent Tailwind base styles bleeding in
  const textReset = {
    margin: 0,
    padding: 0,
    border: "none",
    outline: "none",
    background: "none",
    boxShadow: "none",
  };

  return (
    <div>
      <div
        ref={cardRef}
        style={{
          backgroundColor: "#f5e642",
          padding: "1.5rem",
          border: "3px solid #000000",
          boxShadow: "4px 4px 0px rgba(0,0,0,0.2)",
          position: "relative",
          overflow: "hidden",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        {/* Decorative circle */}
        <div
          style={{
            position: "absolute",
            top: "-40px",
            right: "-40px",
            width: "128px",
            height: "128px",
            backgroundColor: "rgba(255,255,255,0.2)",
            borderRadius: "50%",
            filter: "blur(40px)",
            pointerEvents: "none",
          }}
        />

        {/* Header */}
        <div
          style={{
            textAlign: "center",
            marginBottom: "1.25rem",
            position: "relative",
            zIndex: 10,
          }}
        >
          <div style={{ fontSize: "1.875rem", marginBottom: "0.25rem" }}>🌿</div>
          <h3
            style={{
              ...textReset,
              fontFamily: "Georgia, serif",
              fontWeight: "900",
              fontSize: "1.125rem",
              color: "#000000",
            }}
          >
            {explorerName}
          </h3>
          <p
            style={{
              ...textReset,
              fontSize: "0.75rem",
              fontWeight: "700",
              color: "rgba(0,0,0,0.6)",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
            }}
          >
            EcoQuest Indonesia
          </p>
        </div>

        {/* Stats row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "1rem",
            marginBottom: "1.5rem",
            position: "relative",
            zIndex: 10,
          }}
        >
          {[
            { value: level, label: "Level" },
            { value: missionCount, label: "Misi" },
            { value: badgeCount, label: "Badge" },
          ].reduce((acc, item, i, arr) => {
            acc.push(
              <div key={item.label} style={{ textAlign: "center" }}>
                <p
                  style={{
                    ...textReset,
                    fontSize: "1.5rem",
                    fontFamily: "Georgia, serif",
                    fontWeight: "900",
                    color: "#000000",
                  }}
                >
                  {item.value}
                </p>
                <p
                  style={{
                    ...textReset,
                    fontSize: "0.625rem",
                    fontWeight: "700",
                    color: "rgba(0,0,0,0.6)",
                    textTransform: "uppercase",
                  }}
                >
                  {item.label}
                </p>
              </div>
            );
            if (i < arr.length - 1) {
              acc.push(
                <div
                  key={`div-${i}`}
                  style={{
                    width: "2px",
                    height: "2rem",
                    backgroundColor: "rgba(0,0,0,0.1)",
                    flexShrink: 0,
                  }}
                />
              );
            }
            return acc;
          }, [])}
        </div>

        {/* Impact grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "0.5rem",
            position: "relative",
            zIndex: 10,
          }}
        >
          {Object.entries(IMPACT_LABELS).map(([key, { icon, unit }]) => (
            <div
              key={key}
              style={{
                backgroundColor: "#ffffff",
                border: "2px solid #000000",
                borderRadius: "0.75rem",
                padding: "0.5rem",
                textAlign: "center",
                boxShadow: "2px 2px 0 rgba(0,0,0,0.1)",
                outline: "none",
              }}
            >
              <span
                style={{
                  fontSize: "1.125rem",
                  display: "block",
                  marginBottom: "0.25rem",
                }}
              >
                {icon}
              </span>
              <p
                style={{
                  ...textReset,
                  fontSize: "0.875rem",
                  fontWeight: "900",
                  color: "#000000",
                }}
              >
                {impactData[key] || 0}
              </p>
              <p
                style={{
                  ...textReset,
                  fontSize: "0.5625rem",
                  fontWeight: "700",
                  color: "#6b7280",
                  textTransform: "uppercase",
                }}
              >
                {unit}
              </p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <p
          style={{
            ...textReset,
            textAlign: "center",
            fontSize: "0.625rem",
            fontWeight: "700",
            color: "rgba(0,0,0,0.25)",
            marginTop: "1rem",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
          }}
        >
          ecoquest.id
        </p>
      </div>

      <EcoButton onClick={handleShare} variant="primary" className="w-full mt-4">
        📸 Download & Share
      </EcoButton>
    </div>
  );
}