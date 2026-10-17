const Application = require('../models/Application');
const Job = require('../models/Job');

// @desc    Apply for a job / internship
// @route   POST /api/applications/apply/:jobId
// @access  Private (Student)
const applyJob = async (req, res, next) => {
  try {
    const { jobId } = req.params;
    const { coverLetter, resumeUrl } = req.body;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Opportunity not found.'
      });
    }

    if (job.status !== 'Active') {
      return res.status(400).json({
        success: false,
        message: 'This opportunity is closed and is no longer accepting applications.'
      });
    }

    if (new Date(job.deadline) < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'The application deadline for this opportunity has passed.'
      });
    }

    // Check if already applied
    const existing = await Application.findOne({
      job: jobId,
      student: req.user._id
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'You have already submitted an application for this opportunity.'
      });
    }

    const application = await Application.create({
      job: jobId,
      student: req.user._id,
      coverLetter: coverLetter || '',
      resumeUrl: resumeUrl || req.user.profile?.resumeUrl || '',
      status: 'Applied'
    });

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully!',
      application
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all applications submitted by the logged-in student
// @route   GET /api/applications/my-applications
// @access  Private (Student)
const getStudentApplications = async (req, res, next) => {
  try {
    const applications = await Application.find({ student: req.user._id })
      .populate({
        path: 'job',
        populate: { path: 'company', select: 'name logoUrl headquarters industry' }
      })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: applications.length,
      applications
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get applicants for a specific job (Recruiter view)
// @route   GET /api/applications/job/:jobId
// @access  Private (Recruiter)
const getJobApplicants = async (req, res, next) => {
  try {
    const { jobId } = req.params;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Opportunity not found.'
      });
    }

    // Ensure the recruiter owns the job or is admin
    if (!job.recruiter.equals(req.user._id) && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: You can only view applicants for your own listings.'
      });
    }

    const applicants = await Application.find({ job: jobId })
      .populate('student', 'name email profile createdAt')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      jobTitle: job.title,
      count: applicants.length,
      applicants
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update applicant status (Shortlist, Reject, Select)
// @route   PUT /api/applications/:applicationId/status
// @access  Private (Recruiter)
const updateApplicationStatus = async (req, res, next) => {
  try {
    const { applicationId } = req.params;
    const { status, recruiterNotes } = req.body;

    const validStatuses = ['Applied', 'Shortlisted', 'Rejected', 'Selected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      });
    }

    const application = await Application.findById(applicationId).populate('job');
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found.'
      });
    }

    // Verify recruiter owns the job
    if (!application.job.recruiter.equals(req.user._id) && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: You can only manage applications for your own listings.'
      });
    }

    application.status = status;
    if (recruiterNotes !== undefined) {
      application.recruiterNotes = recruiterNotes;
    }

    await application.save();

    res.json({
      success: true,
      message: `Application status updated to '${status}'.`,
      application
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  applyJob,
  getStudentApplications,
  getJobApplicants,
  updateApplicationStatus
};
