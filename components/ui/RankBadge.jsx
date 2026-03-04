import { memo } from "react";

// ─── Rank Config ───────────────────────────────────────────────────────────
const RANKS = {
  bronze: {
    label: "Bronze",
    hex1: ["#c97a3a", "#e8974f", "#c06428"],
    hex2: ["#b86830", "#d4824a", "#a05520"],
    hex3: ["#a05520", "#c97a3a", "#8b4518"],
    colors: {
      center: ["#e8974f", "#f5b575", "#c97a3a"],
      shine: "rgba(255,200,140,0.55)",
      shadow: "rgba(80,30,0,0.6)",
      rimLight: "#f5c080",
      accent: "#ffcc88",
      glow: "rgba(200,120,50,0.2)",
    },
  },
  silver: {
    label: "Silver",
    hex1: ["#5a6475", "#8a96a8", "#474f5c"],
    hex2: ["#4a5260", "#7a8696", "#3d4450"],
    hex3: ["#3d4450", "#626e7e", "#303840"],
    colors: {
      center: ["#8a96a8", "#c0cad6", "#6a7685"],
      shine: "rgba(220,230,240,0.55)",
      shadow: "rgba(20,25,35,0.65)",
      rimLight: "#d0dae6",
      accent: "#c8d4e0",
      glow: "rgba(130,150,170,0.2)",
    },
  },
  gold: {
    label: "Gold",
    hex1: ["#b07d10", "#e6b030", "#906500"],
    hex2: ["#9a6c08", "#cc9a20", "#7a5200"],
    hex3: ["#7a5200", "#b07d10", "#634200"],
    colors: {
      center: ["#e6b030", "#f8d870", "#c09020"],
      shine: "rgba(255,235,120,0.6)",
      shadow: "rgba(60,35,0,0.65)",
      rimLight: "#ffe080",
      accent: "#ffd84a",
      glow: "rgba(220,170,20,0.3)",
    },
  },
  platinum: {
    label: "Platinum",
    hex1: ["#0a7a8a", "#18b8cc", "#086070"],
    hex2: ["#087080", "#10a0b2", "#065868"],
    hex3: ["#065868", "#0a8898", "#044858"],
    colors: {
      center: ["#18b8cc", "#70e8f4", "#0e9aaa"],
      shine: "rgba(140,240,255,0.55)",
      shadow: "rgba(0,40,55,0.65)",
      rimLight: "#80eef8",
      accent: "#60e0f0",
      glow: "rgba(20,190,215,0.4)",
    },
  },
  diamond: {
    label: "Diamond",
    hex1: ["#1a3ba0", "#3868e0", "#122888"],
    hex2: ["#153080", "#2e5acc", "#0e2272"],
    hex3: ["#0e2272", "#1a3ba0", "#0a1a5e"],
    colors: {
      center: ["#3868e0", "#80aeff", "#2050c0"],
      shine: "rgba(160,200,255,0.6)",
      shadow: "rgba(5,10,50,0.7)",
      rimLight: "#a0c4ff",
      accent: "#88b8ff",
      glow: "rgba(60,110,255,0.5)",
    },
  },
  challenger: {
    label: "Challenger",
    hex1: ["#4a10aa", "#8830ee", "#380880"],
    hex2: ["#400898", "#7420d8", "#2e0668"],
    hex3: ["#2e0668", "#5514b8", "#220450"],
    colors: {
      center: ["#a050ff", "#d090ff", "#8030ee"],
      shine: "rgba(210,160,255,0.65)",
      shadow: "rgba(20,0,50,0.7)",
      rimLight: "#cc88ff",
      accent: "#cc80ff",
      glow: "rgba(150,60,255,0.8)",
    },
  },
};

// ─── Helpers ───────────────────────────────────────────────────────────────
function hexPath(cx, cy, r, round = 0) {
  const points = [];
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 180) * (60 * i - 30);
    points.push([cx + r * Math.cos(angle), cy + r * Math.sin(angle)]);
  }
  if (round === 0) {
    return (
      points
        .map(
          (p, i) =>
            `${i === 0 ? "M" : "L"}${p[0].toFixed(2)},${p[1].toFixed(2)}`,
        )
        .join(" ") + " Z"
    );
  }
  let d = "";
  for (let i = 0; i < 6; i++) {
    const prev = points[(i + 5) % 6];
    const curr = points[i];
    const next = points[(i + 1) % 6];
    const dx1 = curr[0] - prev[0],
      dy1 = curr[1] - prev[1];
    const dx2 = next[0] - curr[0],
      dy2 = next[1] - curr[1];
    const len1 = Math.sqrt(dx1 * dx1 + dy1 * dy1);
    const len2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);
    const r1 = Math.min(round, len1 / 2),
      r2 = Math.min(round, len2 / 2);
    const p1 = [curr[0] - (dx1 / len1) * r1, curr[1] - (dy1 / len1) * r1];
    const p2 = [curr[0] + (dx2 / len2) * r2, curr[1] + (dy2 / len2) * r2];
    d +=
      i === 0
        ? `M${p1[0].toFixed(2)},${p1[1].toFixed(2)}`
        : `L${p1[0].toFixed(2)},${p1[1].toFixed(2)}`;
    d += ` Q${curr[0].toFixed(2)},${curr[1].toFixed(2)} ${p2[0].toFixed(2)},${p2[1].toFixed(2)} `;
  }
  return d + "Z";
}

function roundedStarPath(cx, cy, outerR, innerR, points = 5, cornerRadius = 3) {
  const all = [];
  for (let i = 0; i < points; i++) {
    const oa = (Math.PI * 2 * i) / points - Math.PI / 2;
    const ia = oa + Math.PI / points;
    all.push([cx + outerR * Math.cos(oa), cy + outerR * Math.sin(oa)]);
    all.push([cx + innerR * Math.cos(ia), cy + innerR * Math.sin(ia)]);
  }
  let d = "";
  for (let i = 0; i < all.length; i++) {
    const prev = all[(i - 1 + all.length) % all.length];
    const curr = all[i];
    const next = all[(i + 1) % all.length];
    const dx1 = curr[0] - prev[0],
      dy1 = curr[1] - prev[1];
    const dx2 = next[0] - curr[0],
      dy2 = next[1] - curr[1];
    const l1 = Math.sqrt(dx1 * dx1 + dy1 * dy1);
    const l2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);
    const r = Math.min(cornerRadius, l1 / 2, l2 / 2);
    const p1 = [curr[0] - (dx1 / l1) * r, curr[1] - (dy1 / l1) * r];
    const p2 = [curr[0] + (dx2 / l2) * r, curr[1] + (dy2 / l2) * r];
    d +=
      i === 0
        ? `M${p1[0].toFixed(2)},${p1[1].toFixed(2)}`
        : `L${p1[0].toFixed(2)},${p1[1].toFixed(2)}`;
    d += ` Q${curr[0].toFixed(2)},${curr[1].toFixed(2)} ${p2[0].toFixed(2)},${p2[1].toFixed(2)} `;
  }
  return d + "Z";
}

// ─── Sparkles ──────────────────────────────────────────────────────────────
function Sparkles({ colors }) {
  const sparkles = [
    { cx: 12, cy: 10, r: 2.2, delay: 0 },
    { cx: 68, cy: 14, r: 1.6, delay: 0.4 },
    { cx: 78, cy: 50, r: 2.0, delay: 0.8 },
    { cx: 64, cy: 80, r: 1.5, delay: 1.2 },
    { cx: 16, cy: 76, r: 1.8, delay: 0.6 },
    { cx: 6, cy: 44, r: 1.4, delay: 1.5 },
    { cx: 40, cy: 4, r: 1.3, delay: 0.3 },
    { cx: 74, cy: 30, r: 1.7, delay: 1.0 },
  ];

  return (
    <>
      {sparkles.map((s, i) => (
        <g
          key={i}
          style={{
            transformOrigin: `${s.cx}px ${s.cy}px`,
            animation: `sparkle-star 2s ease-in-out ${s.delay}s infinite`,
          }}
        >
          <polygon
            points={`
              ${s.cx},${s.cy - s.r * 2.2} ${s.cx + s.r * 0.5},${s.cy - s.r * 0.5}
              ${s.cx + s.r * 2.2},${s.cy} ${s.cx + s.r * 0.5},${s.cy + s.r * 0.5}
              ${s.cx},${s.cy + s.r * 2.2} ${s.cx - s.r * 0.5},${s.cy + s.r * 0.5}
              ${s.cx - s.r * 2.2},${s.cy} ${s.cx - s.r * 0.5},${s.cy - s.r * 0.5}
            `}
            fill={i % 2 === 0 ? colors.accent : "white"}
          />
        </g>
      ))}
    </>
  );
}

// ─── Center Ornament (Base Scale: 120x120) ─────────────────────────────────
function CenterOrnament({ rank, cx, cy, c }) {
  const grad = `center-${rank}`;
  const shineGrad = `cshine-${rank}`;

  const defs = (
    <defs>
      <radialGradient id={grad} cx="35%" cy="30%" r="65%">
        <stop offset="0%" stopColor={c.center[1]} />
        <stop offset="55%" stopColor={c.center[0]} />
        <stop offset="100%" stopColor={c.center[2]} />
      </radialGradient>
      <radialGradient id={shineGrad} cx="30%" cy="25%" r="60%">
        <stop offset="0%" stopColor="white" stopOpacity="0.9" />
        <stop offset="100%" stopColor="white" stopOpacity="0" />
      </radialGradient>
    </defs>
  );

  // Sisa logika CenterOrnament kamu (tidak diubah, karena sudah dibungkus transform-scale di Main Component)
  if (rank === "bronze") {
    const starPath = roundedStarPath(cx, cy, 22, 10, 5, 4);
    return (
      <g filter="drop-shadow(0px 2px 4px rgba(0,0,0,0.4))">
        {defs}
        <path d={starPath} fill={`url(#${grad})`} />
        <path
          d={starPath}
          fill="none"
          stroke={c.center[2]}
          strokeWidth="1.5"
          strokeOpacity="0.7"
        />
        <path
          d={roundedStarPath(cx - 1, cy - 1, 18, 8, 5, 3)}
          fill={`url(#${shineGrad})`}
          opacity="0.35"
        />
      </g>
    );
  }

  if (rank === "silver") {
    return (
      <g filter="drop-shadow(0px 2px 4px rgba(0,0,0,0.4))">
        {defs}
        <polygon
          points={`${cx},${cy - 22} ${cx + 18},${cy - 2} ${cx},${cy + 22} ${cx - 18},${cy - 2}`}
          fill={`url(#${grad})`}
        />
        <polygon
          points={`${cx},${cy - 22} ${cx + 18},${cy - 2} ${cx},${cy + 22} ${cx - 18},${cy - 2}`}
          fill="none"
          stroke={c.center[2]}
          strokeWidth="1.5"
          strokeOpacity="0.7"
        />
        <line
          x1={cx}
          y1={cy - 22}
          x2={cx}
          y2={cy + 22}
          stroke={c.center[2]}
          strokeWidth="0.8"
          strokeOpacity="0.4"
        />
        <line
          x1={cx - 18}
          y1={cy - 2}
          x2={cx + 18}
          y2={cy - 2}
          stroke={c.center[2]}
          strokeWidth="0.8"
          strokeOpacity="0.4"
        />
        <path
          d={`M${cx - 18},${cy - 2} Q${cx},${cy - 10} ${cx + 18},${cy - 2}`}
          fill={`url(#${shineGrad})`}
          opacity="0.4"
        />
      </g>
    );
  }

  if (rank === "gold") {
    const pts = Array.from({ length: 8 }, (_, i) => {
      const a = (Math.PI * 2 * i) / 8 - Math.PI / 4;
      const or = i % 2 === 0 ? 22 : 14;
      return `${cx + or * Math.cos(a)},${cy + or * Math.sin(a)}`;
    }).join(" ");
    return (
      <g filter="drop-shadow(0px 2px 4px rgba(0,0,0,0.4))">
        {defs}
        <polygon points={pts} fill={`url(#${grad})`} />
        <polygon
          points={pts}
          fill="none"
          stroke={c.center[2]}
          strokeWidth="1.2"
          strokeOpacity="0.6"
        />
        <circle cx={cx} cy={cy} r="8" fill={c.center[1]} />
        <circle
          cx={cx}
          cy={cy}
          r="8"
          fill="none"
          stroke={c.center[2]}
          strokeWidth="1"
          strokeOpacity="0.5"
        />
        <circle
          cx={cx - 2}
          cy={cy - 2}
          r="4"
          fill={`url(#${shineGrad})`}
          opacity="0.6"
        />
      </g>
    );
  }

  if (rank === "platinum") {
    const gemPts = `${cx},${cy - 24} ${cx + 16},${cy - 8} ${cx + 16},${cy + 8} ${cx},${cy + 24} ${cx - 16},${cy + 8} ${cx - 16},${cy - 8}`;
    return (
      <g filter="drop-shadow(0px 2px 5px rgba(0,0,0,0.5))">
        {defs}
        <polygon points={gemPts} fill={`url(#${grad})`} />
        <polygon
          points={gemPts}
          fill="none"
          stroke={c.center[2]}
          strokeWidth="1.5"
          strokeOpacity="0.7"
        />
        <polygon
          points={`${cx},${cy - 24} ${cx + 16},${cy - 8} ${cx - 16},${cy - 8}`}
          fill={`url(#${shineGrad})`}
          opacity="0.45"
        />
        <line
          x1={cx}
          y1={cy - 24}
          x2={cx}
          y2={cy + 24}
          stroke={c.center[2]}
          strokeWidth="0.7"
          strokeOpacity="0.4"
        />
        <line
          x1={cx - 16}
          y1={cy - 8}
          x2={cx + 16}
          y2={cy - 8}
          stroke={c.center[2]}
          strokeWidth="0.7"
          strokeOpacity="0.3"
        />
        <line
          x1={cx - 16}
          y1={cy + 8}
          x2={cx + 16}
          y2={cy + 8}
          stroke={c.center[2]}
          strokeWidth="0.7"
          strokeOpacity="0.3"
        />
      </g>
    );
  }

  if (rank === "diamond") {
    return (
      <g filter="drop-shadow(0px 2px 6px rgba(0,0,0,0.5))">
        {defs}
        <polygon
          points={`${cx},${cy - 24} ${cx + 20},${cy} ${cx},${cy + 24} ${cx - 20},${cy}`}
          fill={`url(#${grad})`}
        />
        <polygon
          points={`${cx},${cy - 24} ${cx + 20},${cy} ${cx},${cy + 24} ${cx - 20},${cy}`}
          fill="none"
          stroke={c.center[2]}
          strokeWidth="1.5"
          strokeOpacity="0.8"
        />
        <polygon
          points={`${cx},${cy - 24} ${cx + 20},${cy} ${cx - 20},${cy}`}
          fill={`url(#${shineGrad})`}
          opacity="0.5"
        />
        <line
          x1={cx}
          y1={cy - 24}
          x2={cx}
          y2={cy + 24}
          stroke={c.center[2]}
          strokeWidth="0.8"
          strokeOpacity="0.45"
        />
        <line
          x1={cx - 20}
          y1={cy}
          x2={cx + 20}
          y2={cy}
          stroke={c.center[2]}
          strokeWidth="0.8"
          strokeOpacity="0.45"
        />
        <line
          x1={cx}
          y1={cy - 24}
          x2={cx + 20}
          y2={cy}
          stroke={c.center[2]}
          strokeWidth="0.8"
          strokeOpacity="0.3"
        />
        <line
          x1={cx}
          y1={cy - 24}
          x2={cx - 20}
          y2={cy}
          stroke={c.center[2]}
          strokeWidth="0.8"
          strokeOpacity="0.3"
        />
        <circle cx={cx} cy={cy} r="5" fill={c.center[1]} opacity="0.9" />
        <circle
          cx={cx - 1.5}
          cy={cy - 1.5}
          r="2.5"
          fill="white"
          opacity="0.7"
        />
      </g>
    );
  }

  if (rank === "challenger") {
    const crownBase = `M${cx - 20},${cy + 14} L${cx - 20},${cy - 4} L${cx - 12},${cy + 4} L${cx},${cy - 16} L${cx + 12},${cy + 4} L${cx + 20},${cy - 4} L${cx + 20},${cy + 14} Z`;
    return (
      <g filter="drop-shadow(0px 3px 8px rgba(0,0,0,0.6))">
        {defs}
        <path d={crownBase} fill={`url(#${grad})`} />
        <path
          d={crownBase}
          fill="none"
          stroke={c.center[2]}
          strokeWidth="1.5"
          strokeOpacity="0.8"
        />
        <path
          d={`M${cx - 20},${cy - 4} L${cx - 12},${cy + 4} L${cx},${cy - 16} L${cx + 12},${cy + 4} L${cx + 20},${cy - 4} L${cx + 20},${cy + 2} L${cx + 12},${cy + 10} L${cx},${cy - 8} L${cx - 12},${cy + 10} L${cx - 20},${cy + 2} Z`}
          fill={`url(#${shineGrad})`}
          opacity="0.35"
        />
        <circle
          cx={cx}
          cy={cy - 17}
          r="4"
          fill={c.center[1]}
          stroke={c.center[2]}
          strokeWidth="0.8"
        />
        <circle
          cx={cx - 20}
          cy={cy - 5}
          r="3"
          fill={c.center[1]}
          stroke={c.center[2]}
          strokeWidth="0.8"
        />
        <circle
          cx={cx + 20}
          cy={cy - 5}
          r="3"
          fill={c.center[1]}
          stroke={c.center[2]}
          strokeWidth="0.8"
        />
        <circle cx={cx} cy={cy - 17} r="2" fill="white" opacity="0.8" />
        <circle cx={cx - 20} cy={cy - 5} r="1.5" fill="white" opacity="0.7" />
        <circle cx={cx + 20} cy={cy - 5} r="1.5" fill="white" opacity="0.7" />
      </g>
    );
  }
  return null;
}

// ─── Main Badge Component ──────────────────────────────────────────────────
const RankBadge = ({
  rank = "bronze",
  size = 120,
  showLabel = true,
  className = "",
}) => {
  const cfg = RANKS[rank] ?? RANKS.bronze;
  const id = rank;

  const S = size;
  const cx = S / 2;
  const cy = S / 2;

  const R1 = S * 0.47;
  const R2 = S * 0.38;
  const R3 = S * 0.29;
  const ROUND = S * 0.06;

  const isChallenger = rank === "challenger";

  // Skala dihitung berdasarkan desain asal (120px)
  const scaleRatio = size / 120;

  return (
    <div className={`inline-flex flex-col items-center gap-2 ${className}`}>
      <svg
        width={S}
        height={S}
        viewBox={`0 0 ${S} ${S}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          filter: isChallenger
            ? `drop-shadow(0 0 14px ${cfg.colors.glow}) drop-shadow(0 0 28px ${cfg.colors.glow})`
            : `drop-shadow(0 6px 14px ${cfg.colors.glow})`,
        }}
      >
        <defs>
          {/* Semua Animasi Global ditaruh di sini agar konsisten */}
          <style>{`
            @keyframes sparkle-star {
              0%, 100% { opacity: 0; transform: scale(0) rotate(0deg); }
              50% { opacity: 1; transform: scale(1) rotate(180deg); }
            }
            @keyframes chal-pulse {
              0%, 100% { opacity: 0.4; transform: scale(0.95); }
              50% { opacity: 0.9; transform: scale(1.05); }
            }
            .chal-glow-ring {
              transform-origin: ${cx}px ${cy}px;
              animation: chal-pulse 2.2s ease-in-out infinite;
            }
          `}</style>
          <linearGradient id={`hex1-${id}`} x1="20%" y1="0%" x2="80%" y2="100%">
            <stop offset="0%" stopColor={cfg.hex1[1]} />
            <stop offset="50%" stopColor={cfg.hex1[0]} />
            <stop offset="100%" stopColor={cfg.hex1[2]} />
          </linearGradient>

          <linearGradient id={`hex2-${id}`} x1="20%" y1="0%" x2="80%" y2="100%">
            <stop offset="0%" stopColor={cfg.hex2[1]} />
            <stop offset="50%" stopColor={cfg.hex2[0]} />
            <stop offset="100%" stopColor={cfg.hex2[2]} />
          </linearGradient>

          <linearGradient id={`hex3-${id}`} x1="20%" y1="0%" x2="80%" y2="100%">
            <stop offset="0%" stopColor={cfg.hex3[1]} />
            <stop offset="50%" stopColor={cfg.hex3[0]} />
            <stop offset="100%" stopColor={cfg.hex3[2]} />
          </linearGradient>

          <radialGradient id={`shine-${id}`} cx="40%" cy="25%" r="55%">
            <stop offset="0%" stopColor="white" stopOpacity="0.55" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </radialGradient>

          <radialGradient id={`shadow-${id}`} cx="50%" cy="85%" r="50%">
            <stop offset="0%" stopColor="black" stopOpacity="0.4" />
            <stop offset="100%" stopColor="black" stopOpacity="0" />
          </radialGradient>

          {isChallenger && (
            <radialGradient id="chal-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={cfg.colors.glow} stopOpacity="0.5" />
              <stop offset="100%" stopColor={cfg.colors.glow} stopOpacity="0" />
            </radialGradient>
          )}
        </defs>

        {isChallenger && (
          <ellipse
            className="chal-glow-ring"
            cx={cx}
            cy={cy}
            rx={R1 * 1.25}
            ry={R1 * 1.25}
            fill="url(#chal-glow)"
          />
        )}

        <path
          d={hexPath(cx, cy + S * 0.015, R1, ROUND)}
          fill={cfg.hex1[2]}
          opacity="0.7"
        />
        <path d={hexPath(cx, cy, R1, ROUND)} fill={`url(#hex1-${id})`} />
        <path
          d={hexPath(cx, cy, R1, ROUND)}
          fill="none"
          stroke={cfg.colors.rimLight}
          strokeWidth={S * 0.012}
          strokeOpacity="0.45"
        />

        <path d={hexPath(cx, cy, R2, ROUND * 0.8)} fill={`url(#hex2-${id})`} />
        <path
          d={hexPath(cx, cy, R2, ROUND * 0.8)}
          fill="none"
          stroke={cfg.hex1[2]}
          strokeWidth={S * 0.015}
          strokeOpacity="0.6"
        />

        {/* Inner glow effect for middle ring */}
        <path
          d={hexPath(cx, cy, R2, ROUND * 0.8)}
          fill="none"
          stroke={cfg.colors.accent}
          strokeWidth={S * 0.005}
          strokeOpacity="0.3"
          filter="blur(2px)"
        />

        <path d={hexPath(cx, cy, R3, ROUND * 0.6)} fill={`url(#hex3-${id})`} />
        <path
          d={hexPath(cx, cy, R3, ROUND * 0.6)}
          fill="none"
          stroke={cfg.colors.rimLight}
          strokeWidth={S * 0.01}
          strokeOpacity="0.3"
        />

        {/* Scaled Center Components */}
        <g transform={`scale(${scaleRatio})`} transformOrigin="0 0">
          {/* Base koordinat tetap 60 karena kita mengatur scale-nya */}
          <CenterOrnament rank={rank} cx={60} cy={60} c={cfg.colors} />
          {isChallenger && <Sparkles colors={cfg.colors} />}
        </g>

        <path d={hexPath(cx, cy, R1, ROUND)} fill={`url(#shine-${id})`} />
        <path d={hexPath(cx, cy, R1, ROUND)} fill={`url(#shadow-${id})`} />
      </svg>

      {showLabel && (
        <span
          className="font-black uppercase text-[12px] transition-all duration-300"
          style={{
            tracking: "0.18em",
            // Menggunakan gradient text agar label lebih terlihat premium
            background: `linear-gradient(135deg, ${cfg.colors.rimLight}, ${cfg.hex1[1]})`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            textShadow: isChallenger
              ? `0 0 12px ${cfg.colors.glow}`
              : `0 2px 4px rgba(0,0,0,0.5)`,
          }}
        >
          {cfg.label}
        </span>
      )}
    </div>
  );
};

export default RankBadge;
