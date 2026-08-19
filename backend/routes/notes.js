const express = require('express');
const router = express.Router();
const Note = require('../models/Note');
const { fuzzyMatch } = require('../utils/levenshtein');

// GET /api/notes - Fetch all notes or perform fuzzy search
router.get('/', async (req, res) => {
  try {
    const { search } = req.query;
    const notes = await Note.find().sort({ updatedAt: -1 });

    if (!search || search.trim() === '') {
      return res.json(notes);
    }

    const query = search.trim();
    const THRESHOLD = 2;

    const filtered = notes
      .map((note) => {
        const titleResult = fuzzyMatch(query, note.title, THRESHOLD);
        const bodyResult  = fuzzyMatch(query, note.body,  THRESHOLD);
        const minDist = Math.min(titleResult.minDistance, bodyResult.minDistance);
        const matched = titleResult.match || bodyResult.match;
        return { note, minDist, matched };
      })
      .filter(({ matched }) => matched)
      .sort((a, b) => a.minDist - b.minDist)
      .map(({ note }) => note);

    res.json(filtered);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET /api/notes/:id - Fetch single note by ID
router.get('/:id', async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: 'Note not found' });
    res.json(note);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// POST /api/notes - Create a new note
router.post('/', async (req, res) => {
  try {
    const { title, body = '' } = req.body;
    if (!title || typeof title !== 'string' || !title.trim()) {
      return res.status(400).json({ message: 'Title is required' });
    }

    const note = new Note({ title: title.trim(), body: body || '' });
    const saved = await note.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// PUT /api/notes/:id - Update existing note by ID
router.put('/:id', async (req, res) => {
  try {
    const { title, body = '' } = req.body;
    if (!title || typeof title !== 'string' || !title.trim()) {
      return res.status(400).json({ message: 'Title is required' });
    }

    const updated = await Note.findByIdAndUpdate(
      req.params.id,
      { title: title.trim(), body: body || '' },
      { new: true, runValidators: true }
    );

    if (!updated) return res.status(404).json({ message: 'Note not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// DELETE /api/notes/:id - Delete note by ID
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Note.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Note not found' });
    res.json({ message: 'Note deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
