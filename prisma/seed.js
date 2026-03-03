const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("Starting seed process...");

  await prisma.missionCompletion.deleteMany();
  await prisma.mission.deleteMany();
  await prisma.badge.deleteMany();
  await prisma.user.deleteMany();
  await prisma.province.deleteMany();
  console.log("Cleared existing data.");

  const badges = await Promise.all([
    prisma.badge.create({
      data: {
        name: "Carbon Conscious",
        description: "Berhasil menghitung jejak karbon pribadimu.",
        icon: "🌡️",
        rarity: "BRONZE",
        category: "CLIMATE",
      },
    }),
    prisma.badge.create({
      data: {
        name: "Waste Warrior",
        description:
          "Maestro pemilah sampah — tahu bedanya organik, anorganik, dan B3.",
        icon: "♻️",
        rarity: "SILVER",
        category: "WASTE",
      },
    }),
    prisma.badge.create({
      data: {
        name: "Species Guardian",
        description: "Penjaga satwa liar langka Indonesia.",
        icon: "🦏",
        rarity: "GOLD",
        category: "BIODIVERSITY",
      },
    }),
    prisma.badge.create({
      data: {
        name: "Mangrove Hero",
        description: "Berhasil merestorasi pesisir pantai.",
        icon: "🌊",
        rarity: "PLATINUM",
        category: "COASTAL",
      },
    }),
    prisma.badge.create({
      data: {
        name: "Indonesian Hero",
        description: "Pahlawan Nusantara sejati.",
        icon: "🇮🇩",
        rarity: "DIAMOND",
        category: "OCEAN",
      },
    }),
  ]);
  console.log(`Seeded ${badges.length} badges.`);

  const passwordHash = await bcrypt.hash("password123", 10);

  const superAdmin = await prisma.user.create({
    data: {
      name: "Super Admin",
      username: "superadmin",
      email: "admin@ecoquest.id",
      password: passwordHash,
      role: "ADMIN",
      level: 99,
      xp: 150000,
      points: 50000,
      badges: {
        connect: [{ id: badges[4].id }],
      },
    },
  });

  const regionalAdmin = await prisma.user.create({
    data: {
      name: "Admin Jawa Barat",
      username: "admin_jabar",
      email: "jabar@ecoquest.id",
      password: passwordHash,
      role: "ADMIN",
      level: 50,
      xp: 45000,
      points: 15000,
    },
  });

  const users = [];
  for (let i = 0; i < 18; i++) {
    const newUser = await prisma.user.create({
      data: {
        name: `Eco Explorer ${i + 1}`,
        username: `eco_explorer_${i + 1}`,
        email: `user${i + 1}@example.com`,
        password: passwordHash,
        role: "USER",
        level: Math.floor(Math.random() * 20) + 1,
        xp: Math.floor(Math.random() * 5000),
        points: Math.floor(Math.random() * 1000),
        status: Math.random() > 0.1 ? "ACTIVE" : "BANNED",
        badges: {
          connect: badges
            .slice(0, Math.floor(Math.random() * 3))
            .map((b) => ({ id: b.id })),
        },
      },
    });
    users.push(newUser);
  }
  console.log(`Seeded 2 admins and ${users.length} standard users.`);

  const provincesData = [
    // --- PULAU SUMATERA ---
    {
      name: "Nanggroe Aceh Darussalam",
      region: "Sumatera",
      threatLevel: "MEDIUM",
      ecosystems: ["Hutan Hujan Tropis", "Pegunungan", "Pesisir"],
      species: ["Harimau Sumatera", "Orangutan Sumatera", "Bunga Jeumpa"],
      description:
        "Rumah bagi Taman Nasional Gunung Leuser yang sangat kaya akan biodiversitas.",
      funFact:
        "Satu-satunya tempat di dunia di mana harimau, gajah, badak, dan orangutan hidup berdampingan.",
    },
    {
      name: "Sumatera Utara",
      region: "Sumatera",
      threatLevel: "HARD",
      ecosystems: ["Danau", "Hutan Tropis", "Pegunungan"],
      species: ["Orangutan Tapanuli", "Harimau Sumatera", "Bunga Kenanga"],
      description:
        "Terkenal dengan Danau Toba, namun memiliki ancaman deforestasi yang tinggi.",
      funFact:
        "Orangutan Tapanuli adalah spesies kera besar paling terancam punah di dunia.",
    },
    {
      name: "Sumatera Barat",
      region: "Sumatera",
      threatLevel: "MEDIUM",
      ecosystems: ["Hutan Tropis", "Lembah", "Pesisir"],
      species: ["Harimau Sumatera", "Kuau Raja", "Bunga Rafflesia Arnoldii"],
      description:
        "Kawasan dengan perbukitan hijau dan lembah curam seperti Ngarai Sianok.",
      funFact:
        "Rafflesia Arnoldii, bunga terbesar di dunia, sering mekar di kawasan ini.",
    },
    {
      name: "Riau",
      region: "Sumatera",
      threatLevel: "HARD",
      ecosystems: ["Hutan Gambut", "Hutan Tropis", "Sungai"],
      species: ["Harimau Sumatera", "Gajah Sumatera", "Ikan Selais"],
      description:
        "Wilayah yang kaya minyak namun menghadapi krisis kebakaran hutan gambut.",
      funFact:
        "Memiliki salah satu cagar biosfer terbesar di Indonesia, yaitu Giam Siak Kecil.",
    },
    {
      name: "Kepulauan Riau",
      region: "Sumatera",
      threatLevel: "MEDIUM",
      ecosystems: ["Terumbu Karang", "Pesisir", "Hutan Bakau"],
      species: ["Penyu Sisik", "Dugong", "Burung Serindit"],
      description:
        "Gugusan kepulauan dengan potensi laut yang luar biasa namun rentan pencemaran laut.",
      funFact: "Lebih dari 95% wilayah Kepulauan Riau adalah lautan.",
    },
    {
      name: "Jambi",
      region: "Sumatera",
      threatLevel: "HARD",
      ecosystems: ["Hutan Dataran Rendah", "Hutan Gambut", "Pegunungan"],
      species: ["Harimau Sumatera", "Gajah Sumatera", "Burung Rangkong"],
      description:
        "Memiliki Taman Nasional Kerinci Seblat dan Taman Nasional Bukit Duabelas.",
      funFact:
        "Gunung Kerinci di Jambi adalah gunung berapi tertinggi di Indonesia.",
    },
    {
      name: "Sumatera Selatan",
      region: "Sumatera",
      threatLevel: "HARD",
      ecosystems: ["Hutan Rawa", "Sungai", "Hutan Tropis"],
      species: ["Harimau Sumatera", "Ikan Belida", "Burung Belibis"],
      description:
        "Dikenal dengan Sungai Musi, namun lahan basahnya banyak dikonversi menjadi perkebunan.",
      funFact:
        "Ikan Belida dulunya adalah bahan utama pempek sebelum menjadi spesies dilindungi.",
    },
    {
      name: "Bangka Belitung",
      region: "Sumatera",
      threatLevel: "HARD",
      ecosystems: ["Pesisir", "Hutan Tropis", "Pulau Kecil"],
      species: ["Mentilin", "Penyu Hijau", "Burung Pelatuk"],
      description:
        "Kepulauan indah yang ekosistem daratnya terancam oleh masifnya penambangan timah.",
      funFact:
        "Mentilin, primata bermata besar dari daerah ini, adalah inspirasi karakter Yoda di Star Wars.",
    },
    {
      name: "Bengkulu",
      region: "Sumatera",
      threatLevel: "MEDIUM",
      ecosystems: ["Hutan Tropis", "Pesisir"],
      species: ["Beruang Madu", "Bunga Rafflesia Arnoldii", "Bunga Kibut"],
      description:
        "Garis pantai yang panjang dan habitat utama bagi bunga-bunga raksasa langka.",
      funFact:
        "Bunga Kibut (Amorphophallus titanum) tertinggi di dunia sering ditemukan di Bengkulu.",
    },
    {
      name: "Lampung",
      region: "Sumatera",
      threatLevel: "MEDIUM",
      ecosystems: ["Hutan Hujan Tropis", "Savana", "Pesisir"],
      species: ["Gajah Sumatera", "Badak Sumatera", "Harimau Sumatera"],
      description:
        "Gerbang Pulau Sumatera dan rumah bagi Taman Nasional Way Kambas.",
      funFact:
        "Taman Nasional Way Kambas adalah sekolah dan pusat konservasi gajah tertua di Indonesia.",
    },

    // --- PULAU JAWA ---
    {
      name: "DKI Jakarta",
      region: "Jawa",
      threatLevel: "HARD",
      ecosystems: ["Urban", "Pesisir", "Hutan Bakau"],
      species: ["Elang Bondol", "Salak Condet", "Kucing Hutan"],
      description:
        "Pusat urban dengan tantangan polusi berat dan ancaman tenggelam akibat subsidensi tanah.",
      funFact: "Maskot Jakarta sebenarnya adalah Elang Bondol, bukan Monas.",
    },
    {
      name: "Banten",
      region: "Jawa",
      threatLevel: "MEDIUM",
      ecosystems: ["Pesisir", "Hutan Hujan Dataran Rendah", "Pegunungan"],
      species: ["Badak Jawa", "Owa Jawa", "Penyu Belimbing"],
      description:
        "Ujung barat Pulau Jawa, memiliki Taman Nasional Ujung Kulon yang sangat dijaga ketat.",
      funFact:
        "Ujung Kulon adalah benteng pertahanan terakhir bagi Badak Jawa yang terancam punah.",
    },
    {
      name: "Jawa Barat",
      region: "Jawa",
      threatLevel: "HARD",
      ecosystems: ["Pegunungan", "Hutan Hujan", "Urban"],
      species: ["Macan Tutul Jawa", "Owa Jawa", "Surili"],
      description:
        "Kawasan padat penduduk dengan laju alih fungsi lahan hijau yang sangat cepat.",
      funFact:
        "Jawa Barat memiliki paling banyak gunung berapi aktif di Indonesia.",
    },
    {
      name: "Jawa Tengah",
      region: "Jawa",
      threatLevel: "MEDIUM",
      ecosystems: ["Pegunungan", "Pesisir", "Karst"],
      species: ["Elang Jawa", "Banteng", "Kijang Muncak"],
      description:
        "Memiliki keanekaragaman lanskap dari gunung berapi aktif hingga patahan karst purba.",
      funFact:
        "Elang Jawa adalah satwa yang menjadi inspirasi lambang negara Garuda Pancasila.",
    },
    {
      name: "DI Yogyakarta",
      region: "Jawa",
      threatLevel: "MEDIUM",
      ecosystems: ["Gunung Berapi", "Pesisir", "Karst"],
      species: ["Burung Kepodang", "Penyu Hijau", "Monyet Ekor Panjang"],
      description:
        "Kawasan berbudaya tinggi yang dibayangi aktivitas Gunung Merapi dan abrasi pantai selatan.",
      funFact:
        "Gumuk Pasir Parangkusumo di DIY adalah satu dari sedikit gurun pasir pesisir di Asia Tenggara.",
    },
    {
      name: "Jawa Timur",
      region: "Jawa",
      threatLevel: "HARD",
      ecosystems: ["Savana", "Pegunungan", "Pesisir"],
      species: ["Banteng Jawa", "Merak Hijau", "Macan Tutul Jawa"],
      description:
        "Kaya akan taman nasional besar seperti Baluran, Bromo Tengger Semeru, dan Alas Purwo.",
      funFact:
        "Taman Nasional Baluran sering dijuluki sebagai 'Africa van Java' karena padang savananya yang luas.",
    },

    // --- BALI & NUSA TENGGARA ---
    {
      name: "Bali",
      region: "Bali & Nusa Tenggara",
      threatLevel: "MEDIUM",
      ecosystems: ["Pesisir", "Terumbu Karang", "Hutan Hujan"],
      species: ["Jalak Bali", "Pari Manta", "Monyet Ekor Panjang"],
      description:
        "Pulau Dewata dengan keindahan alam yang kini mulai terancam oleh krisis sampah plastik.",
      funFact:
        "Jalak Bali adalah burung endemik yang hanya bisa ditemukan di bagian barat Pulau Bali.",
    },
    {
      name: "Nusa Tenggara Barat",
      region: "Bali & Nusa Tenggara",
      threatLevel: "MEDIUM",
      ecosystems: ["Savana", "Hutan Musim", "Terumbu Karang"],
      species: ["Rusa Timor", "Kakatua Kecil Jambul Kuning", "Hiu Paus"],
      description:
        "Didominasi oleh Gunung Rinjani dan sabana luas dengan curah hujan yang lebih rendah.",
      funFact:
        "Gunung Tambora di NTB pernah meletus pada 1815, mengubah iklim global hingga Eropa mengalami 'Tahun Tanpa Musim Panas'.",
    },
    {
      name: "Nusa Tenggara Timur",
      region: "Bali & Nusa Tenggara",
      threatLevel: "MEDIUM",
      ecosystems: ["Savana", "Pesisir", "Terumbu Karang"],
      species: ["Komodo", "Pari Manta Ocehan", "Burung Kakatua"],
      description:
        "Provinsi dengan ekosistem kering yang unik dan menjadi satu-satunya habitat asli Komodo.",
      funFact:
        "Taman Nasional Komodo diakui sebagai salah satu dari 7 Keajaiban Alam Dunia Baru.",
    },

    // --- KALIMANTAN ---
    {
      name: "Kalimantan Barat",
      region: "Kalimantan",
      threatLevel: "HARD",
      ecosystems: ["Hutan Rawa Gambut", "Sungai", "Hutan Tropis"],
      species: ["Orangutan Kalimantan", "Bekantan", "Burung Enggang"],
      description:
        "Dijuluki Provinsi Seribu Sungai, namun menghadapi ancaman masif dari deforestasi.",
      funFact:
        "Kalimantan Barat dilewati tepat oleh garis Khatulistiwa, dengan monumennya di Pontianak.",
    },
    {
      name: "Kalimantan Tengah",
      region: "Kalimantan",
      threatLevel: "HARD",
      ecosystems: ["Hutan Rawa Gambut", "Hutan Tropis"],
      species: ["Orangutan Kalimantan", "Owa Kalimantan", "Beruang Madu"],
      description:
        "Kawasan dengan paru-paru dunia seperti Taman Nasional Sebangau dan Tanjung Puting.",
      funFact: "Tanjung Puting adalah ibukota perlindungan orangutan dunia.",
    },
    {
      name: "Kalimantan Selatan",
      region: "Kalimantan",
      threatLevel: "HARD",
      ecosystems: ["Sungai", "Hutan Rawa", "Pesisir"],
      species: ["Bekantan", "Kucing Merah", "Burung Rangkong"],
      description:
        "Provinsi yang sangat bergantung pada sungai, namun terancam oleh penambangan batu bara terbuka.",
      funFact:
        "Bekantan (monyet berhidung panjang) adalah satwa maskot resmi provinsi ini.",
    },
    {
      name: "Kalimantan Timur",
      region: "Kalimantan",
      threatLevel: "MEDIUM",
      ecosystems: ["Hutan Hujan Tropis", "Sungai", "Karst"],
      species: ["Pesut Mahakam", "Orangutan", "Beruang Madu"],
      description:
        "Kaya akan keanekaragaman, lokasi Ibukota Nusantara, menyeimbangkan pembangunan dan alam.",
      funFact:
        "Pesut Mahakam adalah mamalia air tawar langka yang tersisa kurang dari 100 ekor di alam liar.",
    },
    {
      name: "Kalimantan Utara",
      region: "Kalimantan",
      threatLevel: "EASY",
      ecosystems: ["Hutan Tropis Pegunungan", "Hutan Bakau", "Sungai"],
      species: ["Gajah Kalimantan", "Orangutan", "Rangkong Badak"],
      description:
        "Provinsi termuda di Kalimantan dengan ekosistem hutan perbatasan yang masih perawan.",
      funFact:
        "Merupakan rumah bagi spesies gajah terkecil di dunia (Gajah Kerdil Borneo).",
    },

    // --- SULAWESI ---
    {
      name: "Sulawesi Utara",
      region: "Sulawesi",
      threatLevel: "MEDIUM",
      ecosystems: ["Terumbu Karang", "Pegunungan Vulkanik"],
      species: ["Tarsius", "Yaki (Monyet Hitam Sulawesi)", "Burung Maleo"],
      description:
        "Surga bawah laut seperti Bunaken, berbatasan langsung dengan lautan Pasifik.",
      funFact:
        "Tarsius adalah primata terkecil di dunia yang bisa memutar kepalanya 180 derajat.",
    },
    {
      name: "Gorontalo",
      region: "Sulawesi",
      threatLevel: "EASY",
      ecosystems: ["Pesisir", "Hutan Tropis"],
      species: ["Hiu Paus", "Burung Maleo", "Babi Rusa"],
      description:
        "Memiliki ekosistem pesisir yang kaya dan pegunungan hijau yang membentang luas.",
      funFact:
        "Gorontalo terkenal sebagai titik kemunculan sekawanan hiu paus di Desa Botubarani.",
    },
    {
      name: "Sulawesi Tengah",
      region: "Sulawesi",
      threatLevel: "MEDIUM",
      ecosystems: ["Hutan Hujan Pegunungan", "Danau", "Terumbu Karang"],
      species: ["Anoa", "Babi Rusa", "Tarsius"],
      description:
        "Kawasan dengan Taman Nasional Lore Lindu yang sangat kaya flora endemik Wallacea.",
      funFact:
        "Garis Wallace, yang memisahkan fauna Asia dan Australasia, membelah wilayah perairan di sekitar Sulawesi.",
    },
    {
      name: "Sulawesi Barat",
      region: "Sulawesi",
      threatLevel: "MEDIUM",
      ecosystems: ["Hutan Tropis", "Pesisir"],
      species: ["Burung Mandar Dengkur", "Anoa", "Rusa Timor"],
      description:
        "Kawasan agraris yang alamnya masih sangat alami namun rentan pembalakan liar.",
      funFact:
        "Provinsi ini terkenal dengan tradisi pelaut ulung dan perahu Sandeq yang ramah lingkungan.",
    },
    {
      name: "Sulawesi Selatan",
      region: "Sulawesi",
      threatLevel: "HARD",
      ecosystems: ["Karst", "Pegunungan", "Pesisir", "Terumbu Karang"],
      species: ["Kupu-kupu Bantimurung", "Anoa", "Penyu Sisik"],
      description:
        "Kawasan karst terbesar kedua di dunia, namun memiliki tantangan reklamasi dan polusi urban.",
      funFact:
        "Taman Nasional Bantimurung dijuluki 'The Kingdom of Butterfly' oleh Alfred Russel Wallace.",
    },
    {
      name: "Sulawesi Tenggara",
      region: "Sulawesi",
      threatLevel: "HARD",
      ecosystems: ["Terumbu Karang", "Hutan Tropis", "Pesisir"],
      species: ["Anoa", "Burung Kakatua", "Penyu Hijau"],
      description:
        "Memiliki Wakatobi sebagai pusat segitiga karang dunia, terancam oleh tambang nikel masif.",
      funFact:
        "Taman Nasional Wakatobi memiliki 750 dari 850 spesies koral yang ada di seluruh dunia.",
    },

    // --- MALUKU ---
    {
      name: "Maluku",
      region: "Maluku",
      threatLevel: "MEDIUM",
      ecosystems: ["Terumbu Karang", "Laut Dalam", "Pulau Tropis"],
      species: ["Burung Nuri Maluku", "Kakatua Seram", "Dugong"],
      description:
        "Provinsi Kepulauan Rempah yang memiliki kekayaan laut endemik yang sangat tinggi.",
      funFact:
        "Pala dan Cengkeh yang memicu era penjelajahan bangsa Eropa berasal dari pulau-pulau di sini.",
    },
    {
      name: "Maluku Utara",
      region: "Maluku",
      threatLevel: "HARD",
      ecosystems: ["Hutan Tropis", "Pesisir", "Gunung Berapi"],
      species: ["Bidadari Halmahera", "Kuskus", "Kupu-kupu Ornithoptera"],
      description:
        "Lanskap vulkanik subur yang kini menjadi pusat ekplorasi tambang nikel besar-besaran.",
      funFact:
        "Burung Bidadari Halmahera adalah salah satu burung of paradise yang ditemukan oleh Alfred Wallace.",
    },

    // --- PAPUA ---
    {
      name: "Papua",
      region: "Papua",
      threatLevel: "MEDIUM",
      ecosystems: ["Hutan Hujan Tropis", "Rawa", "Pesisir"],
      species: ["Burung Cenderawasih", "Kanguru Pohon", "Kasuari"],
      description:
        "Wilayah dengan hutan perawan terbesar di Indonesia yang menyimpan sejuta misteri biologi.",
      funFact:
        "Hutan Papua menyumbang hampir setengah dari keanekaragaman hayati seluruh Indonesia.",
    },
    {
      name: "Papua Barat",
      region: "Papua",
      threatLevel: "EASY",
      ecosystems: ["Terumbu Karang", "Hutan Tropis", "Karst"],
      species: ["Burung Cenderawasih Merah", "Hiu Paus", "Penyu Belimbing"],
      description:
        "Kawasan dengan kebijakan konservasi laut yang kuat dan komitmen provinsi berkelanjutan.",
      funFact:
        "Taman Nasional Teluk Cenderawasih adalah taman nasional laut terluas di Indonesia.",
    },
    {
      name: "Papua Selatan",
      region: "Papua",
      threatLevel: "MEDIUM",
      ecosystems: ["Savana", "Rawa", "Hutan Musim"],
      species: ["Burung Pelikan", "Kasuari", "Kanguru Sahul"],
      description:
        "Dikenal dengan Taman Nasional Wasur yang menjadi habitat bagi burung migran dari Australia.",
      funFact:
        "Lanskap Papua Selatan lebih mirip daratan utara Australia dibanding dengan sisa kepulauan Indonesia.",
    },
    {
      name: "Papua Tengah",
      region: "Papua",
      threatLevel: "HARD",
      ecosystems: ["Pegunungan Salju", "Hutan Tropis Pegunungan"],
      species: ["Dingiso", "Burung Cenderawasih", "Echidna"],
      description:
        "Rumah bagi Puncak Jaya dan area tambang emas terbesar di dunia.",
      funFact:
        "Satu-satunya tempat di daerah tropis Asia Tenggara di mana kamu bisa menemukan gletser salju.",
    },
    {
      name: "Papua Pegunungan",
      region: "Papua",
      threatLevel: "EASY",
      ecosystems: ["Lembah Pegunungan", "Hutan Lumut"],
      species: [
        "Kanguru Pohon Mantled",
        "Kuskus Pegunungan",
        "Burung Penghisap Madu",
      ],
      description:
        "Satu-satunya provinsi di Indonesia yang tidak memiliki garis pantai (Landlocked).",
      funFact:
        "Lembah Baliem di provinsi ini merupakan salah satu lembah budaya paling menakjubkan di dunia.",
    },
    {
      name: "Papua Barat Daya",
      region: "Papua",
      threatLevel: "EASY",
      ecosystems: ["Terumbu Karang", "Kepulauan Karst", "Hutan Tropis"],
      species: ["Pari Manta", "Burung Cenderawasih Botak", "Hiu Karpet"],
      description:
        "Gerbang utama menuju Raja Ampat, pusat segitiga terumbu karang dunia.",
      funFact:
        "Raja Ampat adalah rumah bagi 75% spesies karang laut dunia dan sering dijuluki 'The Last Paradise on Earth'.",
    },
  ];

  const provinces = [];
  for (const p of provincesData) {
    const province = await prisma.province.create({ data: p });
    provinces.push(province);
  }
  console.log(`Seeded ${provinces.length} provinces.`);

  const missionsData = [
    {
      title: "Pilah Sampah Yuk!",
      description:
        "Pelajari cara memilah sampah yang benar agar bisa didaur ulang.",
      type: "DRAG_DROP",
      difficulty: "EASY",
      status: "ACTIVE",
      xpReward: 120,
      pointsReward: 50,
      timeEstimate: "5 Menit",
      category: "WASTE",
      provinceId: provinces[0].id,
      badgeRewardId: badges[1].id,
    },
    {
      title: "Kenali Spesies Terancam",
      description: "Uji pengetahuanmu tentang spesies terancam punah.",
      type: "QUIZ",
      difficulty: "MEDIUM",
      status: "ACTIVE",
      xpReward: 150,
      pointsReward: 75,
      timeEstimate: "10 Menit",
      category: "BIODIVERSITY",
      provinceId: provinces[1].id,
      badgeRewardId: badges[2].id,
    },
    {
      title: "Pulihkan Mangrove",
      description: "Simulasi reboisasi hutan mangrove di garis pantai.",
      type: "SIMULATION",
      difficulty: "MEDIUM",
      status: "ACTIVE",
      xpReward: 180,
      pointsReward: 100,
      timeEstimate: "15 Menit",
      category: "COASTAL",
      provinceId: provinces[2].id,
      badgeRewardId: badges[3].id,
    },
  ];

  const missions = [];
  for (const missionPayload of missionsData) {
    const newMission = await prisma.mission.create({
      data: missionPayload,
    });

    missions.push(newMission);
  }

  console.log(`Seeded ${missions.length} missions.`);

  let completionsCount = 0;
  for (const user of users) {
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
          completedAt: pastDate,
        },
      });
      completionsCount++;
    }
  }
  console.log(`Seeded ${completionsCount} mission completions for analytics.`);

  console.log("✅ Database ter-seed dengan sempurna sesuai skema terbaru!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
