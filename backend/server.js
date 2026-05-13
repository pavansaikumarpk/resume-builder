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

// 🚀 FIX: Array-based origins. 
// If an origin doesn't match, it gracefully rejects it instead of throwing a fatal 500 crash error.
const allowedOrigins = [
  'http://localhost:3000',
  process.env.FRONTEND_URL
];

const corsOptions = {
  origin: allowedOrigins, // 🚀 Changed from a function to a direct array
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