const { GoogleGenerativeAI } = require('@google/generative-ai');

// List of fallback Gemini AI model candidates
const CANDIDATE_MODELS = [
  'gemini-2.5-flash',
  'gemini-3.6-flash',
  'gemini-3.5-flash',
  'gemini-3-flash',
  'gemini-2.5-flash-lite',
  'gemini-3.1-flash-lite',
  'gemini-1.5-flash',
  'gemini-1.5-pro',
  'gemma-4-31b-it',
  'gemma-4-26b-a4b-it'
];

// Helper to generate text using Gemini API with model fallback
async function generateAIContent(prompt) {
  const rawKey = process.env.GEMINI_API_KEY || '';
  const apiKey = rawKey.replace(/['"]/g, '').trim();

  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    throw new Error('GEMINI_API_KEY is missing or not set in backend/.env');
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  let lastError = null;

  for (const modelName of CANDIDATE_MODELS) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      if (text) return text.trim();
    } catch (err) {
      lastError = err;
    }
  }

  throw new Error(`AI request failed: ${lastError ? lastError.message : 'Unknown error'}`);
}

// Backwards-compatible model object wrapper
const model = {
  generateContent: async (prompt) => {
    const text = await generateAIContent(prompt);
    return { response: { text: () => text } };
  }
};

module.exports = { generateAIContent, model };
