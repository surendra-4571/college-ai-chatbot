require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const compression = require('compression');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-ratelimit');
const path = require('path');

// Initialize app
const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());
app.use(compression());
app.use(morgan('dev'));

// CORS configuration
const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:5173').split(',');
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parser middleware
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW) || 900000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// Static files
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running', timestamp: new Date() });
});

// Chat routes
app.post('/api/chat', require('./routes/chatRoutes').sendMessage);
app.get('/api/chat/history/:sessionId', require('./routes/chatRoutes').getChatHistory);
app.delete('/api/chat/session/:sessionId', require('./routes/chatRoutes').deleteSession);
app.get('/api/chat/sessions', require('./routes/chatRoutes').getSessions);

// Code execution routes
app.post('/api/execute', require('./routes/codeRoutes').executeCode);
app.get('/api/languages', require('./routes/codeRoutes').getSupportedLanguages);

// File management routes
app.post('/api/files/upload', require('./routes/fileRoutes').uploadFile);
app.get('/api/files/:fileId', require('./routes/fileRoutes').downloadFile);
app.delete('/api/files/:fileId', require('./routes/fileRoutes').deleteFile);
app.get('/api/files', require('./routes/fileRoutes').listFiles);

// LLM configuration routes
app.get('/api/models', require('./routes/modelRoutes').getAvailableModels);
app.post('/api/models/config', require('./routes/modelRoutes').setModelConfig);
app.get('/api/models/config', require('./routes/modelRoutes').getModelConfig);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    timestamp: new Date()
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🤖 College AI Chatbot Backend`);
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`📡 API Documentation: http://localhost:${PORT}/api/docs`);
  console.log(`🔐 Environment: ${process.env.NODE_ENV}\n`);
});

module.exports = app;
