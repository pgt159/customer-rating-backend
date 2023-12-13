const User = require('../model/userModel');
const util = require('util');
const catchAsync = require('../utils/catchAsync');
const jwt = require('jsonwebtoken');
const AppError = require('../utils/appError');

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  console.log('cookie', req.cookie);
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req?.cookie) {
    token = req.cookie.split('=')[1];
  }

  if (!token) {
    return next(new AppError('Your are not logged in', 401));
  }

  const decoded = await util.promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET
  );
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError(
        'The user belonging to this token does no longer exist.',
        401
      )
    );
  }
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('User recently changed password! Please log in again.', 401)
    );
  }

  req.user = currentUser;
  next();
});
