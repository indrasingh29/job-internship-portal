const Job = require('../models/Job');
const Company = require('../models/Company');
const Application = require('../models/Application');

// @desc    Get all jobs/internships with search, filters, pagination, and sorting
// @route   GET /api/jobs
// @access  Public
const getJobs = async (req, res, next) => {
  try {
    const {
      opportunityType,
      search,
      location,
      workplaceType,
      isFresherEligible,
      category,
      jobType,
      companyId,
      sort = 'latest',
      page = 1,
      limit = 10
    } = req.query;

    const query = { status: 'Active' };

    if (opportunityType && opportunityType !== 'All') {
      query.opportunityType = opportunityType;
    }

    if (companyId) {
      query.company = companyId;
    }

    if (category && category !== 'All') {
      query.category = category;
    }

    if (workplaceType && workplaceType !== 'All') {
      query.workplaceType = workplaceType;
    }

    if (jobType && jobType !== 'All') {
      query.jobType = jobType;
    }

    if (isFresherEligible === 'true') {
      query.isFresherEligible = true;
    }

    if (location && location.trim() !== '') {
      query.location = { $regex: location.trim(), $options: 'i' };
    }

    if (search && search.trim() !== '') {
      const term = search.trim();
      const matchingCompanies = await Company.find({
        name: { $regex: term, $options: 'i' }
      }).select('_id');
      const companyIds = matchingCompanies.map(c => c._id);

      query.$or = [
        { title: { $regex: term, $options: 'i' } },
        { requiredSkills: { $regex: term, $options: 'i' } },
        { description: { $regex: term, $options: 'i' } },
        ...(companyIds.length > 0 ? [{ company: { $in: companyIds } }] : [])
      ];
    }

    // Sorting strategy
    let sortOptions = { createdAt: -1 };
    if (sort === 'salary_high') {
      sortOptions = { salaryMax: -1, stipendAmount: -1 };
    } else if (sort === 'salary_low') {
      sortOptions = { salaryMin: 1, stipendAmount: 1 };
    } else if (sort === 'deadline') {
      sortOptions = { deadline: 1 };
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    const skip = (pageNum - 1) * limitNum;

    const total = await Job.countDocuments(query);
    const jobs = await Job.find(query)
      .populate('company', 'name slug industry logoUrl headquarters isDemo')
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum);

    res.json({
      success: true,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      count: jobs.length,
      jobs
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single job / internship by ID
// @route   GET /api/jobs/:id
// @access  Public
const getJobById = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('company', 'name slug industry description website logoUrl headquarters employeeCount isDemo')
      .populate('recruiter', 'name email');

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Opportunity not found.'
      });
    }

    // Increment views count non-blockingly
    job.viewsCount = (job.viewsCount || 0) + 1;
    await job.save();

    res.json({
      success: true,
      job
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new job / internship opportunity
// @route   POST /api/jobs
// @access  Private (Recruiter)
const createJob = async (req, res, next) => {
  try {
    let companyId = req.user.company;

    if (!companyId) {
      // If recruiter hasn't registered a company yet, create a default profile
      const defaultCompany = await Company.create({
        name: `${req.user.name}'s Organization`,
        industry: 'Technology',
        description: 'Technology solutions and hiring organization.',
        recruiter: req.user._id,
        isDemo: false
      });
      companyId = defaultCompany._id;
      req.user.company = companyId;
      await req.user.save();
    }

    const {
      title,
      opportunityType,
      jobType,
      workplaceType,
      location,
      category,
      description,
      responsibilities,
      requirements,
      requiredSkills,
      experienceLevel,
      isFresherEligible,
      salaryMin,
      salaryMax,
      stipendAmount,
      openings,
      deadline
    } = req.body;

    const job = await Job.create({
      title,
      company: companyId,
      recruiter: req.user._id,
      opportunityType: opportunityType || 'Job',
      jobType: jobType || 'Full-time',
      workplaceType: workplaceType || 'Onsite',
      location: location || 'Bangalore, India',
      category: category || 'Software Engineering',
      description,
      responsibilities: Array.isArray(responsibilities) ? responsibilities : (responsibilities ? responsibilities.split('\n') : []),
      requirements: Array.isArray(requirements) ? requirements : (requirements ? requirements.split('\n') : []),
      requiredSkills: Array.isArray(requiredSkills) ? requiredSkills : (requiredSkills ? requiredSkills.split(',').map(s => s.trim()) : []),
      experienceLevel: experienceLevel || 'Fresher / Entry Level',
      isFresherEligible: isFresherEligible !== undefined ? isFresherEligible : true,
      salaryMin: salaryMin || 0,
      salaryMax: salaryMax || 0,
      stipendAmount: stipendAmount || 0,
      openings: openings || 1,
      deadline: deadline ? new Date(deadline) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      isDemo: false
    });

    res.status(201).json({
      success: true,
      message: 'Opportunity posted successfully!',
      job
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update an opportunity
// @route   PUT /api/jobs/:id
// @access  Private (Recruiter / Admin)
const updateJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Opportunity not found.'
      });
    }

    // Check ownership: Must be the creating recruiter or an admin
    if (!job.recruiter.equals(req.user._id) && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: You can only edit your own postings.'
      });
    }

    const updatedJob = await Job.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    ).populate('company');

    res.json({
      success: true,
      message: 'Opportunity updated successfully.',
      job: updatedJob
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete an opportunity
// @route   DELETE /api/jobs/:id
// @access  Private (Recruiter / Admin)
const deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Opportunity not found.'
      });
    }

    // Check ownership or admin
    if (!job.recruiter.equals(req.user._id) && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: You can only delete your own postings.'
      });
    }

    await Job.findByIdAndDelete(req.params.id);
    // Remove related applications
    await Application.deleteMany({ job: req.params.id });

    res.json({
      success: true,
      message: 'Opportunity and associated applications removed successfully.'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all jobs posted by currently logged in recruiter
// @route   GET /api/jobs/recruiter/my-postings
// @access  Private (Recruiter)
const getRecruiterJobs = async (req, res, next) => {
  try {
    const jobs = await Job.find({ recruiter: req.user._id })
      .populate('company', 'name logoUrl')
      .sort({ createdAt: -1 });

    // Aggregate applicant counts for each posting
    const jobIds = jobs.map(j => j._id);
    const applicantCounts = await Application.aggregate([
      { $match: { job: { $in: jobIds } } },
      { $group: { _id: '$job', count: { $sum: 1 } } }
    ]);

    const countMap = {};
    applicantCounts.forEach(item => {
      countMap[item._id.toString()] = item.count;
    });

    const enriched = jobs.map(j => ({
      ...j.toObject(),
      applicantCount: countMap[j._id.toString()] || 0
    }));

    res.json({
      success: true,
      count: enriched.length,
      jobs: enriched
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  getRecruiterJobs
};
