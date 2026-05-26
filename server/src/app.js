import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import authRoutes from './routes/authRoutes.js';
import downloadRoutes from './routes/downloadRoutes.js';

dotenv.config();

const app = express();
app.set('trust proxy', 1);

const defaultClientOrigins = [
  'https://mediazy.xyz',
  'https://www.mediazy.xyz',
  'https://mediazy.vercel.app'
];

const allowedOrigins = [
  ...defaultClientOrigins,
  ...(process.env.CLIENT_URL || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean)
]
  .map((origin) => origin.replace(/\/$/, ''))
  .filter(Boolean);

const isDevelopmentOrigin = (origin = '') => {
  if (process.env.NODE_ENV === 'production') return false;

  return /^http:\/\/(localhost|127\.0\.0\.1|0\.0\.0\.0|\[::1\])(:\d+)?$/i.test(origin) ||
    /^http:\/\/10\.\d{1,3}\.\d{1,3}\.\d{1,3}(:\d+)?$/i.test(origin) ||
    /^http:\/\/172\.(1[6-9]|2\d|3[0-1])\.\d{1,3}\.\d{1,3}(:\d+)?$/i.test(origin) ||
    /^http:\/\/192\.168\.\d{1,3}\.\d{1,3}(:\d+)?$/i.test(origin);
};

const isAllowedOrigin = (origin = '') => {
  const normalizedOrigin = origin.replace(/\/$/, '');

  return (
    allowedOrigins.includes(normalizedOrigin) ||
    isDevelopmentOrigin(normalizedOrigin) ||
    /^https:\/\/[\w-]+\.vercel\.app$/i.test(normalizedOrigin)
  );
};

const corsOptions = {
  origin(origin, callback) {
    if (!origin || isAllowedOrigin(origin)) {
      callback(null, true);
      return;
    }

    callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true
};

app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json({ limit: '1mb' }));
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

app.get('/health', (_req, res) => {
  res.json({ ok: true, service: 'mediazy-api' });
});

app.use('/api/auth', authRoutes);
app.use('/api', downloadRoutes);
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
