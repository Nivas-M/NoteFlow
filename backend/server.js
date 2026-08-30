// Load environment variables from .env
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const express  = require('express');
const mongoose = require('mongoose');
const cors     = require('cors');

const notesRouter = require('./routes/notes');
const aiRouter    = require('./routes/ai');

const app  = express();
const PORT = process.env.PORT || 5000;

// Enable CORS and JSON parsing
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

// API route handlers
app.use('/api/notes', notesRouter);
app.use('/api/ai',    aiRouter);

// Health check endpoint
app.get('/health', (_req, res) => res.json({ status: 'ok' }));

// Connect to MongoDB Atlas database
if (process.env.MONGO_URI) {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      console.log('✅  MongoDB connected');
    })
    .catch((err) => {
      console.error('❌  MongoDB connection error:', err.message);
    });
} else {
  console.warn('⚠️  MONGO_URI is not defined in .env');
}

// Start Express server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀  Server running on http://127.0.0.1:${PORT}`);
});
