import { body, check } from "express-validator";

import validator from '../../middlewares/validator.js';
import ReviewModel from "../../models/review.model.js";

const getReviewValidator = [
  check('id')
    .notEmpty().withMessage('Review id is required')
    .isMongoId().withMessage('Invalid review id format'),
  validator
]

const createReviewValidator = [
  check('title').optional(),
  check('ratings')
    .notEmpty().withMessage('Rating is required')
    .isFloat({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  check('user')
    .notEmpty().withMessage('User id is required')
    .isMongoId().withMessage('Invalid user id format'),
  check('product')
    .notEmpty().withMessage('Product id is required')
    .isMongoId().withMessage('Invalid product id format')
    .custom((value, { req }) => 
      // 1) check if logged user create before
      ReviewModel.findOne({ user: req.user._id, product: req.body.product }).then((review) => {
        if (review) {
          return Promise.reject(new Error('You can only leave one review per product'))
        }
      })
    ),
  validator
]

const updateReviewValidator = [
  check('id')
    .notEmpty().withMessage('Review id is required')
    .isMongoId().withMessage('Invalid review id format')
    .custom((id, { req }) => 
      // check review ownerShip before update
      ReviewModel.findById(id).then((review) => {
        if (!review) {
          return Promise.reject(new Error(`There is no review with this id ${id}`));
        }
        if (review.user._id.toString() !== req.user._id.toString()) {
          return Promise.reject(new Error('You are not allowed to perform this action'));
        }
      })
    ),
  validator
]

const deleteReviewValidator = [
  check('id')
    .notEmpty().withMessage('Review id is required')
    .isMongoId().withMessage('Invalid review id format')
    .custom((id, { req }) => {
      // check review ownerShip before update
      if (req.user.role === 'user') {
        return ReviewModel.findById(id).then((review) => {
          if (!review) {
            return Promise.reject(new Error(`There is no review with this id ${id}`));
          }
          if (review.user._id.toString() !== req.user._id.toString()) {
            return Promise.reject(new Error('You are not allowed to perform this action'));
          }
        })
      }
      return true;
    }),
  validator
]

export {
  getReviewValidator,
  createReviewValidator,
  updateReviewValidator,
  deleteReviewValidator
}
