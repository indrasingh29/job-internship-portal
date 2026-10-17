const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide the opportunity title'],
    trim: true,
    maxlength: [150, 'Title cannot exceed 150 characters']
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: [true, 'Please specify the associated company']
  },
  recruiter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please specify the recruiter']
  },
  opportunityType: {
    type: String,
    enum: ['Job', 'Internship'],
    required: [true, 'Opportunity type must be Job or Internship'],
    default: 'Job'
  },
  jobType: {
    type: String,
    enum: ['Full-time', 'Part-time', 'Contract', 'Internship'],
    default: 'Full-time'
  },
  workplaceType: {
    type: String,
    enum: ['Remote', 'Hybrid', 'Onsite'],
    default: 'Onsite'
  },
  location: {
    type: String,
    required: [true, 'Please specify the location'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Please specify the domain category'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please provide a detailed job description'],
    trim: true
  },
  responsibilities: [{
    type: String,
    trim: true
  }],
  requirements: [{
    type: String,
    trim: true
  }],
  requiredSkills: [{
    type: String,
    trim: true
  }],
  experienceLevel: {
    type: String,
    default: 'Fresher / Entry Level'
  },
  isFresherEligible: {
    type: Boolean,
    default: true
  },
  salaryMin: {
    type: Number,
    default: 0
  },
  salaryMax: {
    type: Number,
    default: 0
  },
  stipendAmount: {
    type: Number,
    default: 0
  },
  openings: {
    type: Number,
    default: 1,
    min: [1, 'Openings must be at least 1']
  },
  deadline: {
    type: Date,
    required: [true, 'Please specify an application deadline']
  },
  status: {
    type: String,
    enum: ['Active', 'Closed'],
    default: 'Active'
  },
  isDemo: {
    type: Boolean,
    default: true
  },
  viewsCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Indexes for fast searching & filtering
jobSchema.index({ title: 'text', description: 'text', requiredSkills: 'text' });
jobSchema.index({ opportunityType: 1, status: 1 });
jobSchema.index({ company: 1 });
jobSchema.index({ recruiter: 1 });

module.exports = mongoose.model('Job', jobSchema);
