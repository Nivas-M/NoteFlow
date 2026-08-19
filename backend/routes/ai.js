const express = require('express');
const router  = express.Router();
const { generateAIContent } = require('../utils/gemini');

// Helper function to call Gemini API
async function runPrompt(prompt) {
  return await generateAIContent(prompt);
}

// POST /api/ai/summarize - Summarize note text
router.post('/summarize', async (req, res) => {
  const trimmed = (req.body.text || '').trim();
  if (trimmed.length < 10)
    return res.status(400).json({ message: 'Note is too short to summarize (min 10 characters).' });

  try {
    const result = await runPrompt(
      `You are a summarization assistant. Write a concise 2–3 sentence summary of the following note. Output only the summary text.\n\nNote:\n${trimmed}`
    );
    res.json({ result });
  } catch (err) {
    res.status(500).json({ message: 'AI request failed.', error: err.message });
  }
});

// POST /api/ai/fix-grammar - Fix spelling and grammar
router.post('/fix-grammar', async (req, res) => {
  const trimmed = (req.body.text || '').trim();
  if (trimmed.length < 5)
    return res.status(400).json({ message: 'Note is too short to process (min 5 characters).' });

  try {
    const result = await runPrompt(
      `You are a grammar correction assistant. Correct all grammar, spelling, and punctuation. Output only the corrected text.\n\nText:\n${trimmed}`
    );
    res.json({ result });
  } catch (err) {
    res.status(500).json({ message: 'AI request failed.', error: err.message });
  }
});

// POST /api/ai/expand - Expand rough note draft
router.post('/expand', async (req, res) => {
  const trimmed = (req.body.text || '').trim();
  if (trimmed.length < 5)
    return res.status(400).json({ message: 'Write at least 5 characters to expand.' });

  try {
    const result = await runPrompt(
      `You are a writing assistant. Expand the rough note below into structured, clear paragraphs. Output only the expanded text.\n\nNote:\n${trimmed}`
    );
    res.json({ result });
  } catch (err) {
    res.status(500).json({ message: 'AI request failed.', error: err.message });
  }
});

// POST /api/ai/action-items - Extract task checklist
router.post('/action-items', async (req, res) => {
  const trimmed = (req.body.text || '').trim();
  if (trimmed.length < 10)
    return res.status(400).json({ message: 'Note is too short to extract action items (min 10 characters).' });

  try {
    const result = await runPrompt(
      `You are a productivity assistant. Extract all actionable tasks from the note below as plain bullet points starting with "- ". Output only the bullet list.\n\nNote:\n${trimmed}`
    );
    res.json({ result });
  } catch (err) {
    res.status(500).json({ message: 'AI request failed.', error: err.message });
  }
});

// POST /api/ai/make-formal - Rewrite note in professional tone
router.post('/make-formal', async (req, res) => {
  const trimmed = (req.body.text || '').trim();
  if (trimmed.length < 5)
    return res.status(400).json({ message: 'Write at least 5 characters to rewrite.' });

  try {
    const result = await runPrompt(
      `You are a professional writing assistant. Rewrite the following text in a clear, formal, business tone. Output only the rewritten text.\n\nText:\n${trimmed}`
    );
    res.json({ result });
  } catch (err) {
    res.status(500).json({ message: 'AI request failed.', error: err.message });
  }
});

// POST /api/ai/translate - Translate note text into target language
router.post('/translate', async (req, res) => {
  const trimmed = (req.body.text || '').trim();
  const targetLanguage = req.body.targetLanguage || 'Spanish';
  if (trimmed.length < 3)
    return res.status(400).json({ message: 'Note is too short to translate.' });

  try {
    const result = await runPrompt(
      `You are a professional translator. Translate the following text accurately into ${targetLanguage}. Output only the translated text.\n\nText:\n${trimmed}`
    );
    res.json({ result });
  } catch (err) {
    res.status(500).json({ message: 'AI translation request failed.', error: err.message });
  }
});

// POST /api/ai/ask - Ask question grounded in note content
router.post('/ask', async (req, res) => {
  const trimmed = (req.body.text || '').trim();
  const question = (req.body.question || '').trim();
  if (!trimmed || !question)
    return res.status(400).json({ message: 'Both note text and a question are required.' });

  try {
    const result = await runPrompt(
      `You are an intelligent Q&A assistant. Answer the user's question accurately based strictly on the provided note context below. If the answer is not contained in the note, state that clearly.\n\nNote Context:\n${trimmed}\n\nQuestion:\n${question}`
    );
    res.json({ result });
  } catch (err) {
    res.status(500).json({ message: 'AI Q&A request failed.', error: err.message });
  }
});

module.exports = router;
