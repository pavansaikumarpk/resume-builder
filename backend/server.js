const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const helmet = require('helmet'); 
const compression = require('compression'); 
const rateLimit = require('express-rate-limit'); 
const morgan = require('morgan'); 
const importRoutes = require('./routes/import-routes');


dotenv.config();

const { connectDB } = require('./config/db');
const { notFound, errorHandler } = require('./middlewares/errorHandler');
const authRouter = require('./routes/authroutes');
const resumeRoutes = require('./routes/resumeroutes');
const aiRoutes = require('./routes/ai-routes');

const app = express();


connectDB();

app.use(compression());


app.use(helmet());


app.use(morgan('dev'));


const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100, 
  message: 'Too many requests from this IP, please try again after 15 minutes'
});
app.use('/api/', globalLimiter);


const allowedOrigins = [
  'http://localhost:3000', 
  process.env.FRONTEND_URL 
];

const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
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