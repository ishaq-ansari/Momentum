// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http'); // Added for Socket.io
const config = require('./config/config');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
const { initChatService } = require('./utils/chatService'); // Import chat service

// Initialize express app
const app = express();

// Create HTTP server
const server = http.createServer(app);

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
app.use('/api/users', require('./routes/users'));

// Error handling middleware
app.use(errorHandler);

// Handle 404 routes
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'Route not found'
    });
});

// Initialize Socket.io chat service
const io = initChatService(server);

// Start server with http server instead of app
const PORT = config.PORT;
server.listen(PORT, () => {
    console.log(`Server running in ${config.NODE_ENV} mode on port ${PORT}`);
});
