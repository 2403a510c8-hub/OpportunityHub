const jwt = require('jsonwebtoken');
const db = require('../db/database');

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_opportunity_hub_jwt_token_key_2026';

/**
 * Authentication Middleware
 * Validates JWT Bearer tokens or Demo session tokens
 */
function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. No token provided or invalid format.'
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    // Check if token is a standard JWT
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = db.findById('users', decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid session: User no longer exists.'
      });
    }

    // Attach user without password
    const { passwordHash, ...safeUser } = user;
    req.user = safeUser;
    next();
  } catch (err) {
    // If JWT verification fails, check if it's a mock demo token (e.g. "demo-token-alex" or "demo-token-elena")
    if (token.startsWith('demo-')) {
      const demoUserId = token === 'demo-token-elena' ? 'usr_recruiter_01' : 'usr_student_01';
      const demoUser = db.findById('users', demoUserId);
      if (demoUser) {
        const { passwordHash, ...safeUser } = demoUser;
        req.user = safeUser;
        return next();
      }
    }

    return res.status(401).json({
      success: false,
      message: 'Invalid or expired authentication token.'
    });
  }
}

/**
 * Optional Authentication Middleware (doesn't reject if not authenticated, but attaches req.user if present)
 */
function optionalAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next();
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = db.findById('users', decoded.id);
    if (user) {
      const { passwordHash, ...safeUser } = user;
      req.user = safeUser;
    }
  } catch (err) {
    if (token.startsWith('demo-')) {
      const demoUserId = token === 'demo-token-elena' ? 'usr_recruiter_01' : 'usr_student_01';
      const demoUser = db.findById('users', demoUserId);
      if (demoUser) {
        const { passwordHash, ...safeUser } = demoUser;
        req.user = safeUser;
      }
    }
  }
  next();
}

/**
 * Role-Based Access Control
 * e.g. requireRole('recruiter', 'admin')
 */
function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required.' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: This action requires one of the following roles: ${roles.join(', ')}`
      });
    }

    next();
  };
}

module.exports = {
  authenticate,
  optionalAuth,
  requireRole,
  JWT_SECRET
};
