/**
 * @file server.js
 * @description Entry point of the Finance Tracker API server.
 *              Sets up Express, middleware, and routes.
 * @author 
 * @version 1.0.0
 */

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

/* ========== Env Validation ========== */
if (!process.env.JWT_SECRET) {
  console.error('❌ Missing JWT_SECRET in .env file');
  process.exit(1);
}

/* ========== Middleware Setup ========== */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enable CORS with frontend origin restriction
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
}));

// Enable request logging in development mode
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

/* ========== Routes ========== */

// Root route for API test
app.get('/', (req, res) => {
  res.json({
    message: '📊 Finance Tracker API is running!',
    version: process.env.APP_VERSION || '1.0.0',
    endpoints: {
      auth: '/api/auth',
      transactions: '/api/transactions',
      categories: '/api/categories',
      budgets: '/api/budgets'
    }
  });
});

// Import API routes from routes/index.js
app.use('/api', require('./routes'));

// Serve frontend static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/build')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
  });
}

/* ========== Error Handling ========== */

// General error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// 404 route fallback
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

/* ========== Server Listener ========== */
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

