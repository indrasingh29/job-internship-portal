const User = require('../models/User');
const Job = require('../models/Job');
const Application = require('../models/Application');
const SavedJob = require('../models/SavedJob');
const { escapeRegex, asString } = require('../utils/helpers');

// @desc    Get all users with search, role filter, and pagination
// @route   GET /api/admin/users
// @access  Private (Admin)
const getAllUsers = async (req, res, next) => {
  try {
    const { search, role, status, page = 1, limit = 15 } = req.query;
    const query = {};

    const safeRole = asString(role);
    const safeStatus = asString(status);
    const safeSearch = asString(search).trim();

    if (safeRole && safeRole !== 'All') {
      query.role = safeRole;
    }

    if (safeStatus && safeStatus !== 'All') {
      query.isActive = safeStatus === 'Active';
    }

    if (safeSearch !== '') {
      const escapedSearch = escapeRegex(safeSearch);
      query.$or = [
        { name: { $regex: escapedSearch, $options: 'i' } },
        { email: { $regex: escapedSearch, $options: 'i' } }
      ];
    }

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10) || 15));
    const skip = (pageNum - 1) * limitNum;

    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .populate('company', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    res.json({
      success: true,
      total,
      page: pageNum,
      pages: Math.max(1, Math.ceil(total / limitNum)),
      count: users.length,
      users
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle user active/deactivated status
// @route   PUT /api/admin/users/:id/toggle-status
// @access  Private (Admin)
const toggleUserStatus = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (req.user._id.toString() === id) {
      return res.status(400).json({
        success: false,
        message: 'You cannot deactivate your own administrator account.'
      });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.'
      });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.json({
      success: true,
      message: `User account has been ${user.isActive ? 'activated' : 'deactivated'}.`,
      isActive: user.isActive
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a user and clean up associated records
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin)
const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (req.user._id.toString() === id) {
      return res.status(400).json({
        success: false,
        message: 'You cannot delete your own administrator account.'
      });
    }

    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.'
      });
    }

    const recruiterJobs = await Job.find({ recruiter: id }).select('_id');
    const recruiterJobIds = recruiterJobs.map((j) => j._id);

    await Promise.all([
      Application.deleteMany({
        $or: [
          { student: id },
          ...(recruiterJobIds.length > 0 ? [{ job: { $in: recruiterJobIds } }] : [])
        ]
      }),
      SavedJob.deleteMany({
        $or: [
          { student: id },
          ...(recruiterJobIds.length > 0 ? [{ job: { $in: recruiterJobIds } }] : [])
        ]
      }),
      Job.deleteMany({ recruiter: id })
    ]);

    res.json({
      success: true,
      message: 'User and all associated records deleted successfully.'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all jobs for admin moderation
// @route   GET /api/admin/jobs
// @access  Private (Admin)
const getAllJobsAdmin = async (req, res, next) => {
  try {
    const { search, status, opportunityType, page = 1, limit = 15 } = req.query;
    const query = {};

    const safeStatus = asString(status);
    const safeType = asString(opportunityType);
    const safeSearch = asString(search).trim();

    if (safeStatus && safeStatus !== 'All') {
      query.status = safeStatus;
    }

    if (safeType && safeType !== 'All') {
      query.opportunityType = safeType;
    }

    if (safeSearch !== '') {
      query.title = { $regex: escapeRegex(safeSearch), $options: 'i' };
    }

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10) || 15));
    const skip = (pageNum - 1) * limitNum;

    const total = await Job.countDocuments(query);
    const jobs = await Job.find(query)
      .populate('company', 'name')
      .populate('recruiter', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    res.json({
      success: true,
      total,
      page: pageNum,
      pages: Math.max(1, Math.ceil(total / limitNum)),
      jobs
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllUsers,
  toggleUserStatus,
  deleteUser,
  getAllJobsAdmin
};
