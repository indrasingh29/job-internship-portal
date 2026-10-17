const express = require('express');
const router = express.Router();
const {
  getJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  getRecruiterJobs
} = require('../controllers/jobController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// Public listing & discovery
router.get('/', getJobs);

// Recruiter specific listing
router.get('/recruiter/my-postings', protect, authorize('recruiter', 'admin'), getRecruiterJobs);

// Single job details
router.get('/:id', getJobById);

// Recruiter / Admin job management
router.post('/', protect, authorize('recruiter', 'admin'), createJob);
router.put('/:id', protect, authorize('recruiter', 'admin'), updateJob);
router.delete('/:id', protect, authorize('recruiter', 'admin'), deleteJob);

module.exports = router;
