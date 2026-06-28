import asyncHandler from 'express-async-handler';
import { verifyToken } from '../utils/token.js';
import User from '../models/User.js';

export const protect = asyncHandler(async (req, res, next) => {
  const cookieName = process.env.COOKIE_NAME || 'rentease_token';
  let token = req.cookies?.[cookieName];

  if (!token && req.headers.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authenticated. Please log in.');
  }

  try {
    const decoded = verifyToken(token);
    const user = await User.findById(decoded.id);

    if (!user || !user.isActive) {
      res.status(401);
      throw new Error('User no longer exists or is deactivated.');
    }

    req.user = user;
    next();
  } catch {
    res.status(401);
    throw new Error('Session expired or invalid. Please log in again.');
  }
});

export const restrictTo = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    res.status(403);
    throw new Error(`Access denied. This action requires role: ${roles.join(' or ')}.`);
  }
  next();
};
