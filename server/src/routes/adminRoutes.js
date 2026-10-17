const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  toggleUserStatus,
  deleteUser,
  getAllJobsAdmin
} = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// All admin routes strictly guarded with protect + authorize('admin')
router.use(protect, authorize('admin'));

router.get('/users', getAllUsers);
router.put('/users/:id/toggle-status', toggleUserStatus);
router.delete('/users/:id', deleteUser);
router.get('/jobs', getAllJobsAdmin);

module.exports = router;
