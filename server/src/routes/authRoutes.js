const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getMe,
  updateProfile,
  changePassword,
  forgotPassword,
  verifyResetToken,
  resetPassword
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { authLimiter, passwordResetLimiter } = require('../middleware/rateLimiter');

router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.post('/forgot-password', passwordResetLimiter, forgotPassword);
router.get('/reset-password/:token', passwordResetLimiter, verifyResetToken);
router.post('/reset-password/:token', passwordResetLimiter, resetPassword);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.put('/change-password', protect, changePassword);

module.exports = router;
