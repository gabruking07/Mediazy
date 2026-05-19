import rateLimit from 'express-rate-limit';

const windowMinutes = Number(process.env.RATE_LIMIT_WINDOW_MINUTES || 15);
const max = Number(process.env.RATE_LIMIT_MAX || 60);

export const apiLimiter = rateLimit({
  windowMs: windowMinutes * 60 * 1000,
  max,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: 'Too many requests. Please wait a moment and try again.'
  }
});
