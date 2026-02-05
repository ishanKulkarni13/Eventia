import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/**
 * Login with email + password (plain text for hackathon speed).
 * Returns JWT + basic user info for role-based routing.
 */
const login = async (req, res) => {
  const { email, password } = req.body || {};

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

/**
 * Signup with name + email + password + role (plain text for hackathon speed).
 * Returns JWT + basic user info for role-based routing.
 */
const signup = async (req, res) => {
  const { name, email, password, role } = req.body || {};

  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: 'Name, email, password, and role are required.' });
  }

  const normalizedEmail = email.toLowerCase().trim();
  const normalizedName = name.trim();
  const normalizedRole = role.toLowerCase().trim();

  const allowedRoles = ['admin', 'volunteer', 'student'];
  if (!allowedRoles.includes(normalizedRole)) {
    return res.status(400).json({ message: 'Invalid role.' });
  }

  const existingUser = await User.findOne({ email: normalizedEmail });
  if (existingUser) {
    return res.status(409).json({ message: 'Email already in use.' });
  }

  const user = await User.create({
    name: normalizedName,
    email: normalizedEmail,
    password,
    role: normalizedRole,
  });

  const token = jwt.sign(
    { userId: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  return res.status(201).json({
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
};

export { login, signup };
