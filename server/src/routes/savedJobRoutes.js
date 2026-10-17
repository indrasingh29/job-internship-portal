const express = require('express');
const router = express.Router();
const {
  saveJob,
  unsaveJob,
  getSavedJobs,
  checkSaved
} = require('../controllers/savedJobController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// All saved job routes require logged-in student
router.use(protect, authorize('student'));

router.get('/', getSavedJobs);
router.get('/check/:jobId', checkSaved);
router.post('/:jobId', saveJob);
router.delete('/:jobId', unsaveJob);

module.exports = router;
