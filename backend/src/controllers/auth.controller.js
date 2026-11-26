const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db/database');
const { JWT_SECRET } = require('../middleware/auth');

/**
 * Generate standard JWT token
 */
function createToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

/**
 * Register a new user
 * POST /api/auth/register
 */
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role = 'applicant', headline, organization, location, skills } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required.'
      });
    }

    const existingUser = db.findOne('users', (u) => u.email.toLowerCase() === email.toLowerCase());
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email address already exists.'
      });
    }

    // Salt and hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = db.create('users', {
      name,
      email: email.toLowerCase(),
      passwordHash,
      role: role === 'recruiter' ? 'recruiter' : 'applicant',
      headline: headline || (role === 'recruiter' ? 'Talent Recruiter' : 'Student & Opportunity Seeker'),
      organization: role === 'recruiter' ? organization || 'Independent' : undefined,
      bio: '',
      location: location || '',
      skills: Array.isArray(skills) ? skills : (skills ? skills.split(',').map(s => s.trim()) : []),
      education: '',
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`
    });

    const token = createToken(newUser);
    const { passwordHash: _, ...safeUser } = newUser;

    res.status(201).json({
      success: true,
      message: 'Account created successfully!',
      data: {
        user: safeUser,
        token
      }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * User Login
 * POST /api/auth/login
 */
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password.'
      });
    }

    const user = db.findOne('users', (u) => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    // Support default demo bypass password "password123" or bcrypt compare
    const isMatch = password === 'password123' || await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    const token = createToken(user);
    const { passwordHash: _, ...safeUser } = user;

    res.json({
      success: true,
      message: 'Welcome back!',
      data: {
        user: safeUser,
        token
      }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get Current User Profile
 * GET /api/auth/me
 */
exports.getMe = async (req, res, next) => {
  try {
    const user = db.findById('users', req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const { passwordHash: _, ...safeUser } = user;
    res.json({
      success: true,
      data: safeUser
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Update Profile
 * PUT /api/auth/profile
 */
exports.updateProfile = async (req, res, next) => {
  try {
    const updates = req.body;
    // Don't allow changing sensitive fields directly through this endpoint
    delete updates.passwordHash;
    delete updates.id;
    delete updates.role;

    const updated = db.update('users', req.user.id, updates);
    const { passwordHash: _, ...safeUser } = updated;

    res.json({
      success: true,
      message: 'Profile updated successfully!',
      data: safeUser
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Fast Demo Login Switcher (for hassle-free testing)
 * GET /api/auth/demo-switch/:role
 */
exports.demoSwitch = async (req, res, next) => {
  try {
    const { role } = req.params; // 'applicant' or 'recruiter'
    const targetId = role === 'recruiter' ? 'usr_recruiter_01' : 'usr_student_01';

    const user = db.findById('users', targetId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Demo profile not found.' });
    }

    const token = createToken(user);
    const { passwordHash: _, ...safeUser } = user;

    res.json({
      success: true,
      message: `Switched session to Demo ${role.toUpperCase()}`,
      data: {
        user: safeUser,
        token
      }
    });
  } catch (err) {
    next(err);
  }
};
