require('dotenv').config();
const express  = require('express');
const mongoose = require('mongoose');
const cors     = require('cors');

const notesRouter = require('./routes/notes');
const aiRouter    = require('./routes/ai');

const app  = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ────────────────────────────────
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

// ── Routes ────────────────────────────────────
app.use('/api/notes', notesRouter);
app.use('/api/ai',    aiRouter);

// ── Health check ─────────────────────────────
app.get('/health', (_req, res) => res.json({ status: 'ok' }));

// ── Connect to MongoDB, then start server ─────
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅  MongoDB connected');
    app.listen(PORT, () =>
      console.log(`🚀  Server running on http://localhost:${PORT}`)
    );
  })
  .catch((err) => {
    console.error('❌  MongoDB connection failed:', err.message);
    process.exit(1);
  });
