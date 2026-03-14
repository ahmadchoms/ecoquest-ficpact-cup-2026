import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
let genAI = null;

if (API_KEY) {
  genAI = new GoogleGenerativeAI(API_KEY);
} else {
  console.warn(
    "Gemini API Key is missing! AI features will use fallback content.",
  );
}

// Fungsi untuk fetch spesies dari GBIF berdasarkan provinsi
export const fetchProvinceSpecies = async (provinceName) => {
  try {
    const safeProvinceName = encodeURIComponent(provinceName);
    const url = `https://api.gbif.org/v1/occurrence/search?country=ID&stateProvince=${safeProvinceName}&limit=100`;

    const response = await fetch(url);
    if (!response.ok) throw new Error("GBIF API Error");
    
    const data = await response.json();

    // Extract & clean species data
    const rawSpeciesList = data.results
      .filter(
        (item) =>
          item.species &&
          (item.kingdom === "Animalia" || item.kingdom === "Plantae"),
      )
      .map((item) => ({
        scientificName: item.species,
        kingdom: item.kingdom,
        province: item.stateProvince,
      }));

    // Remove duplicates
    const uniqueSpecies = Array.from(
      new Set(rawSpeciesList.map((s) => s.scientificName)),
    ).map((scientificName) => {
      return rawSpeciesList.find((s) => s.scientificName === scientificName);
    });

    return uniqueSpecies.slice(0, 5);
  } catch (error) {
    console.error("Gagal mengambil data dari GBIF:", error);
    return null;
  }
};

// Fungsi untuk mendapatkan nama Indonesia dari Wikidata/Wikipedia
export const getIndonesianName = async (scientificName) => {
  try {
    // Search di Wikidata untuk entity dengan nama ilmiah
    const response = await fetch(
      `https://www.wikidata.org/w/api.php?action=wbsearchentities&search=${encodeURIComponent(
        scientificName,
      )}&language=id&type=item&format=json`,
    );
    const data = await response.json();

    if (data.search && data.search.length > 0) {
      const entityId = data.search[0].id;

      // Get label & description dalam bahasa Indonesia
      const detailResponse = await fetch(
        `https://www.wikidata.org/w/api.php?action=wbgetentities&ids=${entityId}&props=labels|descriptions&languages=id|en&format=json`,
      );
      const detailData = await detailResponse.json();
      const entity = detailData.entities[entityId];

      // Prioritas: Indonesian label > English label > scientific name
      const label =
        entity.labels?.id?.value ||
        entity.labels?.en?.value ||
        scientificName;
      const description =
        entity.descriptions?.id?.value ||
        entity.descriptions?.en?.value ||
        "";

      return { indonesianName: label, description };
    }

    return { indonesianName: scientificName, description: "" };
  } catch (error) {
    console.error("Error fetching Indonesian name:", error);
    return { indonesianName: scientificName, description: "" };
  }
};

// Fungsi untuk enrich spesies dengan nama Indonesia
export const enrichSpeciesWithIndonesianNames = async (speciesList) => {
  if (!speciesList || speciesList.length === 0) return [];

  const enrichedSpecies = await Promise.all(
    speciesList.map(async (species) => {
      try {
        // Use server API endpoint to avoid CORS issues
        const response = await fetch('/api/species/get-indonesian-name', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ scientificName: species.scientificName }),
        });
        
        if (!response.ok) {
          return {
            ...species,
            indonesianName: species.scientificName,
            description: '',
          };
        }
        
        const { indonesianName, description } = await response.json();
        return {
          ...species,
          indonesianName,
          description,
        };
      } catch (error) {
        console.error(`Error enriching species ${species.scientificName}:`, error);
        return {
          ...species,
          indonesianName: species.scientificName,
          description: '',
        };
      }
    }),
  );

  return enrichedSpecies;
};

export const generateQuizQuestions = async (
  topic = "Indonesian wildlife",
  count = 5,
  speciesList = null,
) => {
  if (!genAI) return null;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // Build context dari spesies yang diberikan
    let speciesContext = "";
    if (speciesList && speciesList.length > 0) {
      speciesContext = speciesList
        .map(
          (s) =>
            `- ${s.indonesianName} (${s.scientificName})${s.description ? ": " + s.description : ""}`,
        )
        .join("\n");
    }

    const prompt = `Buat ${count} soal pilihan ganda tentang ${topic} dalam Bahasa Indonesia.
${
  speciesContext
    ? `Gunakan spesies/flora-fauna berikut sebagai basis (WAJIB ada minimal 3 dari daftar ini):\n${speciesContext}\n`
    : ""
}
Semua pertanyaan WAJIB berdasarkan fakta ilmiah atau historis yang benar dan dapat diverifikasi.
Jangan membuat asumsi, jangan mengarang lokasi, dan jangan membuat fakta baru.
Setiap soal HARUS menyebutkan nama Indonesia (bukan hanya nama ilmiah/Latin).
Prioritaskan pertanyaan tentang konservasi, habitat, dan peran ekologi.

Format output harus berupa array JSON valid dengan struktur:
{
  "question": "string pertanyaan dalam Bahasa Indonesia",
  "options": ["pilihan 1", "pilihan 2", "pilihan 3", "pilihan 4"],
  "correctAnswer": angka 0-3,
  "explanation": "penjelasan singkat berbasis fakta",
  "species": "Nama Indonesia (nama ilmiah) 🦁"
}

Hanya satu jawaban benar per soal.
Keluarkan hanya JSON array mentah tanpa teks tambahan.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Clean up markdown ticks if present
    const jsonStr = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("AI Generation Error:", error);
    return null;
  }
};

export const getMissionTip = async (missionContext) => {
  if (!genAI) return "Jaga lingkunganmu untuk masa depan yang lebih baik!";

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const prompt = `Give a short, inspiring, one-sentence tip about ${missionContext} in Indonesian.`;

    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    return "Setiap langkah kecil membawa perubahan besar.";
  }
};
