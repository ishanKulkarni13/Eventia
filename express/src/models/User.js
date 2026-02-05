import mongoose from 'mongoose';

/**
 * User schema for hackathon MVP.
 * Passwords are stored in plain text for speed (not production-safe).
 */
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ['admin', 'volunteer', 'student'],
      required: true,
    },
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);

export default User;
