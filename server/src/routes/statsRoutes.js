const express = require('express');
const router = express.Router();
const {
  getPublicStats,
  getStudentStats,
  getRecruiterStats,
  getAdminStats
} = require('../controllers/statsController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.get('/public', getPublicStats);
router.get('/student', protect, authorize('student'), getStudentStats);
router.get('/recruiter', protect, authorize('recruiter', 'admin'), getRecruiterStats);
router.get('/admin', protect, authorize('admin'), getAdminStats);

module.exports = router;
