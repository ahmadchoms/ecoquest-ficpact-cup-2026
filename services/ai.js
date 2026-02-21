import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = process.env.VITE_GEMINI_API_KEY;
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
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const prompt = `Generate ${count} multiple-choice quiz questions about ${topic} in Indonesian. 
    Format the output strictly as a JSON array of objects with these keys: 
    "question" (string), "options" (array of 4 strings), "correctAnswer" (index 0-3), "explanation" (short string).
    Ensure the questions are educational, engaging, and suitable for general audience.
    Do not include markdown code ticks (\`\`\`). Just the raw JSON.`;

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
