const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide the company name'],
    unique: true,
    trim: true,
    maxlength: [120, 'Company name cannot exceed 120 characters']
  },
  slug: {
    type: String,
    lowercase: true,
    trim: true
  },
  industry: {
    type: String,
    required: [true, 'Please specify the industry sector'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please provide a company description'],
    trim: true
  },
  website: {
    type: String,
    default: ''
  },
  logoUrl: {
    type: String,
    default: ''
  },
  headquarters: {
    type: String,
    default: 'Bangalore, India'
  },
  employeeCount: {
    type: String,
    default: '1000+'
  },
  recruiter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  isDemo: {
    type: Boolean,
    default: true
  },
  isVerified: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

companySchema.pre('save', function (next) {
  if (this.isModified('name')) {
    this.slug = this.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  }
  next();
});

module.exports = mongoose.model('Company', companySchema);
