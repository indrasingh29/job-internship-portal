const rateLimit = require('express-rate-limit');

// Rate limiter for authentication routes (login / registration)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many authentication requests from this IP. Please try again after 15 minutes.'
  }
});

// Stricter rate limiter for password recovery and reset endpoints
const passwordResetLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Limit each IP to 20 reset requests per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many password reset attempts. Please try again after 15 minutes.'
  }
});

// General API rate limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many API requests from this IP. Please try again later.'
  }
});

module.exports = { authLimiter, passwordResetLimiter, apiLimiter };
