import { check } from "express-validator";

import validator from '../../middlewares/validator.js';
import CouponModel from "../../models/coupon.model.js";
import AppError from '../../utils/appError.js';

const addCouponValidator = [
  check('name')
    .notEmpty().withMessage('Coupon name is required')
    .isLength({ min: 5 }).withMessage('Coupon name must be at least 5 characters')
    .custom((value) => 
      CouponModel.findOne({ name: value }).then((coupon) => {
        if (coupon) {
          return Promise.reject(new AppError('Coupon name already exists'));
        }
      })
    ),
  check('expire')
    .notEmpty().withMessage('Coupon expire date is required')
    .isISO8601().withMessage('Invalid expire date format, i want expire date like this (YYYY-MM-DD)')
    .custom((value) => {
      if (new Date(value) <= new Date()) {
        throw new Error('Coupon expire date must be in the future')
      }
      return true;
    }),
  check('discount')
    .notEmpty().withMessage('Coupon discount is required')
    .isFloat({ min: 1, max: 100 }).withMessage('Coupon discount must be between 1 and 100'),
  validator
];

const updateCouponValidator = [
  check('name')
    .notEmpty().withMessage('Coupon name is required')
    .isLength({ min: 5 }).withMessage('Coupon name must be at least 5 characters')
    .custom((value, { req }) => 
      CouponModel.findOne({ name: value }).then((coupon) => {
        if (coupon && coupon._id.toString() === req.params.id) {
          return Promise.reject(new AppError('Coupon name already exists'));
        }
      })
    ),
  check('expire')
    .notEmpty().withMessage('Coupon expire date is required')
    .isISO8601().withMessage('Invalid expire date format, i want expire date like this (YYYY-MM-DD)')
    .custom((value) => {
      if (new Date(value) <= new Date()) {
        throw new Error('Coupon expire date must be in the future')
      }
      return true;
    }),
  check('discount')
    .notEmpty().withMessage('Coupon discount is required')
    .isFloat({ min: 1, max: 100 }).withMessage('Coupon discount must be between 1 and 100'),
  validator
];

const getCouponValidator = [
  check('id')
    .notEmpty().withMessage('couponId is required')
    .isMongoId().withMessage('Invalid couponId format'),
  validator
]

const deleteCouponValidator = [
  check('id')
    .notEmpty().withMessage('couponId is required')
    .isMongoId().withMessage('Invalid couponId format'),
  validator
]

export {
  addCouponValidator,
  updateCouponValidator,
  getCouponValidator,
  deleteCouponValidator
}
