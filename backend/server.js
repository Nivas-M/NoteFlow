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
app.use(cors());
app.use(express.json());

// API route handlers
app.use('/api/notes', notesRouter);
app.use('/api/ai',    aiRouter);

// Health check endpoint
app.get('/health', (_req, res) => res.json({ status: 'ok' }));

// Serve static frontend assets if built
const frontendDist = path.resolve(__dirname, '../frontend/dist');
app.use(express.static(frontendDist));

// Catch-all route for single page app navigation
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api') || req.path.startsWith('/health')) return next();
  res.sendFile(path.resolve(frontendDist, 'index.html'), (err) => {
    if (err) next();
  });
});

// Connect to MongoDB Atlas database
if (process.env.MONGO_URI) {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      console.log('✅  MongoDB connected');
    })
    .catch((err) => {
      console.error('❌  MongoDB connection failed:', err.message);
    });
}

// Start HTTP listener when running locally
if (require.main === module) {
  app.listen(PORT, () =>
    console.log(`🚀  Server running on http://localhost:${PORT}`)
  );
}

module.exports = app;
