require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const recipeRoutes = require('./routes/recipe');

const app = express();
const PORT = process.env.PORT || 3001;

// Enable CORS for all origins in development and deployment
app.use(cors());

app.use(express.json());

// Service health check endpoint
app.get(['/api/health', '/health'], (req, res) => {
  res.json({ status: 'ok', service: 'kitchen-os-server' });
});

app.use('/api/recipe', recipeRoutes);

// Serve Frontend in Production (non-Vercel standalone Node environments)
if (process.env.NODE_ENV === 'production' && !process.env.VERCEL) {
  // Point to the built Vite files
  app.use(express.static(path.join(__dirname, '../client/dist')));
  
  // Catch-all route to serve React's index.html for unknown routes
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/dist', 'index.html'));
  });
}

// Start listening only when executed directly (not in Vercel serverless environment)
if (!process.env.VERCEL && require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
