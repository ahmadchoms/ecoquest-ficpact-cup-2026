"use client";

import { useRef, useCallback } from "react";
import { IMPACT_LABELS } from "@/utils/constants";
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
  
  // Safely get count from earnedBadges
  const badgeCount = Array.isArray(earnedBadges) ? earnedBadges.length : (typeof earnedBadges === 'number' ? earnedBadges : 0);
  // Safely get count from completedMissions
  const missionCount = Array.isArray(completedMissions) ? completedMissions.length : (typeof completedMissions === 'number' ? completedMissions : 0);
  // Safely get count from exploredProvinces
  const provinceCount = Array.isArray(exploredProvinces) ? exploredProvinces.length : 0;

  const handleShare = useCallback(async () => {
    if (!cardRef.current) return;
    try {
      // Gunakan canvas API langsung untuk menghindari masalah CSS
      const canvas = document.createElement("canvas");
      const CARD_WIDTH = 400;
      const CARD_HEIGHT = 400;
      const scale = 2;
      
      canvas.width = CARD_WIDTH * scale;
      canvas.height = CARD_HEIGHT * scale;
      
      const ctx = canvas.getContext("2d");
      ctx.scale(scale, scale);
      
      // Background
      ctx.fillStyle = "#f5e642";
      ctx.fillRect(0, 0, CARD_WIDTH, CARD_HEIGHT);
      
      // Border
      ctx.strokeStyle = "#000000";
      ctx.lineWidth = 3;
      ctx.strokeRect(1.5, 1.5, CARD_WIDTH - 3, CARD_HEIGHT - 3);
      
      // Shadow glow (top right)
      ctx.fillStyle = "rgba(255,255,255,0.2)";
      ctx.beginPath();
      ctx.arc(CARD_WIDTH + 30, -30, 70, 0, Math.PI * 2);
      ctx.fill();
      
      // Title Section
      ctx.font = "bold 32px Georgia";
      ctx.fillStyle = "#000000";
      ctx.textAlign = "center";
      ctx.fillText("🌿", CARD_WIDTH / 2, 50);
      ctx.font = "bold 18px Georgia";
      ctx.fillText(explorerName, CARD_WIDTH / 2, 80);
      ctx.font = "bold 11px Arial";
      ctx.fillStyle = "rgba(0,0,0,0.6)";
      ctx.fillText("ECOQUEST INDONESIA", CARD_WIDTH / 2, 100);
      
      // Stats divider line
      ctx.strokeStyle = "rgba(0,0,0,0.1)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(50, 120);
      ctx.lineTo(CARD_WIDTH - 50, 120);
      ctx.stroke();
      
      // Stats section
      const statsX = [70, 200, 330];
      const statsLabels = ["Level", "Misi", "Badge"];
      const statsValues = [level, missionCount, badgeCount];
      
      ctx.font = "bold 24px Georgia";
      ctx.fillStyle = "#000000";
      ctx.textAlign = "center";
      
      statsValues.forEach((val, idx) => {
        ctx.fillText(val.toString(), statsX[idx], 155);
        ctx.font = "bold 10px Arial";
        ctx.fillStyle = "rgba(0,0,0,0.6)";
        ctx.fillText(statsLabels[idx], statsX[idx], 175);
        ctx.font = "bold 24px Georgia";
        ctx.fillStyle = "#000000";
      });
      
      // Impact data grid
      ctx.font = "bold 14px Arial";
      const impactKeys = Object.entries(IMPACT_LABELS);
      const itemWidth = (CARD_WIDTH - 20) / 2;
      const itemHeight = 60;
      
      impactKeys.forEach(([key, { icon, label, unit }], idx) => {
        const row = Math.floor(idx / 2);
        const col = idx % 2;
        const x = 10 + col * itemWidth;
        const y = 200 + row * itemHeight;
        
        // Cell background
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(x, y, itemWidth - 5, itemHeight - 5);
        
        // Cell border
        ctx.strokeStyle = "#000000";
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, itemWidth - 5, itemHeight - 5);
        
        // Icon
        ctx.font = "bold 18px Arial";
        ctx.textAlign = "center";
        ctx.fillStyle = "#000000";
        ctx.fillText(icon, x + itemWidth / 2 - 2.5, y + 20);
        
        // Value
        ctx.font = "bold 14px Arial";
        ctx.fillStyle = "#000000";
        ctx.fillText((impactData[key] || 0).toString(), x + itemWidth / 2 - 2.5, y + 40);
        
        // Unit
        ctx.font = "bold 9px Arial";
        ctx.fillStyle = "#6b7280";
        ctx.fillText(unit, x + itemWidth / 2 - 2.5, y + 53);
      });
      
      // Footer
      ctx.font = "bold 9px Arial";
      ctx.fillStyle = "rgba(0,0,0,0.25)";
      ctx.textAlign = "center";
      ctx.fillText("ECOQUEST.ID", CARD_WIDTH / 2, CARD_HEIGHT - 10);
      
      // Download
      canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.download = `ecoquest-impact-${Date.now()}.png`;
        link.href = url;
        link.click();
        URL.revokeObjectURL(url);
      }, "image/png");
      
    } catch (err) {
      console.error("Failed to generate image:", err);
    }
  }, [level, missionCount, badgeCount, explorerName, impactData]);

  return (
    <div>
      <div
        style={{
          backgroundColor: "#f5e642",
          borderRadius: "1.5rem",
          padding: "1.5rem",
          border: "3px solid black",
          boxShadow: "4px 4px 0px rgba(0,0,0,0.2)",
          position: "relative",
          overflow: "hidden",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
        ref={cardRef}
      >
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

        <div style={{ textAlign: "center", marginBottom: "1.25rem", position: "relative", zIndex: "10" }}>
          <div style={{ fontSize: "1.875rem", marginBottom: "0.25rem" }}>🌿</div>
          <h3
            style={{
              fontFamily: "Georgia, serif",
              fontWeight: "900",
              fontSize: "1.125rem",
              color: "black",
            }}
          >
            {explorerName}
          </h3>
          <p
            style={{
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

        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "1rem", marginBottom: "1.5rem", position: "relative", zIndex: "10" }}>
          <div style={{ textAlign: "center" }}>
            <p
              style={{
                fontSize: "1.5rem",
                fontFamily: "Georgia, serif",
                fontWeight: "900",
                color: "black",
              }}
            >
              {level}
            </p>
            <p style={{ fontSize: "0.625rem", fontWeight: "700", color: "rgba(0,0,0,0.6)", textTransform: "uppercase" }}>
              Level
            </p>
          </div>
          <div style={{ width: "2px", height: "2rem", backgroundColor: "rgba(0,0,0,0.1)" }} />
          <div style={{ textAlign: "center" }}>
            <p
              style={{
                fontSize: "1.5rem",
                fontFamily: "Georgia, serif",
                fontWeight: "900",
                color: "black",
              }}
            >
              {missionCount}
            </p>
            <p style={{ fontSize: "0.625rem", fontWeight: "700", color: "rgba(0,0,0,0.6)", textTransform: "uppercase" }}>
              Misi
            </p>
          </div>
          <div style={{ width: "2px", height: "2rem", backgroundColor: "rgba(0,0,0,0.1)" }} />
          <div style={{ textAlign: "center" }}>
            <p
              style={{
                fontSize: "1.5rem",
                fontFamily: "Georgia, serif",
                fontWeight: "900",
                color: "black",
              }}
            >
              {badgeCount}
            </p>
            <p style={{ fontSize: "0.625rem", fontWeight: "700", color: "rgba(0,0,0,0.6)", textTransform: "uppercase" }}>
              Badge
            </p>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "0.5rem", position: "relative", zIndex: "10" }}>
          {Object.entries(IMPACT_LABELS).map(([key, { icon, label, unit }]) => (
            <div
              key={key}
              style={{
                backgroundColor: "white",
                border: "2px solid black",
                borderRadius: "0.75rem",
                padding: "0.5rem",
                textAlign: "center",
                boxShadow: "2px 2px 0 rgba(0,0,0,0.1)",
              }}
            >
              <span style={{ fontSize: "1.125rem", display: "block", marginBottom: "0.25rem" }}>{icon}</span>
              <p style={{ fontSize: "0.875rem", fontWeight: "900", color: "black" }}>
                {impactData[key] || 0}
              </p>
              <p style={{ fontSize: "0.5625rem", fontWeight: "700", color: "#6b7280", textTransform: "uppercase" }}>
                {unit}
              </p>
            </div>
          ))}
        </div>

        <p style={{ textAlign: "center", fontSize: "0.625rem", fontWeight: "700", color: "rgba(0,0,0,0.25)", marginTop: "1rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>
          ecoquest.id
        </p>
      </div>

      <EcoButton
        onClick={handleShare}
        variant="primary"
        className="w-full mt-4"
      >
        📸 Download & Share
      </EcoButton>
    </div>
  );
}
