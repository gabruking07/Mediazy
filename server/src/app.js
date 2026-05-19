import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { apiLimiter } from './middleware/rateLimiter.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import authRoutes from './routes/authRoutes.js';
import downloadRoutes from './routes/downloadRoutes.js';

dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const downloadsPath = path.resolve(__dirname, '../downloads');
const allowedOrigins = process.env.CLIENT_URL
  ?.split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));
app.use(cors({
  origin: allowedOrigins?.length ? allowedOrigins : '*',
  credentials: true
}));
app.use(express.json({ limit: '1mb' }));
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use('/downloads', express.static(downloadsPath));

app.get('/health', (_req, res) => {
  res.json({ ok: true, service: 'mediazy-api' });
});

app.use('/api/auth', apiLimiter, authRoutes);
app.use('/api', apiLimiter, downloadRoutes);
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
