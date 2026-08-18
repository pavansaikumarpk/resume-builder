






const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');

require('@babel/register')({
  presets: ['@babel/preset-react']
});

dotenv.config();
const { connectDB } = require('./config/db');
const { notFound, errorHandler } = require('./middlewares/errorHandler');

// Route Imports
const authRouter = require('./routes/authroutes');
const resumeRoutes = require('./routes/resumeroutes');
const aiRoutes = require('./routes/ai-routes');
const importRoutes = require('./routes/import-routes');

const app = express();

// Required for Render/Fly.io/Vercel and secure cookies behind proxies
app.set('trust proxy', 1); 
connectDB();

// ====================================================================
// CORS CONFIGURATION
// ====================================================================
app.use(cors({
  origin: function (origin, callback) {
    callback(null, true);
  },
  credentials: true, 
  optionsSuccessStatus: 200
}));

// ====================================================================
// MIDDLEWARES
// ====================================================================
app.use(helmet({
  crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" },
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

app.use(compression());
app.use(morgan('dev'));

// 🚀 CRITICAL ARCHITECTURE FIX: Granular Rate Limiting
// Prevents the 1.5s Autosave from triggering a DDoS ban on the user
const editorLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1500, // Generous allowance for frequent autosaves
  message: 'Too many editor actions, please pause for a moment.'
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 20, // Strict limit to prevent Brute Force / Credential Stuffing
  message: 'Too many authentication attempts, please try again later.'
});

const aiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // Strict limit to prevent Groq API billing exhaustion
  message: 'AI rate limit exceeded. Please wait 60 seconds.'
});

app.use(express.json({ limit: '5mb' })); // Increased to 5mb to support PDF imports safely
app.use(express.urlencoded({ extended: true, limit: '5mb' }));
app.use(cookieParser());

// ====================================================================
// ROUTES WITH GRANULAR LIMITS
// ====================================================================
app.get('/api/test', (req, res) => res.send("NEW CODE IS LIVE!"));

app.use('/api/auth', authLimiter, authRouter);
app.use('/api/resume', editorLimiter, resumeRoutes);
app.use('/api/import', editorLimiter, importRoutes);
app.use('/api/ai', aiLimiter, aiRoutes);

app.get('/', (req, res) => {
  res.send('Resumn API is operating optimally.');
});

app.use((err, req, res, next) => {
    res.header("Access-Control-Allow-Origin", req.headers.origin || '*');
    res.header("Access-Control-Allow-Credentials", "true");
    next(err);
});

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`🚀 Architecture Online: Server running on port ${PORT}`);
});