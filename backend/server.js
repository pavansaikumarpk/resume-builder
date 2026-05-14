const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const importRoutes = require('./routes/import-routes');

require('@babel/register')({
  presets: ['@babel/preset-react']
});

dotenv.config();

const { connectDB } = require('./config/db');
const { notFound, errorHandler } = require('./middlewares/errorHandler');
const authRouter = require('./routes/authroutes');
const resumeRoutes = require('./routes/resumeroutes');
const aiRoutes = require('./routes/ai-routes');

const app = express();

app.set('trust proxy', 1);

connectDB();

app.use(compression());

// 🚀 FIX: Configure Helmet to allow cross-origin popups (Required for Google Auth!)
app.use(helmet({
  crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" }
}));

app.use(morgan('dev'));

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again after 15 minutes'
});

app.use('/api/', globalLimiter);

// 🚀 THE BULLETPROOF CORS FIX
// This automatically removes accidental trailing slashes from your Render .env variables!
const rawFrontendUrl = process.env.FRONTEND_URL || '';
const cleanFrontendUrl = rawFrontendUrl.endsWith('/') ? rawFrontendUrl.slice(0, -1) : rawFrontendUrl;

const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173', // Vite local port
  cleanFrontendUrl,
  'https://resume-builder-seven-lime.vercel.app' // 🚀 Hardcoded fallback just to be 100% safe!
];

const corsOptions = {
  origin: allowedOrigins,
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(cookieParser());

app.use('/api/auth', authRouter);
app.use('/api/resume', resumeRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/import', importRoutes);

app.get('/', (req, res) => {
  res.send('Resumn API is running successfully...');
});

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});