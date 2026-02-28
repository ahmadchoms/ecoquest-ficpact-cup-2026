const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("Starting seed process...");

  // 1. Clean existing data
  await prisma.missionCompletion.deleteMany();
  await prisma.mission.deleteMany();
  await prisma.badge.deleteMany();
  await prisma.user.deleteMany();
  await prisma.province.deleteMany();
  console.log("Cleared existing data.");

  // 2. Seed Badges
  const badges = await Promise.all([
    prisma.badge.create({
      data: {
        name: "Carbon Conscious",
        description: "Berhasil menghitung jejak karbon pribadimu.",
        icon: "🌡️",
        rarity: "COMMON",
        category: "CLIMATE",
      }
    }),
    prisma.badge.create({
      data: {
        name: "Waste Warrior",
        description: "Maestro pemilah sampah — tahu bedanya organik, anorganik, dan B3.",
        icon: "♻️",
        rarity: "COMMON",
        category: "WASTE",
      }
    }),
    prisma.badge.create({
      data: {
        name: "Species Guardian",
        description: "Penjaga satwa liar langka Indonesia.",
        icon: "🦏",
        rarity: "UNCOMMON",
        category: "BIODIVERSITY",
      }
    }),
    prisma.badge.create({
      data: {
        name: "Mangrove Hero",
        description: "Berhasil merestorasi pesisir pantai.",
        icon: "🌊",
        rarity: "UNCOMMON",
        category: "COASTAL",
      }
    }),
    prisma.badge.create({
      data: {
        name: "Indonesian Hero",
        description: "Pahlawan Nusantara.",
        icon: "🇮🇩",
        rarity: "LEGENDARY",
        category: "MILESTONE",
      }
    }),
  ]);
  console.log(`Seeded ${badges.length} badges.`);

  // 3. Seed Users
  const passwordHash = await bcrypt.hash("password123", 10);
  
  const superAdmin = await prisma.user.create({
    data: {
      username: "superadmin",
      email: "admin@ecoquest.id",
      password: passwordHash,
      role: "SUPER_ADMIN",
      level: 99,
      xp: 150000,
      badges: {
        connect: [{ id: badges[4].id }]
      }
    }
  });

  const regionalAdmin = await prisma.user.create({
    data: {
      username: "admin_jabar",
      email: "jabar@ecoquest.id",
      password: passwordHash,
      role: "ADMIN",
      level: 50,
      xp: 45000,
    }
  });

  const users = await Promise.all(
    Array.from({ length: 18 }).map((_, i) => 
      prisma.user.create({
        data: {
          username: `eco_explorer_${i+1}`,
          email: `user${i+1}@example.com`,
          password: passwordHash,
          role: "USER",
          level: Math.floor(Math.random() * 20) + 1,
          xp: Math.floor(Math.random() * 5000),
          status: Math.random() > 0.1 ? "ACTIVE" : "BANNED",
          badges: {
            connect: badges.slice(0, Math.floor(Math.random() * 3)).map(b => ({ id: b.id }))
          }
        }
      })
    )
  );
  console.log(`Seeded 2 admins and ${users.length} standard users.`);

  // 4. Seed Provinces
  const provincesData = [
    {
      name: "DKI Jakarta",
      region: "Jawa",
      coordinates: "-6.2088, 106.8456",
      threatLevel: "CRITICAL",
      ecosystems: ["Urban", "Pesisir"],
      species: ["Elang Bondol", "Salak Condet"],
      color: "from-blue-400 to-indigo-500",
      description: "Pusat urban dengan tantangan polusi berat dan ancaman tenggelam."
    },
    {
      name: "Kalimantan Timur",
      region: "Kalimantan",
      coordinates: "0.5022, 116.4993",
      threatLevel: "HIGH",
      ecosystems: ["Hutan Hujan Tropis", "Sungai"],
      species: ["Pesut Mahakam", "Orangutan"],
      color: "from-emerald-400 to-green-600",
      description: "Kaya akan keanekaragaman tapi terancam deforestasi."
    },
    {
      name: "Papua Barat",
      region: "Papua",
      coordinates: "-1.3361, 133.1747",
      threatLevel: "LOW",
      ecosystems: ["Terumbu Karang", "Hutan Tropis"],
      species: ["Burung Cenderawasih", "Hiu Paus"],
      color: "from-teal-400 to-cyan-500",
      description: "Surga biodiversitas nusantara yang masih asri."
    }
  ];

  const provinces = await Promise.all(
    provincesData.map(p => prisma.province.create({ data: p }))
  );
  console.log(`Seeded ${provinces.length} provinces.`);

  // 5. Seed Missions
  const missions = await Promise.all([
    prisma.mission.create({
      data: {
        title: "Pilah Sampah Yuk!",
        description: "Pelajari cara memilah sampah yang benar agar bisa didaur ulang.",
        type: "DRAG_DROP",
        difficulty: "EASY",
        status: "ACTIVE",
        xpReward: 120,
        category: "WASTE",
        provinceId: provinces[0].id,
        badgeRewardId: badges[1].id
      }
    }),
    prisma.mission.create({
      data: {
        title: "Kenali Spesies Terancam",
        description: "Uji pengetahuanmu tentang spesies terancam punah.",
        type: "QUIZ",
        difficulty: "MEDIUM",
        status: "ACTIVE",
        xpReward: 150,
        category: "BIODIVERSITY",
        provinceId: provinces[1].id,
        badgeRewardId: badges[2].id
      }
    }),
    prisma.mission.create({
      data: {
        title: "Pulihkan Mangrove",
        description: "Simulasi reboisasi hutan mangrove di garis pantai.",
        type: "SIMULATION",
        difficulty: "MEDIUM",
        status: "ACTIVE",
        xpReward: 180,
        category: "COASTAL",
        provinceId: provinces[2].id,
        badgeRewardId: badges[3].id
      }
    })
  ]);
  console.log(`Seeded ${missions.length} missions.`);

  // 6. Seed Mission Completions
  let completionsCount = 0;
  for (const user of users) {
    // Each user does 1-3 random missions
    const numMissions = Math.floor(Math.random() * 3) + 1;
    const shuffledMissions = [...missions].sort(() => 0.5 - Math.random());
    
    for (let i = 0; i < numMissions; i++) {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - Math.floor(Math.random() * 30));
      
      await prisma.missionCompletion.create({
        data: {
          userId: user.id,
          missionId: shuffledMissions[i].id,
          xpEarned: shuffledMissions[i].xpReward,
          completedAt: pastDate
        }
      });
      completionsCount++;
    }
  }
  console.log(`Seeded ${completionsCount} mission completions for analytics.`);
  
  console.log("Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
