import dotenv from 'dotenv';
dotenv.config();

import connectDB from './config/db.js';
import app from './app.js';

const PORT = process.env.PORT || 5000;

const start = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`[server] RentEase API listening on port ${PORT} (${process.env.NODE_ENV || 'development'})`);
  });
};

start();

process.on('unhandledRejection', (err) => {
  console.error('[server] Unhandled rejection:', err.message);
});
