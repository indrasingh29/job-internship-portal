const User = require('../models/User');
const Company = require('../models/Company');
const Job = require('../models/Job');
const Application = require('../models/Application');
const SavedJob = require('../models/SavedJob');

// @desc    Get public metrics for landing page
// @route   GET /api/stats/public
// @access  Public
const getPublicStats = async (req, res, next) => {
  try {
    const now = new Date();
    const activeFilter = {
      status: 'Active',
      $or: [
        { deadline: { $gte: now } },
        { deadline: null },
        { deadline: { $exists: false } }
      ]
    };

    const [totalJobs, totalInternships, totalCompanies, totalApplications] = await Promise.all([
      Job.countDocuments({ ...activeFilter, opportunityType: 'Job' }),
      Job.countDocuments({ ...activeFilter, opportunityType: 'Internship' }),
      Company.countDocuments(),
      Application.countDocuments()
    ]);

    res.json({
      success: true,
      stats: {
        totalJobs,
        totalInternships,
        totalCompanies,
        totalApplications
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get student dashboard metrics & profile completion
// @route   GET /api/stats/student
// @access  Private (Student)
const getStudentStats = async (req, res, next) => {
  try {
    const studentId = req.user._id;

    const [applications, savedRecords] = await Promise.all([
      Application.find({ student: studentId }).populate({
        path: 'job',
        populate: { path: 'company', select: 'name logoUrl' }
      }).sort({ createdAt: -1 }),
      SavedJob.find({ student: studentId }).populate('job', '_id')
    ]);

    const savedCount = savedRecords.filter((s) => Boolean(s.job)).length;
    const totalApplied = applications.length;
    let pendingCount = 0;
    let shortlistedCount = 0;
    let rejectedCount = 0;
    let selectedCount = 0;

    applications.forEach((app) => {
      if (app.status === 'Applied') pendingCount++;
      else if (app.status === 'Shortlisted') shortlistedCount++;
      else if (app.status === 'Rejected') rejectedCount++;
      else if (app.status === 'Selected') selectedCount++;
    });

    const p = req.user.profile || {};
    let points = 0;
    const totalPoints = 6;
    if (req.user.name) points += 1;
    if (p.headline || p.bio) points += 1;
    if (p.phone) points += 1;
    if (p.skills && p.skills.length > 0) points += 1;
    if (p.education && p.education.length > 0) points += 1;
    if (p.resumeUrl) points += 1;

    const profileCompletion = Math.round((points / totalPoints) * 100);

    res.json({
      success: true,
      stats: {
        profileCompletion,
        totalApplied,
        pendingCount,
        shortlistedCount,
        rejectedCount,
        selectedCount,
        savedCount,
        recentApplications: applications.slice(0, 5)
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get recruiter dashboard metrics & chart data
// @route   GET /api/stats/recruiter
// @access  Private (Recruiter / Admin)
const getRecruiterStats = async (req, res, next) => {
  try {
    const recruiterId = req.user._id;

    const myJobs = await Job.find({ recruiter: recruiterId });
    const jobIds = myJobs.map((j) => j._id);

    const totalPostings = myJobs.length;
    const activePostings = myJobs.filter((j) => j.status === 'Active').length;
    const closedPostings = totalPostings - activePostings;

    const allApplications = await Application.find({ job: { $in: jobIds } })
      .populate('job', 'title opportunityType')
      .populate('student', 'name email profile')
      .sort({ createdAt: -1 });

    const totalApplicants = allApplications.length;
    const shortlistedCount = allApplications.filter((a) => a.status === 'Shortlisted').length;
    const selectedCount = allApplications.filter((a) => a.status === 'Selected').length;
    const rejectedCount = allApplications.filter((a) => a.status === 'Rejected').length;
    const pendingCount = allApplications.filter((a) => a.status === 'Applied').length;

    const statusDistribution = [
      { name: 'Applied', value: pendingCount },
      { name: 'Shortlisted', value: shortlistedCount },
      { name: 'Selected', value: selectedCount },
      { name: 'Rejected', value: rejectedCount }
    ];

    const jobApplicantMap = {};
    allApplications.forEach((a) => {
      const title = a.job?.title || 'Unknown Role';
      jobApplicantMap[title] = (jobApplicantMap[title] || 0) + 1;
    });

    const jobApplicationsData = Object.keys(jobApplicantMap).slice(0, 6).map((title) => ({
      role: title.length > 20 ? title.substring(0, 20) + '...' : title,
      applicants: jobApplicantMap[title]
    }));

    res.json({
      success: true,
      stats: {
        totalPostings,
        activePostings,
        closedPostings,
        totalApplicants,
        shortlistedCount,
        selectedCount,
        pendingCount,
        rejectedCount,
        recentApplicants: allApplications.slice(0, 6),
        statusDistribution,
        jobApplicationsData
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get administrator platform-wide metrics
// @route   GET /api/stats/admin
// @access  Private (Admin)
const getAdminStats = async (req, res, next) => {
  try {
    const [
      totalUsers,
      totalStudents,
      totalRecruiters,
      totalCompanies,
      totalJobs,
      totalInternships,
      activeListings,
      totalApplications
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: 'student' }),
      User.countDocuments({ role: 'recruiter' }),
      Company.countDocuments(),
      Job.countDocuments({ opportunityType: 'Job' }),
      Job.countDocuments({ opportunityType: 'Internship' }),
      Job.countDocuments({ status: 'Active' }),
      Application.countDocuments()
    ]);

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalStudents,
        totalRecruiters,
        totalCompanies,
        totalJobs,
        totalInternships,
        activeListings,
        totalApplications
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPublicStats,
  getStudentStats,
  getRecruiterStats,
  getAdminStats
};
