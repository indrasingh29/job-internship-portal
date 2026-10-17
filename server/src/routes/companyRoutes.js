const express = require('express');
const router = express.Router();
const {
  getCompanies,
  getCompanyByIdOrSlug,
  getIndustries,
  updateMyCompany
} = require('../controllers/companyController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.get('/', getCompanies);
router.get('/meta/industries', getIndustries);
router.get('/:identifier', getCompanyByIdOrSlug);
router.put('/my-company', protect, authorize('recruiter', 'admin'), updateMyCompany);

module.exports = router;
