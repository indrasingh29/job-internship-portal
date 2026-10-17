const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: [true, 'Job reference is required']
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Student applicant reference is required']
  },
  coverLetter: {
    type: String,
    trim: true,
    maxlength: [2000, 'Cover letter cannot exceed 2000 characters'],
    default: ''
  },
  resumeUrl: {
    type: String,
    trim: true,
    default: ''
  },
  status: {
    type: String,
    enum: {
      values: ['Applied', 'Shortlisted', 'Rejected', 'Selected'],
      message: 'Status must be Applied, Shortlisted, Rejected, or Selected'
    },
    default: 'Applied'
  },
  recruiterNotes: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Ensure a student can only apply ONCE to a specific opportunity
applicationSchema.index({ job: 1, student: 1 }, { unique: true });
applicationSchema.index({ student: 1, createdAt: -1 });

module.exports = mongoose.model('Application', applicationSchema);
