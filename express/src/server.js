import 'dotenv/config';

import app from './app.js';
import connectDB from './config/db.js';
import seedUsers from './utils/seedUsers.js';

const port = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await connectDB();
    await seedUsers();
    app.listen(port, () => {
      console.log(`API listening on port ${port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
