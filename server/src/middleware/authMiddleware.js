import { User } from '../models/User.js';
import { verifyToken } from '../utils/auth.js';

const readAuthUser = async (req) => {
  const token = req.get('authorization')?.replace(/^Bearer\s+/i, '');
  const payload = token ? verifyToken(token) : null;

  if (!payload?.sub) {
    return null;
  }

  return User.findById(payload.sub).select('_id name email phone').lean();
};

export const optionalAuth = async (req, _res, next) => {
  try {
    req.user = await readAuthUser(req);
    next();
  } catch {
    req.user = null;
    next();
  }
};

export const requireAuth = async (req, _res, next) => {
  try {
    const user = await readAuthUser(req);

    if (!user) {
      const error = new Error('Login required.');
      error.statusCode = 401;
      throw error;
    }

    req.user = user;
    next();
  } catch (error) {
    error.statusCode = error.statusCode || 401;
    error.publicMessage = error.message || 'Login required.';
    next(error);
  }
};
