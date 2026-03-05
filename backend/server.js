require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { testConnection } = require('./config/db');
const { errorHandler } = require('./middleware/errorHandler');

// Routes
const authRoutes = require('./routes/auth');
const roomRoutes = require('./routes/rooms');
const bookingRoutes = require('./routes/bookings');

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Middleware ───────────────────────────────────────────────
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Health Check ─────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Room Booking API is running 🏨',
    timestamp: new Date().toISOString(),
  });
});

// ─── API Routes ───────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/bookings', bookingRoutes);

// ─── 404 Handler ──────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.path} not found.`,
  });
});

// ─── Global Error Handler ─────────────────────────────────────
app.use(errorHandler);

// ─── Start Server ─────────────────────────────────────────────
const start = async () => {
  await testConnection();
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📖 API base URL: http://localhost:${PORT}/api`);
  });
};

start();