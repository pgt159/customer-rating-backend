const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.on('uncaughtException', (err) => {
  console.log('Uncaught Exception!', err);
  process.exit(1);
});

dotenv.config({ path: './config.env' });

const app = require(`./app`);

const DB = process.env.DB.replace('<password>', process.env.DB_PASSWORD);

mongoose.connect(DB);

const port = process.env.PORT || 8000;
const server = app.listen(port, () => {});

process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
