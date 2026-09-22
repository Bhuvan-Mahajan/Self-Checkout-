const express = require('express');
const rateLimit = require('express-rate-limit');

const authController = require('../controllers/authController');
const protect = require('../middleware/protect');
const validate = require('../middleware/validate');
const { registerSchema } = require('../utils/validators');

const router = express.Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many attempts, try again later',
  },
});

router.post(
  '/register',
  authLimiter,
  validate(registerSchema),
  authController.register
);

router.post('/login', authLimiter, authController.login);

router.post('/logout', protect, authController.logout);

router.post('/refresh', authController.refreshToken);

router.get('/me', protect, authController.getMe);

module.exports = router;
