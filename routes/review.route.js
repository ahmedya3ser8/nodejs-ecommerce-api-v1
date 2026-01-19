import express from 'express';

import { 
  createReviewValidator,
  updateReviewValidator,
  getReviewValidator,
  deleteReviewValidator
} from '../utils/validators/reviewValidator.js';
import { 
  getReviews,
  getReview,
  createReview,
  updateReview,
  deleteReview,
  createFilterObj,
  setProductIdAndUserIdToBody
} from '../services/review.service.js';
import protect from '../middlewares/protect.js';
import allowedTo from '../middlewares/allowedTo.js';

const router = express.Router({ mergeParams: true });

router.route('/')
  .get(createFilterObj, getReviews)
  .post(protect, allowedTo('user'), setProductIdAndUserIdToBody, createReviewValidator, createReview)

router.route('/:id')
  .get(getReviewValidator, getReview)
  .put(protect, allowedTo('user'), updateReviewValidator, updateReview)
  .delete(protect, allowedTo('user', 'admin'), deleteReviewValidator, deleteReview)

export default router;
