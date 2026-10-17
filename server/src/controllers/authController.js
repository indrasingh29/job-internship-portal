const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Company = require('../models/Company');

// Helper to generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
};

// @desc    Register a new student or recruiter
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res, next) => {
  try {
    const { name, email, password, role, companyName, industry } = req.body;

    // Strict security check: Prevent registering as 'admin' via public endpoint
    const safeRole = role === 'recruiter' ? 'recruiter' : 'student';

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email address already exists.'
      });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role: safeRole
    });

    // If recruiter, check or create company
    if (safeRole === 'recruiter' && companyName) {
      let company = await Company.findOne({ name: companyName.trim() });
      if (!company) {
        company = await Company.create({
          name: companyName.trim(),
          industry: industry || 'Information Technology',
          description: `${companyName.trim()} is an employer on Job & Internship Portal.`,
          recruiter: user._id,
          isDemo: false
        });
      }
      user.company = company._id;
      await user.save();
    }

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Account created successfully.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profile: user.profile,
        company: user.company
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password.'
      });
    }

    // Fetch user with password field
    const user = await User.findOne({ email }).select('+password').populate('company');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Your account has been deactivated. Please contact support.'
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'Logged in successfully.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profile: user.profile,
        company: user.company
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get currently logged in user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate('company');
    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profile: user.profile,
        company: user.company,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const { name, headline, bio, phone, location, skills, education, resumeUrl, githubUrl, linkedinUrl, portfolioUrl } = req.body;

    if (name) user.name = name;

    user.profile = {
      ...user.profile,
      headline: headline !== undefined ? headline : user.profile.headline,
      bio: bio !== undefined ? bio : user.profile.bio,
      phone: phone !== undefined ? phone : user.profile.phone,
      location: location !== undefined ? location : user.profile.location,
      skills: Array.isArray(skills) ? skills : (skills ? skills.split(',').map(s => s.trim()) : user.profile.skills),
      education: education !== undefined ? education : user.profile.education,
      resumeUrl: resumeUrl !== undefined ? resumeUrl : user.profile.resumeUrl,
      githubUrl: githubUrl !== undefined ? githubUrl : user.profile.githubUrl,
      linkedinUrl: linkedinUrl !== undefined ? linkedinUrl : user.profile.linkedinUrl,
      portfolioUrl: portfolioUrl !== undefined ? portfolioUrl : user.profile.portfolioUrl
    };

    await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully.',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profile: user.profile,
        company: user.company
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getMe,
  updateProfile
};
