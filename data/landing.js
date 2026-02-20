export const features = [
  { 
    title: "Jelajahi Nusantara", 
    desc: "Peta interaktif 34 provinsi dengan detail ekosistem unik.", 
    iconName: "Globe", 
    bg: "bg-green" 
  },
  { 
    title: "Misi Edukasi", 
    desc: "Tantangan seru untuk belajar tentang lingkungan.", 
    iconName: "Target", 
    bg: "bg-yellow" 
  },
  { 
    title: "Dampak Nyata", 
    desc: "Pantau jejak karbon dan kontribusi konservasimu.", 
    iconName: "Leaf", 
    bg: "bg-orange" 
  },
  { 
    title: "Komunitas", 
    desc: "Bergabung dengan ribuan explorer lainnya.", 
    iconName: "Users", 
    bg: "bg-purple" 
  },
];

export const missions = [
  { 
    id: 1, 
    title: "Sortir Sampah", 
    description: "Pisahkan sampah organik dan anorganik di rumahmu.", 
    xpReward: 150, 
    difficulty: "Mudah", 
    icon: "♻️" 
  },
  { 
    id: 2, 
    title: "Tanam Pohon", 
    description: "Tanam satu pohon di lingkungan sekitarmu.", 
    xpReward: 300, 
    difficulty: "Sedang", 
    icon: "🌳" 
  },
  { 
    id: 3, 
    title: "Hemat Energi", 
    description: "Matikan lampu selama 1 jam di malam hari.", 
    xpReward: 100, 
    difficulty: "Mudah", 
    icon: "💡" 
  },
];

export const partners = [
  "Forestonia", 
  "Oceanix", 
  "EcoDefender", 
  "NusaLab", 
  "BioQuest", 
  "HijauID", 
  "EcoLab", 
  "GreenGen"
];

export const howItWorksSteps = [
  {
    num: 1,
    title: "Pilih Provinsi",
    desc: "Jelajahi peta interaktif Indonesia. Setiap provinsi memiliki tantangan dan ekosistem unik yang menunggu untuk diselamatkan.",
    illustration: "IlluMap",
    bg: "bg-mint",
    flip: false,
  },
  {
    num: 2,
    title: "Selesaikan Misi",
    desc: "Mulai dari kuis spesies hingga kalkulator jejak karbon. Dapatkan XP dan lencana untuk setiap aksi nyata yang kamu lakukan.",
    illustration: "IlluTarget",
    bg: "bg-orange",
    flip: true,
  },
  {
    num: 3,
    title: "Raih Peringkat",
    desc: "Naikkan levelmu dari Pemula hingga Penjaga Bumi. Bandingkan pencapaianmu dengan teman-teman di Leaderboard.",
    illustration: "IlluTrophy",
    bg: "bg-purple",
    flip: false,
  },
];
