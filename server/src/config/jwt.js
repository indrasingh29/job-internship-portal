const crypto = require('crypto');
const jwt = require('jsonwebtoken');

let devFallbackSecret = null;

/**
 * Resolve the JWT signing secret from environment variables.
 * Never allows a hardcoded fallback secret in production.
 */
const getJwtSecret = () => {
  if (process.env.JWT_SECRET && process.env.JWT_SECRET.trim().length > 0) {
    return process.env.JWT_SECRET;
  }

  if (process.env.NODE_ENV === 'production') {
    throw new Error('FATAL: JWT_SECRET environment variable must be set in production.');
  }

  if (!devFallbackSecret) {
    devFallbackSecret = crypto.randomBytes(32).toString('hex');
    console.warn('[Security] JWT_SECRET not set; using an ephemeral secret for non-production runtime.');
  }

  return devFallbackSecret;
};

/**
 * Sign a JWT token for a user ID.
 */
const signToken = (id) => {
  return jwt.sign({ id }, getJwtSecret(), {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
};

/**
 * Verify a JWT token and return its decoded payload.
 */
const verifyToken = (token) => {
  return jwt.verify(token, getJwtSecret());
};

module.exports = {
  getJwtSecret,
  signToken,
  verifyToken
};
