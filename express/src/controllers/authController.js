import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/**
 * Login with email + password (plain text for hackathon speed).
 * Returns JWT + basic user info for role-based routing.
 */
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  const user = await User.findOne({ email: email.toLowerCase().trim() });

  if (!user || user.password !== password) {
    return res.status(401).json({ message: 'Invalid credentials.' });
  }

  // JWT encodes identity + role; backend remains source of truth.
  const token = jwt.sign(
    { userId: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  return res.json({
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
};

export { login };
