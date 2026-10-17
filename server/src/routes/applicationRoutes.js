const express = require('express');
const router = express.Router();
const {
  applyJob,
  getStudentApplications,
  getJobApplicants,
  updateApplicationStatus
} = require('../controllers/applicationController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// Student: Apply to a job/internship
router.post('/apply/:jobId', protect, authorize('student'), applyJob);

// Student: View own submitted applications
router.get('/my-applications', protect, authorize('student'), getStudentApplications);

// Recruiter: View applicants for a specific job posting
router.get('/job/:jobId', protect, authorize('recruiter', 'admin'), getJobApplicants);

// Recruiter: Update applicant status
router.put('/:applicationId/status', protect, authorize('recruiter', 'admin'), updateApplicationStatus);

module.exports = router;
