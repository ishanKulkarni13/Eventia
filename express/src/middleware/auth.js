import jwt from 'jsonwebtoken';

/**
 * Auth middleware: validates JWT and attaches user data to request.
 */
const requireAuth = (req, res, next) => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization required.' });
  }

  const token = header.replace('Bearer ', '').trim();

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: payload.userId, role: payload.role };
    return next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
};

/**
 * Role guard for admin/volunteer/student routes.
 */
const requireRole = (allowedRoles) => (req, res, next) => {
  if (!req.user || !allowedRoles.includes(req.user.role)) {
    return res.status(403).json({ message: 'Forbidden.' });
  }
  return next();
};

export { requireAuth, requireRole };
