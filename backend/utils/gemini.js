const { GoogleGenerativeAI } = require('@google/generative-ai');

if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here') {
  console.warn('⚠️  GEMINI_API_KEY is not set — AI features will be disabled.');
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
// gemma-4-31b-it: instruction-tuned Gemma 4 31B, served via the Gemini API
const model = genAI.getGenerativeModel({ model: 'gemma-4-31b-it' });

module.exports = { model };
