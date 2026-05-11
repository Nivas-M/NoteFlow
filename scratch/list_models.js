const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config({ path: '../backend/.env' });

async function listModels() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
  try {
    const result = await genAI.listModels();
    console.log(JSON.stringify(result, null, 2));
  } catch (err) {
    console.error('Error listing models:', err.message);
  }
}

listModels();
