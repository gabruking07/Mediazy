import { User } from '../models/User.js';
import { verifyToken } from '../utils/auth.js';

export const requireAuth = async (req, _res, next) => {
  try {
    const token = req.get('authorization')?.replace(/^Bearer\s+/i, '');
    const payload = token ? verifyToken(token) : null;

    if (!payload?.sub) {
      const error = new Error('Login required before downloading.');
      error.statusCode = 401;
      throw error;
    }

    const user = await User.findById(payload.sub).select('_id name email phone').lean();

    if (!user) {
      const error = new Error('Login required before downloading.');
      error.statusCode = 401;
      throw error;
    }

    req.user = user;
    next();
  } catch (error) {
    error.statusCode = error.statusCode || 401;
    error.publicMessage = error.message || 'Login required before downloading.';
    next(error);
  }
};
