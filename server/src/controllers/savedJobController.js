const SavedJob = require('../models/SavedJob');
const Job = require('../models/Job');

// @desc    Bookmark / save an opportunity
// @route   POST /api/saved-jobs/:jobId
// @access  Private (Student)
const saveJob = async (req, res, next) => {
  try {
    const { jobId } = req.params;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Opportunity not found.' });
    }

    const existing = await SavedJob.findOne({ student: req.user._id, job: jobId });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Opportunity is already saved.' });
    }

    await SavedJob.create({
      student: req.user._id,
      job: jobId
    });

    res.status(201).json({
      success: true,
      message: 'Opportunity saved to bookmarks.'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove an opportunity from bookmarks
// @route   DELETE /api/saved-jobs/:jobId
// @access  Private (Student)
const unsaveJob = async (req, res, next) => {
  try {
    const { jobId } = req.params;

    const deleted = await SavedJob.findOneAndDelete({
      student: req.user._id,
      job: jobId
    });

    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Saved opportunity not found.' });
    }

    res.json({
      success: true,
      message: 'Opportunity removed from bookmarks.'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all saved opportunities for student
// @route   GET /api/saved-jobs
// @access  Private (Student)
const getSavedJobs = async (req, res, next) => {
  try {
    const saved = await SavedJob.find({ student: req.user._id })
      .populate({
        path: 'job',
        populate: { path: 'company', select: 'name logoUrl headquarters industry' }
      })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: saved.length,
      savedJobs: saved.map(s => s.job).filter(Boolean)
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Check if a specific job is saved
// @route   GET /api/saved-jobs/check/:jobId
// @access  Private (Student)
const checkSaved = async (req, res, next) => {
  try {
    const { jobId } = req.params;
    const exists = await SavedJob.exists({ student: req.user._id, job: jobId });
    res.json({
      success: true,
      isSaved: !!exists
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  saveJob,
  unsaveJob,
  getSavedJobs,
  checkSaved
};
