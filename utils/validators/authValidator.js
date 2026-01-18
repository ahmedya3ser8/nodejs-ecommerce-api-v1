import { check } from "express-validator";

import validator from '../../middlewares/validator.js';
import UserModel from "../../models/user.model.js";

const singUpValidator = [
  check('fullName')
    .notEmpty().withMessage('FullName is required')
    .isLength({ min: 3 }).withMessage('Too Short fullName'),
  check('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email address')
    .custom((value) => 
      UserModel.findOne({ email: value }).then((user) => {
        if (user) {
          return Promise.reject(new Error('Email already exist'))
        }
      })
    ),
  check('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
    .custom((password, { req }) => {
      if (password !== req.body.confirmPassword) {
        throw new Error('Confirm Password incorrect')
      }
      return true;
    }),
  check('confirmPassword')
    .notEmpty().withMessage('Confirm Password is required'),
  check('phoneNumber')
    .optional()
    .isMobilePhone(['ar-EG', 'ar-SA']).withMessage('Invalid Phone Number only accept EGY and SAR Phone Numbers'),
  validator
];

const loginValidator = [
  check('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email address'),
  check('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  validator
];

const forgotPasswordValidator = [
  check('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email address'),
  validator
];

const verifyResetCodeValidator = [
  check('resetCode')
    .notEmpty().withMessage('ResetCode is required')
    .isLength({ min: 6, max: 6 }).withMessage('Reset Code must be 6 digits'),
  validator
];

const resetPasswordValidator = [
  check('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email address'),
  check('newPassword')
    .notEmpty().withMessage('New Password is required')
    .isLength({ min: 6 }).withMessage('New Password must be at least 6 characters')
    .custom((password, { req }) => {
      if (password !== req.body.confirmNewPassword) {
        throw new Error('Confirm New Password incorrect')
      }
      return true;
    }),
  check('confirmNewPassword')
    .notEmpty().withMessage('Confirm New Password is required'),
  validator
];

export {
  singUpValidator,
  loginValidator,
  forgotPasswordValidator,
  verifyResetCodeValidator,
  resetPasswordValidator
};
