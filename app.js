const fs = require('fs');
const AppError = require('./utils/appError');
const cors = require('cors');
const globalErrorHandler = require('./controller/errorController');

const userRouter = require('./routes/userRoutes');
const ratingRouter = require('./routes/ratingRoutes');
const express = require('express');

const app = express();

app.use(
  express.json({
    limit: '10kb',
  })
);

app.use(cors());

app.use('/api/v1/users', userRouter);
app.use('/api/v1/rating', ratingRouter);

app.use('*', (req, res, next) => {
  next(new AppError(`Can not find ${req.originalUrl} on this server!`, 404));
});

app.use('/', (req, res, next) => {
  res.status(200).json({
    message: 'Hello world',
  });
});

app.use(globalErrorHandler);

module.exports = app;
