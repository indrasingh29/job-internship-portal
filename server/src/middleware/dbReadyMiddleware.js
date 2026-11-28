const mongoose = require('mongoose');

/**
 * Fail fast with HTTP 503 when MongoDB is not connected so API callers
 * never wait 10s for Mongoose command buffering timeouts.
 */
const requireDatabase = (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      success: false,
      code: 'DB_UNAVAILABLE',
      message: 'Opportunities and account data are temporarily unavailable while the database connection is being established. Please try again shortly.'
    });
  }
  next();
};

module.exports = { requireDatabase };
