import User from '../models/User.js';

/**
 * Seed minimal demo users (idempotent).
 * This runs on server start to ensure login works in a fresh DB.
 */
const seedUsers = async () => {
  const demoUsers = [
    {
      name: 'Admin User',
      email: 'admin@eventia.com',
      password: 'admin123',
      role: 'admin',
    },
    {
      name: 'Volunteer User',
      email: 'volunteer@eventia.com',
      password: 'volunteer123',
      role: 'volunteer',
    },
    {
      name: 'Student User',
      email: 'student@eventia.com',
      password: 'student123',
      role: 'student',
    },
  ];

  await Promise.all(
    demoUsers.map((user) =>
      User.updateOne({ email: user.email }, { $setOnInsert: user }, { upsert: true })
    )
  );
};

export default seedUsers;
