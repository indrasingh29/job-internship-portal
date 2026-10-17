const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const educationSchema = new mongoose.Schema({
  degree: { type: String, trim: true },
  institution: { type: String, trim: true },
  yearOfCompletion: { type: String, trim: true },
  score: { type: String, trim: true }
}, { _id: false });

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide your full name'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Please provide an email address'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email address']
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  role: {
    type: String,
    enum: {
      values: ['student', 'recruiter', 'admin'],
      message: 'Role must be student, recruiter, or admin'
    },
    default: 'student'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  profile: {
    headline: { type: String, default: '' },
    bio: { type: String, default: '' },
    phone: { type: String, default: '' },
    location: { type: String, default: '' },
    education: [educationSchema],
    skills: [{ type: String, trim: true }],
    resumeUrl: { type: String, default: '' },
    experienceLevel: { type: String, default: 'Fresher' },
    githubUrl: { type: String, default: '' },
    linkedinUrl: { type: String, default: '' },
    portfolioUrl: { type: String, default: '' }
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company'
  }
}, {
  timestamps: true
});

// Pre-save hook to hash password if modified
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Instance method to check password validity
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Remove password from JSON serialization
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model('User', userSchema);
