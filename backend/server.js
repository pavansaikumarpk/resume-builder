const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');

require('@babel/register')({ presets: ['@babel/preset-react'] });
dotenv.config();
const { connectDB } = require('./config/db');
const { notFound, errorHandler } = require('./middlewares/errorHandler');
const authRouter = require('./routes/authroutes');
const resumeRoutes = require('./routes/resumeroutes');
const aiRoutes = require('./routes/ai-routes');
const importRoutes = require('./routes/import-routes');
const usageRoutes = require('./routes/usage-routes');

const app = express();
app.set('trust proxy', 1);
connectDB();

const allowedOrigins = new Set([
  'https://haveresume.com',
  'https://www.haveresume.com',
  'http://localhost:5173',
  'http://localhost:4173',
  ...(process.env.FRONTEND_URL ? process.env.FRONTEND_URL.split(',').map((origin) => origin.trim()).filter(Boolean) : []),
]);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.has(origin)) return callback(null, true);
    return callback(new Error('CORS origin not allowed'));
  },
  credentials: true,
  optionsSuccessStatus: 200,
}));

app.use(helmet({
  crossOriginOpenerPolicy: { policy: 'same-origin-allow-popups' },
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));
app.use(compression());
app.use(morgan('dev'));

const editorLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 1500, message: 'Too many editor actions, please pause for a moment.' });
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 20, message: 'Too many authentication attempts, please try again later.' });
const aiLimiter = rateLimit({ windowMs: 60 * 1000, max: 10, message: 'AI rate limit exceeded. Please wait 60 seconds.' });

app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));
app.use(cookieParser());

app.get('/api/test', (req, res) => res.send('Resumn API is live.'));
app.use('/api/auth', authLimiter, authRouter);
app.use('/api/resume', editorLimiter, resumeRoutes);
app.use('/api/import', editorLimiter, importRoutes);
app.use('/api/ai', aiLimiter, aiRoutes);
app.use('/api/usage', usageRoutes);

app.get('/', (req, res) => res.send('Resumn API is operating normally.'));
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Resumn API running on port ${PORT}`));
