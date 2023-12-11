const RatingModel = require('../model/ratingModel');
const catchAsync = require('../utils/catchAsync');
const ApiFeatures = require('../utils/apiFeatures');

exports.setUserId = (req, res, next) => {
  // if (req.headers.)
};
exports.getReview = catchAsync(async (req, res, next) => {
  const data = new ApiFeatures(RatingModel.find(), req.query)
    .filter()
    .sort()
    .paginate();

  const doc = await data.query;

  res.status(200).json({
    status: 'Success',
    data: {
      data: doc,
    },
  });
});

exports.createReview = catchAsync(async (req, res, next) => {
  const data = await RatingModel.create(req.body);
  res.status(201).json({
    status: 'Success',
    data: {
      data,
    },
  });
});

exports.updateReview = catchAsync(async (req, res, next) => {
  const data = await RatingModel.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!data) {
    return next(new AppError('No document found with that ID', 404));
  }
  res.status(200).json({
    status: 'Success',
    data: {
      data,
    },
  });
});
