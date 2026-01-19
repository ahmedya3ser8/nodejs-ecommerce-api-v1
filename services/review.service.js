import ReviewModel from '../models/review.model.js';
import factory from './handlerFactory.js';

// Nested Route
// GET /products/696656db3d537603709cc673/reviews
const createFilterObj = (req, res, next) => {
  let filter = {};
  if (req.params.productId) filter = { product: req.params.productId };
  req.filterObj = filter;
  next();
}

const setProductIdAndUserIdToBody = (req, res, next) => {
  if (!req.body.product) req.body.product = req.params.productId;
  if (!req.body.user) req.body.user = req.user._id;
  next();
}

// @desc    Get All Reviews
// @route   GET /api/v1/reviews
// @access  Public
const getReviews = factory.getAll(ReviewModel);

// @desc    Get Specific Review By Id
// @route   GET /api/v1/reviews/:id
// @access  Public
const getReview = factory.getOne(ReviewModel);

// @desc Create Review
// @route POST /api/v1/reviews
// @acess Private/Protect/User
const createReview = factory.createOne(ReviewModel);

// @desc Update Specific Review By Id
// @route PUT /api/v1/reviews/:id
// @acess Private/Protect/User
const updateReview = factory.updateOne(ReviewModel);

// @desc delete Specific Review By Id
// @route DELETE /api/v1/reviews/:id
// @acess Private/Protect/User-Admin
const deleteReview = factory.deleteOne(ReviewModel);

export {
  getReviews,
  getReview,
  createReview,
  updateReview,
  deleteReview,
  createFilterObj,
  setProductIdAndUserIdToBody
};
