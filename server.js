// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const config = require('./config/config');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Initialize express app
const app = express();

// Connect Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/posts', require('./routes/posts'));
app.use('/api/chatrooms', require('./routes/chatrooms'));
app.use('/api/appointments', require('./routes/appointments'));
app.use('/api/professionals', require('./routes/professionals'));
app.use('/api/resources', require('./routes/resources'));
app.use('/api/peers', require('./routes/peers'));

// Error handling middleware
app.use(errorHandler);

// Handle 404 routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found'
  });
});

// Start server
const PORT = config.PORT;
app.listen(PORT, () => {
  console.log(`Server running in ${config.NODE_ENV} mode on port ${PORT}`);
});