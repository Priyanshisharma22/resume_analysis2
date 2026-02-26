require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');

const resumeRoutes = require('./routes/resume');
const aiRoute = require('./routes/aiRoute');

const app = express();
const PORT = process.env.PORT || 3001;

// Allowed Origins
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5189',
  'http://localhost:5174',
  'http://localhost:5175',
  'http://localhost:5176',
  'http://localhost:5177',
  'http://localhost:5178',
  'http://localhost:5179',
  'http://localhost:5180',
  'http://localhost:5181',
  'http://localhost:5182',
  'http://localhost:5183',
  'http://localhost:5184',
  'http://localhost:5185',
  'http://localhost:5186',
  'http://localhost:5187',
  'http://localhost:5188',
];

// Add production frontend URL if available
if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL.trim()); // .trim() removes accidental spaces
}

// CORS Middleware
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, Postman)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.error(`CORS blocked: ${origin}`);
      callback(new Error('Not allowed by CORS: ' + origin));
    }
  },
  credentials: true,
}));

app.use((req, res, next) => {
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; connect-src 'self' http://localhost:* ws://localhost:*; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:;"
  );
  next();
});

app.use(express.json({ limit: '10mb' }));
app.use(fileUpload({
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
  abortOnLimit: true,
}));

// Routes
app.use('/api/resume', resumeRoutes);
app.use('/api/ai', aiRoute);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    allowedOrigins, // helpful for debugging
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`🌐 Allowed origins: ${allowedOrigins.join(', ')}`);
  console.log(`🤖 Using Ollama model: ${process.env.OLLAMA_MODEL || 'llama3.2'}`);
});