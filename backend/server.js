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

// Required for Render and secure cookies behind proxies
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
// ROUTES
// ====================================================================

// 🚀 THE SANITY CHECK ROUTE
app.get('/api/test', (req, res) => {
  res.send("NEW CODE IS LIVE!");
});

app.use('/api/auth', authRouter);
app.use('/api/resume', resumeRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/import', importRoutes);

app.get('/', (req, res) => {
  res.send('Resumn API is running successfully...');
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
  console.log(`🚀 Server running on port ${PORT}`);
});