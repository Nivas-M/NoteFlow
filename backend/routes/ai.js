const express = require('express');
const router  = express.Router();
const { model } = require('../utils/gemini');

/* ── Helper ─────────────────────────────────────────────────── */
async function runPrompt(prompt) {
  const response = await model.generateContent(prompt);
  return response.response.text().trim();
}

// ─────────────────────────────────────────────
// POST /api/ai/summarize
// ─────────────────────────────────────────────
router.post('/summarize', async (req, res) => {
  const trimmed = (req.body.text || '').trim();
  if (trimmed.length < 10)
    return res.status(400).json({ message: 'Note is too short to summarize (min 10 characters).' });

  try {
    const result = await runPrompt(
      `You are a summarization assistant. Write a concise 2–3 sentence summary of the following note.
Output the summary text only — no preamble, no labels, no quotation marks.

Note:
${trimmed}`
    );
    res.json({ result });
  } catch (err) {
    console.error('AI summarize error:', err.message);
    res.status(500).json({ message: 'AI request failed.', error: err.message });
  }
});

// ─────────────────────────────────────────────
// POST /api/ai/fix-grammar
// ─────────────────────────────────────────────
router.post('/fix-grammar', async (req, res) => {
  const trimmed = (req.body.text || '').trim();
  if (trimmed.length < 5)
    return res.status(400).json({ message: 'Note is too short to process (min 5 characters).' });

  try {
    const result = await runPrompt(
      `You are a grammar correction assistant. Correct all grammar, spelling, and punctuation errors in the text below.
Output only the corrected text — no explanations, no labels, no quotation marks.

Text:
${trimmed}`
    );
    res.json({ result });
  } catch (err) {
    console.error('AI fix-grammar error:', err.message);
    res.status(500).json({ message: 'AI request failed.', error: err.message });
  }
});

// ─────────────────────────────────────────────
// POST /api/ai/expand
// Elaborates on a short idea or rough note
// ─────────────────────────────────────────────
router.post('/expand', async (req, res) => {
  const trimmed = (req.body.text || '').trim();
  if (trimmed.length < 5)
    return res.status(400).json({ message: 'Write at least 5 characters to expand.' });

  try {
    const result = await runPrompt(
      `You are a writing assistant. The user has written a short rough note or idea. Expand it into clear, well-structured paragraphs with more detail and context.
Keep the original meaning. Write in the same perspective as the user.
Output only the expanded text — no preamble, no labels, no quotation marks.

Note to expand:
${trimmed}`
    );
    res.json({ result });
  } catch (err) {
    console.error('AI expand error:', err.message);
    res.status(500).json({ message: 'AI request failed.', error: err.message });
  }
});

// ─────────────────────────────────────────────
// POST /api/ai/action-items
// Extracts actionable to-do items
// ─────────────────────────────────────────────
router.post('/action-items', async (req, res) => {
  const trimmed = (req.body.text || '').trim();
  if (trimmed.length < 10)
    return res.status(400).json({ message: 'Note is too short to extract action items (min 10 characters).' });

  try {
    const result = await runPrompt(
      `You are a productivity assistant. Extract all actionable tasks or to-do items from the note below.
Format each item as a plain bullet starting with "- ". If no clear action items exist, write "- No clear action items found."
Output only the bullet list — no preamble, no labels, no explanations.

Note:
${trimmed}`
    );
    res.json({ result });
  } catch (err) {
    console.error('AI action-items error:', err.message);
    res.status(500).json({ message: 'AI request failed.', error: err.message });
  }
});

// ─────────────────────────────────────────────
// POST /api/ai/make-formal
// Rewrites note in professional, formal language
// ─────────────────────────────────────────────
router.post('/make-formal', async (req, res) => {
  const trimmed = (req.body.text || '').trim();
  if (trimmed.length < 5)
    return res.status(400).json({ message: 'Write at least 5 characters to rewrite.' });

  try {
    const result = await runPrompt(
      `You are a professional writing assistant. Rewrite the following text in a clear, formal, and professional tone suitable for a business or academic context.
Preserve the original meaning. Output only the rewritten text — no preamble, no labels, no quotation marks.

Text:
${trimmed}`
    );
    res.json({ result });
  } catch (err) {
    console.error('AI make-formal error:', err.message);
    res.status(500).json({ message: 'AI request failed.', error: err.message });
  }
});

module.exports = router;
