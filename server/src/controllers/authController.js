const crypto = require('crypto');
const User = require('../models/User');
const Company = require('../models/Company');
const { signToken } = require('../config/jwt');
const { sendPasswordResetEmail } = require('../utils/emailService');
const { normalizeStringArray } = require('../utils/helpers');

const formatUserPayload = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  profile: user.profile,
  company: user.company,
  createdAt: user.createdAt
});

// @desc    Register a new student or recruiter
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res, next) => {
  try {
    const { name, email, password, role, companyName, industry } = req.body;

    if (!name || !name.trim() || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password.'
      });
    }

    if (String(password).length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters.'
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    // Strict security check: Prevent registering as 'admin' via public endpoint
    const safeRole = role === 'recruiter' ? 'recruiter' : 'student';

    if (safeRole === 'recruiter' && (!companyName || !companyName.trim())) {
      return res.status(400).json({
        success: false,
        message: 'Please provide your company or organization name.'
      });
    }

    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email address already exists.'
      });
    }

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password,
      role: safeRole
    });

    if (safeRole === 'recruiter' && companyName) {
      const trimmedCompany = companyName.trim();
      let company = await Company.findOne({ name: trimmedCompany });
      if (!company) {
        company = await Company.create({
          name: trimmedCompany,
          industry: industry?.trim() || 'Information Technology',
          description: `${trimmedCompany} hires talented students and professionals on JobPortal.`,
          recruiter: user._id,
          isDemo: false
        });
      }
      user.company = company._id;
      await user.save();
    }

    const populatedUser = await User.findById(user._id).populate('company');
    const token = signToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Account created successfully.',
      token,
      user: formatUserPayload(populatedUser)
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

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail }).select('+password').populate('company');

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

    const token = signToken(user._id);

    res.json({
      success: true,
      message: 'Logged in successfully.',
      token,
      user: formatUserPayload(user)
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
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }
    res.json({
      success: true,
      user: formatUserPayload(user)
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

    const {
      name,
      headline,
      bio,
      phone,
      location,
      skills,
      education,
      resumeUrl,
      experienceLevel,
      githubUrl,
      linkedinUrl,
      portfolioUrl
    } = req.body;

    if (name && name.trim()) {
      user.name = name.trim();
    }

    const currentProfile = user.profile ? user.profile.toObject() : {};

    let sanitizedEducation = currentProfile.education || [];
    if (Array.isArray(education)) {
      sanitizedEducation = education
        .filter((ed) => ed && (ed.degree?.trim() || ed.institution?.trim()))
        .map((ed) => ({
          degree: ed.degree?.trim() || '',
          institution: ed.institution?.trim() || '',
          yearOfCompletion: ed.yearOfCompletion?.trim() || '',
          score: ed.score?.trim() || ''
        }));
    }

    user.profile = {
      ...currentProfile,
      headline: headline !== undefined ? String(headline).trim() : currentProfile.headline,
      bio: bio !== undefined ? String(bio).trim() : currentProfile.bio,
      phone: phone !== undefined ? String(phone).trim() : currentProfile.phone,
      location: location !== undefined ? String(location).trim() : currentProfile.location,
      skills: skills !== undefined ? normalizeStringArray(skills, ',') : (currentProfile.skills || []),
      education: sanitizedEducation,
      resumeUrl: resumeUrl !== undefined ? String(resumeUrl).trim() : currentProfile.resumeUrl,
      experienceLevel: experienceLevel !== undefined ? String(experienceLevel).trim() : currentProfile.experienceLevel,
      githubUrl: githubUrl !== undefined ? String(githubUrl).trim() : currentProfile.githubUrl,
      linkedinUrl: linkedinUrl !== undefined ? String(linkedinUrl).trim() : currentProfile.linkedinUrl,
      portfolioUrl: portfolioUrl !== undefined ? String(portfolioUrl).trim() : currentProfile.portfolioUrl
    };

    await user.save();
    const updatedUser = await User.findById(user._id).populate('company');

    res.json({
      success: true,
      message: 'Profile updated successfully.',
      user: formatUserPayload(updatedUser)
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Change password for authenticated user
// @route   PUT /api/auth/change-password
// @access  Private
const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both your current password and a new password.'
      });
    }

    if (String(newPassword).length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters long.'
      });
    }

    if (confirmPassword !== undefined && newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'New password and confirmation password do not match.'
      });
    }

    const user = await User.findById(req.user._id).select('+password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const isCurrentMatch = await user.comparePassword(currentPassword);
    if (!isCurrentMatch) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect.'
      });
    }

    if (currentPassword === newPassword) {
      return res.status(400).json({
        success: false,
        message: 'New password must be different from your current password.'
      });
    }

    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: 'Password changed successfully.'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Request password reset link
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address.'
      });
    }

    const genericSuccessMessage =
      'If an account with that email exists, a password reset link has been sent.';

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user || !user.isActive) {
      return res.json({
        success: true,
        message: genericSuccessMessage
      });
    }

    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    const clientBaseUrl = (
      process.env.CLIENT_URL ||
      req.headers.origin ||
      'http://localhost:5173'
    ).replace(/\/$/, '');
    const resetUrl = `${clientBaseUrl}/reset-password/${resetToken}`;

    try {
      await sendPasswordResetEmail({
        to: user.email,
        name: user.name,
        resetUrl
      });

      return res.json({
        success: true,
        message: genericSuccessMessage
      });
    } catch (emailErr) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save({ validateBeforeSave: false });
      console.error(`[Auth] Failed to deliver password reset email: ${emailErr.message}`);

      return res.status(500).json({
        success: false,
        message: 'Unable to send password reset email right now. Please try again later.'
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Validate password reset token before showing reset form
// @route   GET /api/auth/reset-password/:token
// @access  Public
const verifyResetToken = async (req, res, next) => {
  try {
    const { token } = req.params;
    if (!token || !/^[a-f0-9]{64}$/i.test(token)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired password reset link.'
      });
    }

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() }
    }).select('_id');

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'This password reset link is invalid or has expired.'
      });
    }

    res.json({
      success: true,
      message: 'Reset token is valid.'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reset password with valid single-use token
// @route   POST /api/auth/reset-password/:token
// @access  Public
const resetPassword = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { password, confirmPassword } = req.body;

    if (!token || !/^[a-f0-9]{64}$/i.test(token)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired password reset token.'
      });
    }

    if (!password || String(password).length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.'
      });
    }

    if (confirmPassword !== undefined && password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match.'
      });
    }

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() }
    }).select('+password +resetPasswordToken +resetPasswordExpire');

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Password reset token is invalid or has expired.'
      });
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.json({
      success: true,
      message: 'Your password has been reset successfully. You can now sign in.'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getMe,
  updateProfile,
  changePassword,
  forgotPassword,
  verifyResetToken,
  resetPassword
};
