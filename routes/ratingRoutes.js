const express = require('express');
const ratingController = require('../controller/ratingController');
const authController = require('../controller/authController');
const { protect } = require('../controller/authController');
const router = express.Router();

router.use(authController.protect);

router.route('/:id').patch(ratingController.updateReview);
router
  .route('/')
  .get(ratingController.getReview)
  .post(ratingController.setRatingUser, ratingController.createReview);

module.exports = router;
