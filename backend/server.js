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

// Connect to MongoDB Atlas database and start server
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
