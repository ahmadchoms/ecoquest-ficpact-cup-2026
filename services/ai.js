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

export const generateQuizQuestions = async (
  topic = "Indonesian wildlife",
  count = 5,
) => {
  if (!genAI) return null;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const prompt = `Buat ${count} soal pilihan ganda tentang ${topic} dalam Bahasa Indonesia.
                    Semua pertanyaan WAJIB berdasarkan fakta ilmiah atau historis yang benar dan dapat diverifikasi.
                    Jangan membuat asumsi, jangan mengarang lokasi, dan jangan membuat fakta baru.
                    Jika informasi tidak valid, jangan gunakan.

                    Format output harus berupa array JSON valid dengan struktur:
                    "question" (string),
                    "options" (array 4 string),
                    "correctAnswer" (angka 0-3),
                    "explanation" (string singkat berbasis fakta).

                    Hanya satu jawaban benar.
                    Keluarkan hanya JSON mentah tanpa teks tambahan.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Clean up if the model adds markdown ticks despite instructions
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
