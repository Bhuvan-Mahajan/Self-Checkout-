const jwt = require('jsonwebtoken');
const { User } = require('../models');
const env = require('../config/env');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');

// Indian mobile: optional +91, then 10 digits starting 6–9
const INDIAN_PHONE_REGEX = /^(\+91)?[6-9]\d{9}$/;

function generateTokens(userId) {
  const accessToken = jwt.sign({ id: userId }, env.JWT_SECRET, {
    expiresIn: '15m',
  });

  const refreshToken = jwt.sign({ id: userId }, env.JWT_REFRESH_SECRET, {
    expiresIn: '7d',
  });

  return { accessToken, refreshToken };
}

function setRefreshCookie(res, token) {
  res.cookie('refreshToken', token, {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
}

function sanitizeUser(user) {
  return {
    _id: user._id,
    name: user.name,
    phone: user.phone,
    role: user.role,
  };
}

/**
 * POST /api/auth/register
 */
exports.register = asyncHandler(async (req, res) => {
  const { name, phone, password } = req.body;

  if (!name || !phone || !password) {
    throw new AppError('Name, phone, and password are required', 400);
  }

  if (!INDIAN_PHONE_REGEX.test(String(phone).trim())) {
    throw new AppError('Please provide a valid Indian mobile number', 400);
  }

  if (String(password).length < 8) {
    throw new AppError('Password must be at least 8 characters', 400);
  }

  const existing = await User.findOne({ phone: String(phone).trim() });
  if (existing) {
    throw new AppError('Phone already registered', 409);
  }

  const user = await User.create({
    name: String(name).trim(),
    phone: String(phone).trim(),
    // Plaintext assigned here; User pre-save hook hashes into passwordHash
    passwordHash: password,
    role: 'customer',
  });

  const { accessToken, refreshToken } = generateTokens(user._id);
  setRefreshCookie(res, refreshToken);

  res.status(201).json({
    success: true,
    user: sanitizeUser(user),
    accessToken,
  });
});

/**
 * POST /api/auth/login
 */
exports.login = asyncHandler(async (req, res) => {
  const { phone, password } = req.body;

  if (!phone || !password) {
    throw new AppError('Phone and password are required', 400);
  }

  const user = await User.findOne({ phone: String(phone).trim() }).select(
    '+passwordHash'
  );

  // Same message for missing user OR bad password — avoids account enumeration
  // (attackers must not learn which phones are registered).
  if (!user || !(await user.comparePassword(password))) {
    throw new AppError('Invalid phone or password', 401);
  }

  const { accessToken, refreshToken } = generateTokens(user._id);
  setRefreshCookie(res, refreshToken);

  res.status(200).json({
    success: true,
    user: sanitizeUser(user),
    accessToken,
  });
});

/**
 * POST /api/auth/logout
 */
exports.logout = asyncHandler(async (req, res) => {
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'strict',
  });

  res.status(200).json({
    success: true,
    message: 'Logged out',
  });
});

/**
 * POST /api/auth/refresh
 */
exports.refreshToken = asyncHandler(async (req, res) => {
  const token = req.cookies?.refreshToken;

  if (!token) {
    throw new AppError('No refresh token', 401);
  }

  let decoded;
  try {
    decoded = jwt.verify(token, env.JWT_REFRESH_SECRET);
  } catch (err) {
    throw err; // JsonWebTokenError / TokenExpiredError → errorHandler
  }

  const user = await User.findById(decoded.id);
  if (!user) {
    throw new AppError('User no longer exists', 401);
  }

  const accessToken = jwt.sign({ id: user._id }, env.JWT_SECRET, {
    expiresIn: '15m',
  });

  res.status(200).json({
    success: true,
    accessToken,
  });
});

/**
 * GET /api/auth/me
 * Requires protect middleware to set req.user
 */
exports.getMe = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
});
