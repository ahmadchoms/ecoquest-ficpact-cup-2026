# Penjelasan Lengkap Project: EcoQuest - FIPTCUP 2026

Berikut adalah rangkuman materi lengkap mengenai project EcoQuest yang dapat langsung kamu gunakan sebagai bahan presentasi (PPT) untuk lomba FIPTCUP 2026. File ini memuat latar belakang, fitur, daftar misi, alur aplikasi, serta keunggulan teknologi.

---

## 1. Pendahuluan (Project Overview)
- **Nama Project:** EcoQuest
- **Kompetisi:** FIPTCUP 2026
- **Deskripsi Singkat:** EcoQuest adalah platform edukasi lingkungan interaktif berbasis web (gamifikasi) yang dikhususkan untuk membedah masalah lingkungan di Indonesia. 
- **Goal / Tujuan:** Mengubah kesadaran lingkungan menjadi aksi nyata dengan cara yang menyenangkan, melalui misi-misi interaktif, pembelajaran ekosistem 34 provinsi, dan kompetisi berbasis skor.
- **Target Pengguna:** Pelajar, pendidik lingkungan, dan masyarakat pemuda usia 13+ di seluruh Indonesia.

*(💡 Ide Slide PPT: Tampilkan Judul Logo EcoQuest, Tagline "Gamified Ecosystem Education", dan poin-poin tujuan utamanya).*

---

## 2. Fitur-Fitur Utama (Core Features)

EcoQuest bukan website edukasi biasa, melainkan platform "Belajar Sambil Bermain". Fitur unggulannya meliputi:
1. **Peta Interaktif 34 Provinsi (Interactive Map):** Peta Indonesia responsif. Setiap provinsi menyimpan rahasia seperti: tingkat ancaman ekosistem, hewan endemik wilayah tersebut, fakta unik, dan misi khusus daerah setempat.
2. **Sistem Gamifikasi (XP, Poin & Badge):** Pengguna bertumbuh (naik level) seiring misi yang diselesaikan. Pengguna dapat mengoleksi Badge (Lencana langka) seperti *Mangrove Hero* atau *Carbon Conscious*.
3. **Visualisasi 3D Penuh Pijar (Immersive UI):** Website dilengkapi elemen Bumi 3D interaktif (EcoGlobe) dan layar perayaan piala 3D (Trophy Scene) saat naik level.
4. **Impact Dashboard & Profile:** Layar untuk melacak secara visual berapa dampak baik yang sudah dikontribusikan (seperti akumulasi jumlah sampah yang divirtualkan dan dilacak).
5. **Leaderboard Global:** Papan peringkat yang memicu persaingan positif antar pengguna di seluruh Indonesia untuk menjadi "Eco Guardian" terbaik.

*(💡 Ide Slide PPT: Tampilkan highlight fitur menggunakan screenshot dari bagian Peta Interaktif dan Leaderboard).*

---

## 3. Daftar Misi Lingkungan (Missions List)
Misi adalah nyawa dari aplikasi ini. Setiap misi didasarkan pada data dan ancaman nyata di Indonesia:

1. 🌡️ **Jejak Karbon Harianmu (Kalkulator | 100 XP)**
   - *Real Input:* Rata-rata orang Indonesia hasilkan 2.3 ton CO2/tahun.
   - *Gameplay:* Menghitung emisi karbon pengguna dari gaya hidup sehari-hari dan merancang rencana pengurangannya.
2. ♻️ **Pilah Sampah Yuk! (Drag & Drop | 120 XP)**
   - *Real Input:* Indonesia hasilkan 67.8 juta ton sampah per tahun.
   - *Gameplay:* Game interaktif memisahkan sampah (Organik, Anorganik, B3) ke tong yang tepat secara cerdas.
3. 🦏 **Kenali Spesies Terancam (Quiz AI | 150 XP)**
   - *Real Input:* Edukasi status Indonesia sebagai wilayah *mega-biodiversity*.
   - *Gameplay:* Kuis pengetahuan mengenai satwa liar seperti Harimau Sumatera dan Badak Bercula Satu. Terintegrasi AI.
4. 🌊 **Pulihkan Mangrove (Simulasi | 180 XP)**
   - *Real Input:* Indonesia kehilangan 40% mangrove dalam 30 tahun (sangat kritis).
   - *Gameplay:* Simulasi menanam serta merehabilitasi area pesisir secara bertahap.
5. 💧 **Hemat Air Setiap Hari (Kalkulator | 100 XP)**
   - *Real Input:* Jutaan orang masih kekurangan air bersih.
   - *Gameplay:* Hitungan efisiensi konsumsi air harian (mandi, mencuci) dengan target penghematan.
6. 🌊 **Penyelamat Laut (Game Waktu | 150 XP)**
   - *Real Input:* Indonesia darurat sampah plastik di lautan.
   - *Gameplay:* Permainan ketangkasan waktu membersihkan sampah plastik di laut sebelum waktu habis.
7. 🚗 **EcoRoute / Smart Travel (Simulasi | 160 XP)**
   - *Real Input:* Sektor transportasi penyumbang emisi tertinggi.
   - *Gameplay:* Memilih kendaraan dan rute paling hijau dalam peta simulasi yang dinamis.

*(💡 Ide Slide PPT: Presentator menjelaskan bahwa ini bukan sekadar mini-game, melainkan "Real-World Action Simulator" untuk memberi pandangan baru ke player).*

---

## 4. Alur Penggunaan Aplikasi (User Flow)
Bagaimana user journey di EcoQuest dari awal sampai ia masuk Leaderboard:

1. **Onboarding & Autentikasi:** Pengguna masuk, melihat animasi mendarat, lalu Login/Daftar akun agar progresnya bisa tersimpan di peladen (server).
2. **Eksplorasi Wilayah (Map):** Pengguna diarahkan ke Map Indonesia 34 Provinsi. Mereka mengklik pulau/provinsi tertentu (contoh: Kalimantan Timur).
3. **Trigger Misi Lokal:** Muncul ringkasan krisis di provinsi tsb, lalu menantang user memainkan misi (misal: merawat Pesut Mahakam / Kuis Spesies).
4. **Gameplay & Kalkulasi Dinamis:** Selama main, sistem akan merekam akurasi. Reward didapat tidak selalu penuh 100%. Kemampuan perhitungan dinamis memastikan: *Jika nilai kamu 80%, XP yang didapat 80% dari total.*
5. **Perayaan 3D & Reward:** Animasi perayaan pop-up 3D ketika selesai bermain. *Badge/Lencana* Spesifik ditambahkan ke dalam Profil pengguna.
6. **Pemantauan Dashboard:** Pengguna kembali ke Profil untuk melihat level mereka perlahan naik (dari Seed ➔ Sprout ➔ Tree). Level ini dipajang di *Leaderboard* antar peserta secara global.

*(💡 Ide Slide PPT: Buat dalam format Diagram Alir (Flowchart) yang memutar dari Start ➔ Bermain ➔ Naik Level ➔ Leaderboard).*

---

## 5. Keunggulan Teknologi & Arsitektur (Tech Stack)
Bagian ini khusus untuk membuktikan kepada juri bahwa project aplikasinya dikembangkan dengan standar perangkat lunak terkemuka masa kini:

- **Frontend Terkini:** Dibangun dengan **Next.js 16 (React 19)** untuk performa secepat kilat tanpa jeda transisi (Turbopack compiler).
- **Smooth Animation & UI:** Menggunakan kombinasi **Tailwind CSS**, komponen **Framer Motion** untuk pergerakan transisi, dan **Three.js** untuk elemen interaktif 3D. Menjadikan aplikasi terlihat sangat mahal, elegan dan responsif.
- **Kecerdasan Buatan (Google AI):** Adanya integrasi *Google Generative AI* dalam backend untuk sistem validasi atau generasi kuis cerdas.
- **Keamanan Skala Industri:** State Management (aliran data *real-time*) diolah dengan bersih oleh **Zustand**, kemudian disimpan permanen ke database relasional **PostgreSQL** dengan jembatan pangkalan data **Prisma ORM**.
- **Geospasial Dinamis:** Rendering peta menggunakan **Leaflet (React-Leaflet)** dan data geografis 34 Provinsi berbasis **GeoJSON**.

---

## Saran Struktur Slide Presentasi (Pitch Deck) Lomba:
* **Slide 1:** Judul Besar "EcoQuest" & Problem Statement (Mengapa generasi tua/muda abai thd ekosistem? Karena cara belajarnya membosankan).
* **Slide 2:** The Solution (EcoQuest hadir mengemas isu lingkungan nyata ke dalam balutan gamifikasi canggih).
* **Slide 3:** Demo Core Feature (Tangkapan layar Peta Interaktif Indonesia Thematic).
* **Slide 4:** Ecosystem Missions (Penjelasan 2-3 misi unggulan seperti Kalkulator Karbon & Pemilah Sampah).
* **Slide 5:** User Retention & Gamification (Penjelasan XP System, Badge Trophy, dan Global Leaderboarding).
* **Slide 6:** Tech Stack & Innovation (Ceritakan canggihnya integrasi AI, render Maps, & 3D Web UI).
* **Slide 7:** Visi Dampak 2026 & Kesimpulan.

Selamat menyiapkan kompetisi FIPTCUP 2026! Project ini sangat solid, inovatif, dan tepat sasaran. Semangat!
