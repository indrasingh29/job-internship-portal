const Company = require('../models/Company');
const Job = require('../models/Job');

// @desc    Get all companies with search, industry filter, and pagination
// @route   GET /api/companies
// @access  Public
const getCompanies = async (req, res, next) => {
  try {
    const { search, industry, page = 1, limit = 12 } = req.query;
    const query = {};

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    if (industry && industry !== 'All') {
      query.industry = industry;
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 12;
    const skip = (pageNum - 1) * limitNum;

    const total = await Company.countDocuments(query);
    const companies = await Company.find(query)
      .sort({ name: 1 })
      .skip(skip)
      .limit(limitNum);

    // Compute active jobs count for each company
    const companyIds = companies.map(c => c._id);
    const jobCounts = await Job.aggregate([
      { $match: { company: { $in: companyIds }, status: 'Active' } },
      { $group: { _id: '$company', count: { $sum: 1 } } }
    ]);

    const countMap = {};
    jobCounts.forEach(item => {
      countMap[item._id.toString()] = item.count;
    });

    const enrichedCompanies = companies.map(comp => ({
      ...comp.toObject(),
      activeJobsCount: countMap[comp._id.toString()] || 0
    }));

    res.json({
      success: true,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      count: enrichedCompanies.length,
      companies: enrichedCompanies
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get company details by ID or Slug with associated active postings
// @route   GET /api/companies/:identifier
// @access  Public
const getCompanyByIdOrSlug = async (req, res, next) => {
  try {
    const { identifier } = req.params;
    let company;

    if (identifier.match(/^[0-9a-fA-F]{24}$/)) {
      company = await Company.findById(identifier);
    } else {
      company = await Company.findOne({ slug: identifier.toLowerCase() });
    }

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company profile not found.'
      });
    }

    // Fetch active jobs/internships for this company
    const opportunities = await Job.find({ company: company._id, status: 'Active' })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      company: {
        ...company.toObject(),
        opportunities
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get distinct company industries for filtering
// @route   GET /api/companies/meta/industries
// @access  Public
const getIndustries = async (req, res, next) => {
  try {
    const industries = await Company.distinct('industry');
    res.json({
      success: true,
      industries: industries.sort()
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create or update recruiter's company profile
// @route   PUT /api/companies/my-company
// @access  Private (Recruiter)
const updateMyCompany = async (req, res, next) => {
  try {
    const { name, industry, description, website, headquarters, employeeCount, logoUrl } = req.body;

    let company;
    if (req.user.company) {
      company = await Company.findById(req.user.company);
    }

    if (!company) {
      // Create new company
      company = new Company({
        name,
        industry: industry || 'Technology',
        description,
        website,
        headquarters,
        employeeCount,
        logoUrl,
        recruiter: req.user._id,
        isDemo: false
      });
      await company.save();

      req.user.company = company._id;
      await req.user.save();
    } else {
      // Update existing
      if (name) company.name = name;
      if (industry) company.industry = industry;
      if (description) company.description = description;
      if (website !== undefined) company.website = website;
      if (headquarters !== undefined) company.headquarters = headquarters;
      if (employeeCount !== undefined) company.employeeCount = employeeCount;
      if (logoUrl !== undefined) company.logoUrl = logoUrl;
      await company.save();
    }

    res.json({
      success: true,
      message: 'Company profile updated successfully.',
      company
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCompanies,
  getCompanyByIdOrSlug,
  getIndustries,
  updateMyCompany
};
