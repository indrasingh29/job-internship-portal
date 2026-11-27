const Job = require('../models/Job');
const Company = require('../models/Company');
const Application = require('../models/Application');
const SavedJob = require('../models/SavedJob');
const {
  escapeRegex,
  normalizeDeadlineEndOfDay,
  normalizeStringArray
} = require('../utils/helpers');

// @desc    Get all active non-expired jobs/internships with search, filters, pagination, and sorting
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
      minSalary,
      minStipend,
      sort = 'latest',
      page = 1,
      limit = 10
    } = req.query;

    const now = new Date();
    const andConditions = [
      { status: 'Active' },
      {
        $or: [
          { deadline: { $gte: now } },
          { deadline: null },
          { deadline: { $exists: false } }
        ]
      }
    ];

    if (opportunityType && opportunityType !== 'All') {
      andConditions.push({ opportunityType });
    }

    if (companyId) {
      andConditions.push({ company: companyId });
    }

    if (category && category !== 'All') {
      andConditions.push({ category });
    }

    if (workplaceType && workplaceType !== 'All') {
      andConditions.push({ workplaceType });
    }

    if (jobType && jobType !== 'All') {
      andConditions.push({ jobType });
    }

    if (isFresherEligible === 'true') {
      andConditions.push({ isFresherEligible: true });
    }

    if (minSalary && !Number.isNaN(Number(minSalary)) && Number(minSalary) > 0) {
      andConditions.push({ salaryMax: { $gte: Number(minSalary) } });
    }

    if (minStipend && !Number.isNaN(Number(minStipend)) && Number(minStipend) > 0) {
      andConditions.push({ stipendAmount: { $gte: Number(minStipend) } });
    }

    if (location && location.trim() !== '') {
      const safeLocation = escapeRegex(location.trim());
      andConditions.push({ location: { $regex: safeLocation, $options: 'i' } });
    }

    if (search && search.trim() !== '') {
      const safeTerm = escapeRegex(search.trim());
      const matchingCompanies = await Company.find({
        name: { $regex: safeTerm, $options: 'i' }
      }).select('_id');
      const companyIds = matchingCompanies.map((c) => c._id);

      andConditions.push({
        $or: [
          { title: { $regex: safeTerm, $options: 'i' } },
          { requiredSkills: { $regex: safeTerm, $options: 'i' } },
          { description: { $regex: safeTerm, $options: 'i' } },
          { category: { $regex: safeTerm, $options: 'i' } },
          ...(companyIds.length > 0 ? [{ company: { $in: companyIds } }] : [])
        ]
      });
    }

    const query = andConditions.length > 1 ? { $and: andConditions } : andConditions[0];

    let sortOptions = { createdAt: -1 };
    if (sort === 'salary_high') {
      sortOptions = { salaryMax: -1, stipendAmount: -1, createdAt: -1 };
    } else if (sort === 'salary_low') {
      sortOptions = { salaryMin: 1, stipendAmount: 1, createdAt: -1 };
    } else if (sort === 'deadline') {
      sortOptions = { deadline: 1, createdAt: -1 };
    }

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10) || 10));
    const skip = (pageNum - 1) * limitNum;

    const total = await Job.countDocuments(query);
    const jobs = await Job.find(query)
      .populate('company', 'name slug industry logoUrl headquarters')
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum);

    res.json({
      success: true,
      total,
      page: pageNum,
      pages: Math.max(1, Math.ceil(total / limitNum)),
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
    const job = await Job.findByIdAndUpdate(
      req.params.id,
      { $inc: { viewsCount: 1 } },
      { new: true }
    )
      .populate('company', 'name slug industry description website logoUrl headquarters employeeCount')
      .populate('recruiter', 'name email');

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Opportunity not found.'
      });
    }

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
// @access  Private (Recruiter / Admin)
const createJob = async (req, res, next) => {
  try {
    let companyId = req.user.company;

    if (!companyId) {
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

    if (!title || !title.trim() || !description || !description.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both a title and description for the opportunity.'
      });
    }

    const resolvedOpportunityType = opportunityType === 'Internship' ? 'Internship' : 'Job';
    const resolvedJobType =
      resolvedOpportunityType === 'Internship'
        ? (jobType === 'Part-time' || jobType === 'Internship' ? jobType : 'Internship')
        : (jobType && ['Full-time', 'Part-time', 'Contract'].includes(jobType) ? jobType : 'Full-time');

    const resolvedDeadline = normalizeDeadlineEndOfDay(deadline);
    if (!resolvedDeadline) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid application deadline date.'
      });
    }

    const job = await Job.create({
      title: title.trim(),
      company: companyId,
      recruiter: req.user._id,
      opportunityType: resolvedOpportunityType,
      jobType: resolvedJobType,
      workplaceType: workplaceType || 'Onsite',
      location: location?.trim() || 'Bangalore, India',
      category: category?.trim() || 'Software Engineering',
      description: description.trim(),
      responsibilities: normalizeStringArray(responsibilities, '\n'),
      requirements: normalizeStringArray(requirements, '\n'),
      requiredSkills: normalizeStringArray(requiredSkills, ','),
      experienceLevel: experienceLevel?.trim() || 'Fresher / Entry Level',
      isFresherEligible: isFresherEligible !== undefined ? Boolean(isFresherEligible) : true,
      salaryMin: Math.max(0, Number(salaryMin) || 0),
      salaryMax: Math.max(0, Number(salaryMax) || 0),
      stipendAmount: Math.max(0, Number(stipendAmount) || 0),
      openings: Math.max(1, parseInt(openings, 10) || 1),
      deadline: resolvedDeadline,
      status: 'Active',
      isDemo: false
    });

    await job.populate('company', 'name slug industry logoUrl headquarters');

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

    if (!job.recruiter.equals(req.user._id) && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: You can only edit your own postings.'
      });
    }

    const updates = {};
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
      deadline,
      status
    } = req.body;

    if (title !== undefined) updates.title = String(title).trim();
    if (opportunityType !== undefined) updates.opportunityType = opportunityType;
    if (jobType !== undefined) updates.jobType = jobType;
    if (workplaceType !== undefined) updates.workplaceType = workplaceType;
    if (location !== undefined) updates.location = String(location).trim();
    if (category !== undefined) updates.category = String(category).trim();
    if (description !== undefined) updates.description = String(description).trim();
    if (responsibilities !== undefined) updates.responsibilities = normalizeStringArray(responsibilities, '\n');
    if (requirements !== undefined) updates.requirements = normalizeStringArray(requirements, '\n');
    if (requiredSkills !== undefined) updates.requiredSkills = normalizeStringArray(requiredSkills, ',');
    if (experienceLevel !== undefined) updates.experienceLevel = String(experienceLevel).trim();
    if (isFresherEligible !== undefined) updates.isFresherEligible = Boolean(isFresherEligible);
    if (salaryMin !== undefined) updates.salaryMin = Math.max(0, Number(salaryMin) || 0);
    if (salaryMax !== undefined) updates.salaryMax = Math.max(0, Number(salaryMax) || 0);
    if (stipendAmount !== undefined) updates.stipendAmount = Math.max(0, Number(stipendAmount) || 0);
    if (openings !== undefined) updates.openings = Math.max(1, parseInt(openings, 10) || 1);
    if (status !== undefined) updates.status = status;
    if (deadline !== undefined) {
      const normalized = normalizeDeadlineEndOfDay(deadline);
      if (!normalized) {
        return res.status(400).json({
          success: false,
          message: 'Please provide a valid application deadline date.'
        });
      }
      updates.deadline = normalized;
    }

    const updatedJob = await Job.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    ).populate('company', 'name slug industry logoUrl headquarters');

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

    if (!job.recruiter.equals(req.user._id) && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: You can only delete your own postings.'
      });
    }

    await Job.findByIdAndDelete(req.params.id);
    await Promise.all([
      Application.deleteMany({ job: req.params.id }),
      SavedJob.deleteMany({ job: req.params.id })
    ]);

    res.json({
      success: true,
      message: 'Opportunity and associated records removed successfully.'
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

    const jobIds = jobs.map((j) => j._id);
    const applicantCounts = await Application.aggregate([
      { $match: { job: { $in: jobIds } } },
      { $group: { _id: '$job', count: { $sum: 1 } } }
    ]);

    const countMap = {};
    applicantCounts.forEach((item) => {
      countMap[item._id.toString()] = item.count;
    });

    const enriched = jobs.map((j) => ({
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
