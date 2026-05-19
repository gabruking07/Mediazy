import mongoose from 'mongoose';
import { User } from '../models/User.js';
import { sendAccountNotification } from '../services/emailService.js';
import { createToken, hashPassword, verifyPassword } from '../utils/auth.js';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonePattern = /^\+?[1-9]\d{9,14}$/;
const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;

const normalizePhone = (value) => String(value || '').trim().replace(/[\s()-]/g, '');

const authPayload = (user) => ({
  user: {
    id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone
  },
  token: createToken(user)
});

const requireDatabase = () => {
  if (mongoose.connection.readyState !== 1) {
    const error = new Error('Login is unavailable until MongoDB is connected.');
    error.statusCode = 503;
    throw error;
  }
};

export const register = async (req, res, next) => {
  try {
    requireDatabase();

    const name = String(req.body.name || '').trim();
    const email = String(req.body.email || '').trim().toLowerCase();
    const phone = normalizePhone(req.body.phone);
    const password = String(req.body.password || '');

    if (name.length < 2 || name.length > 80) {
      const error = new Error('Name must be between 2 and 80 characters.');
      error.statusCode = 400;
      throw error;
    }

    if (!emailPattern.test(email)) {
      const error = new Error('Enter a valid email address.');
      error.statusCode = 400;
      throw error;
    }

    if (!phonePattern.test(phone)) {
      const error = new Error('Enter a valid phone number with 10 to 15 digits.');
      error.statusCode = 400;
      throw error;
    }

    if (!passwordPattern.test(password)) {
      const error = new Error('Password must be at least 8 characters and include a letter and a number.');
      error.statusCode = 400;
      throw error;
    }

    const existing = await User.findOne({ $or: [{ email }, { phone }] }).lean();

    if (existing) {
      const error = new Error(existing.email === email
        ? 'An account already exists for this email.'
        : 'An account already exists for this phone number.');
      error.statusCode = 409;
      throw error;
    }

    const passwordFields = hashPassword(password);
    const user = await User.create({ name, email, phone, ...passwordFields });

    res.status(201).json(authPayload(user));
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    requireDatabase();

    const identifier = String(req.body.identifier || req.body.email || '').trim().toLowerCase();
    const phone = normalizePhone(identifier);
    const password = String(req.body.password || '');

    if (!identifier || !password) {
      const error = new Error('Enter your email or phone number and password.');
      error.statusCode = 400;
      throw error;
    }

    if (!emailPattern.test(identifier) && !phonePattern.test(phone)) {
      const error = new Error('Enter a valid email or phone number.');
      error.statusCode = 400;
      throw error;
    }

    const user = await User.findOne(emailPattern.test(identifier)
      ? { email: identifier }
      : { phone });

    if (!user || !verifyPassword(password, user)) {
      const error = new Error('Invalid email, phone, or password.');
      error.statusCode = 401;
      throw error;
    }

    res.json(authPayload(user));
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res) => {
  res.json({ user: req.user });
};

export const updateProfile = async (req, res, next) => {
  try {
    requireDatabase();

    const user = await User.findById(req.user._id);

    if (!user) {
      const error = new Error('User account was not found.');
      error.statusCode = 404;
      throw error;
    }

    const nextName = String(req.body.name || user.name).trim();
    const nextEmail = String(req.body.email || user.email).trim().toLowerCase();
    const currentPassword = String(req.body.currentPassword || '');
    const newPassword = String(req.body.newPassword || '');
    const changed = [];
    const previousEmail = user.email;

    if (nextName.length < 2 || nextName.length > 80) {
      const error = new Error('Name must be between 2 and 80 characters.');
      error.statusCode = 400;
      throw error;
    }

    if (!emailPattern.test(nextEmail)) {
      const error = new Error('Enter a valid email address.');
      error.statusCode = 400;
      throw error;
    }

    if ((nextEmail !== user.email || newPassword) && !verifyPassword(currentPassword, user)) {
      const error = new Error('Enter your current password to change email or password.');
      error.statusCode = 401;
      throw error;
    }

    if (nextEmail !== user.email) {
      const existing = await User.findOne({ email: nextEmail, _id: { $ne: user._id } }).lean();

      if (existing) {
        const error = new Error('An account already exists for this email.');
        error.statusCode = 409;
        throw error;
      }

      user.email = nextEmail;
      changed.push('email');
    }

    if (nextName !== user.name) {
      user.name = nextName;
      changed.push('name');
    }

    if (newPassword) {
      if (!passwordPattern.test(newPassword)) {
        const error = new Error('New password must be at least 8 characters and include a letter and a number.');
        error.statusCode = 400;
        throw error;
      }

      const passwordFields = hashPassword(newPassword);
      user.passwordHash = passwordFields.passwordHash;
      user.passwordSalt = passwordFields.passwordSalt;
      changed.push('password');
    }

    await user.save();

    if (changed.length) {
      const subject = 'Your Mediazy account was updated';
      const text = `Your Mediazy account ${changed.join(', ')} was updated. If this was not you, change your password immediately.`;

      await sendAccountNotification({ to: user.email, subject, text });

      if (previousEmail !== user.email) {
        await sendAccountNotification({
          to: previousEmail,
          subject,
          text: `The email address on your Mediazy account was changed to ${user.email}. If this was not you, contact support immediately.`
        });
      }
    }

    res.json(authPayload(user));
  } catch (error) {
    next(error);
  }
};
