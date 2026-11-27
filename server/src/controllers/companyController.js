const Company = require('../models/Company');
const Job = require('../models/Job');
const { escapeRegex, asString, sanitizeHttpUrl } = require('../utils/helpers');

// @desc    Get all companies with search, industry filter, and pagination
// @route   GET /api/companies
// @access  Public
const getCompanies = async (req, res, next) => {
  try {
    const { search, industry, page = 1, limit = 12 } = req.query;
    const query = {};

    const safeSearch = asString(search).trim();
    const safeIndustry = asString(industry);

    if (safeSearch !== '') {
      query.name = { $regex: escapeRegex(safeSearch), $options: 'i' };
    }

    if (safeIndustry && safeIndustry !== 'All') {
      query.industry = safeIndustry;
    }

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10) || 12));
    const skip = (pageNum - 1) * limitNum;

    const total = await Company.countDocuments(query);
    const companies = await Company.find(query)
      .sort({ name: 1 })
      .skip(skip)
      .limit(limitNum);

    const now = new Date();
    const companyIds = companies.map((c) => c._id);
    const jobCounts = await Job.aggregate([
      {
        $match: {
          company: { $in: companyIds },
          status: 'Active',
          $or: [
            { deadline: { $gte: now } },
            { deadline: null },
            { deadline: { $exists: false } }
          ]
        }
      },
      { $group: { _id: '$company', count: { $sum: 1 } } }
    ]);

    const countMap = {};
    jobCounts.forEach((item) => {
      countMap[item._id.toString()] = item.count;
    });

    const enrichedCompanies = companies.map((comp) => ({
      ...comp.toObject(),
      activeJobsCount: countMap[comp._id.toString()] || 0
    }));

    res.json({
      success: true,
      total,
      page: pageNum,
      pages: Math.max(1, Math.ceil(total / limitNum)),
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

    const now = new Date();
    const opportunities = await Job.find({
      company: company._id,
      status: 'Active',
      $or: [
        { deadline: { $gte: now } },
        { deadline: null },
        { deadline: { $exists: false } }
      ]
    }).sort({ createdAt: -1 });

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
// @access  Private (Recruiter / Admin)
const updateMyCompany = async (req, res, next) => {
  try {
    const { name, industry, description, website, headquarters, employeeCount, logoUrl } = req.body;

    const cleanWebsite = sanitizeHttpUrl(website);
    if (!cleanWebsite.valid) {
      return res.status(400).json({ success: false, message: 'Website must be a valid http:// or https:// URL.' });
    }
    const cleanLogoUrl = sanitizeHttpUrl(logoUrl);
    if (!cleanLogoUrl.valid) {
      return res.status(400).json({ success: false, message: 'Logo URL must be a valid http:// or https:// URL.' });
    }

    let company;
    if (req.user.company) {
      company = await Company.findById(req.user.company);
    }

    if (!company) {
      if (!name || !name.trim() || !description || !description.trim()) {
        return res.status(400).json({
          success: false,
          message: 'Please provide company name and description.'
        });
      }
      company = new Company({
        name: name.trim(),
        industry: industry?.trim() || 'Technology',
        description: description.trim(),
        website: website?.trim() || '',
        headquarters: headquarters?.trim() || 'India',
        employeeCount: employeeCount?.trim() || '50+',
        logoUrl: logoUrl?.trim() || '',
        recruiter: req.user._id,
        isDemo: false
      });
      await company.save();

      req.user.company = company._id;
      await req.user.save();
    } else {
      if (name && name.trim()) company.name = name.trim();
      if (industry && industry.trim()) company.industry = industry.trim();
      if (description && description.trim()) company.description = description.trim();
      if (website !== undefined) company.website = String(website).trim();
      if (headquarters !== undefined) company.headquarters = String(headquarters).trim();
      if (employeeCount !== undefined) company.employeeCount = String(employeeCount).trim();
      if (logoUrl !== undefined) company.logoUrl = String(logoUrl).trim();
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
