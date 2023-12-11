const User = require('../model/userModel');
const promisify = require('util');
const catchAsync = require('../utils/catchAsync');
const jwt = require('jsonwebtoken');
const AppError = require('../utils/appError');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  res.cookie('jwt', token, cookieOptions);
  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

exports.signUp = catchAsync(async (req, res, next) => {
  const result = await User.create({
    name: req.body.name,
    userName: req.body.userName,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });
  // res.status(201).json({
  //   status: 'Success',
  //   data: result,
  // });
  createSendToken(result, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { userName, password } = req.body;
  if (!userName || !password) {
    return next(new AppError('Please provide userName and password!', 400));
  }
  const user = await User.findOne({ userName }).select('+password');
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(
      new AppError('Incorrect userName or password, please try again', 400)
    );
  }
  createSendToken(user, 200, res);
});

exports.getMe = catchAsync(async (req, res, next) => {
  const token = req.headers['authorization'].split(' ')[1];
  const decoded = await jwt.verify(token, process.env.JWT_SECRET);

  // promisify(jwt.verify)(token, process.env.JWT_SECRET);
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError(
        'The user belonging to this token does no longer exist.',
        401
      )
    );
  }
  res.status(200).json({
    status: 'Success',
    data: {
      user: currentUser,
    },
  });
});
