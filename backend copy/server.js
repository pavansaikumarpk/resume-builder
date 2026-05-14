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

// ====================================================================
// 🚀 1. THE ULTIMATE CORS FIX (MUST BE AT THE VERY TOP!)
// ====================================================================
const rawFrontendUrl = process.env.FRONTEND_URL || '';
const cleanFrontendUrl = rawFrontendUrl.endsWith('/') ? rawFrontendUrl.slice(0, -1) : rawFrontendUrl;

const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  cleanFrontendUrl,
  'https://resume-builder-seven-lime.vercel.app' // Hardcoded Vercel URL
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true, // Tells cors to attach the missing header
  optionsSuccessStatus: 200
}));

// 🚀 2. THE SAFETY NET: Manually force the credentials header for strict browsers (like Chrome)
app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.setHeader('Access-Control-Allow-Credentials', 'true'); // completely fixes your screenshot error!
    next();
});

// ====================================================================
// 3. OTHER MIDDLEWARES (Now safely below CORS)
// ====================================================================
app.use(helmet({
  crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" },
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

app.use(compression());
app.use(morgan('dev'));

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again after 15 minutes'
});

app.use('/api/', globalLimiter);

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(cookieParser());

// ====================================================================
// 4. ROUTES
// ====================================================================
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