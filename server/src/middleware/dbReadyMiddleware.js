const mongoose = require('mongoose');

/**
 * Factory for database readiness guard middleware (allows clean unit testing without mutating mongoose).
 */
const createDatabaseGuard = (getReadyState = () => mongoose.connection.readyState) => {
  return (req, res, next) => {
    if (getReadyState() !== 1) {
      return res.status(503).json({
        success: false,
        code: 'DB_UNAVAILABLE',
        message: 'Opportunities and account data are temporarily unavailable while the database connection is being established. Please try again shortly.'
      });
    }
    next();
  };
};

const requireDatabase = createDatabaseGuard();

module.exports = { requireDatabase, createDatabaseGuard };
