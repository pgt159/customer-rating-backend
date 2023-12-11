const express = require('express');
const ratingController = require('../controller/ratingController');
const { protect } = require('../controller/authController');
const router = express.Router();

router.route('/:id').patch(ratingController.updateReview);
router
  .route('/')
  .get(protect, ratingController.getReview)
  .post(protect, ratingController.createReview);

module.exports = router;
