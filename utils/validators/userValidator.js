import { body, check } from "express-validator";
import bcrypt from "bcryptjs";

import validator from '../../middlewares/validator.js';
import UserModel from "../../models/user.model.js";

const getUserValidator = [
  check('id').isMongoId().withMessage('Invalid user id format'),
  validator
]

const createUserValidator = [
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
  check('profileImage').optional(),
  check('role').optional(),
  validator
]

const updateUserValidator = [
  check('id').isMongoId().withMessage('Invalid user id format'),
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
  check('phoneNumber')
    .optional()
    .isMobilePhone(['ar-EG', 'ar-SA']).withMessage('Invalid Phone Number only accept EGY and SAR Phone Numbers'),
  check('profileImage').optional(),
  check('role').optional(),
  validator
]

const changeUserPasswordValidator = [
  check('id').isMongoId().withMessage('Invalid user id format'),
  body('currentPassword')
    .notEmpty().withMessage('Current Password is required'),
  body('confirmPassword')
    .notEmpty().withMessage('Confirm Password is required'),
  body('password')
    .notEmpty().withMessage('New Password is required')
    .custom(async (value, { req }) => {
      // 1) verify current passowrd
      const user = await UserModel.findById(req.params.id);
      if (!user) {
        throw new Error('There is no user for this id');
      }
      const isPassCorrect = await bcrypt.compare(req.body.currentPassword, user.password);
      if (!isPassCorrect) {
        throw new Error('Incorrect current password');
      }
      // 2) verify confirm password
      if (value !== req.body.confirmPassword) {
        throw new Error('Confirm Password incorrect')
      }
      return true;
    }),
  validator
]

const deleteUserValidator = [
  check('id')
  .notEmpty().withMessage('User Id is required')
  .isMongoId().withMessage('Invalid user id format'),
  validator
]

const changeLoggedUserPasswordValidator = [
  body('currentPassword')
    .notEmpty().withMessage('Current Password is required'),
  body('confirmPassword')
    .notEmpty().withMessage('Confirm Password is required'),
  body('password')
    .notEmpty().withMessage('New Password is required')
    .custom(async (value, { req }) => {
      // 1) verify current passowrd
      const user = await UserModel.findById(req.user._id);
      if (!user) {
        throw new Error('There is no user for this id');
      }
      const isPassCorrect = await bcrypt.compare(req.body.currentPassword, user.password);
      if (!isPassCorrect) {
        throw new Error('Incorrect current password');
      }
      // 2) verify confirm password
      if (value !== req.body.confirmPassword) {
        throw new Error('Confirm Password incorrect')
      }
      return true;
    }),
  validator
]

const updateLoggedUserValidator = [
  check('email')
    .optional()
    .isEmail().withMessage('Invalid email address')
    .custom((value) => 
      UserModel.findOne({ email: value }).then((user) => {
        if (user) {
          return Promise.reject(new Error('Email already exist'))
        }
      })
    ),
  check('phoneNumber')
    .optional()
    .isMobilePhone(['ar-EG', 'ar-SA']).withMessage('Invalid Phone Number only accept EGY and SAR Phone Numbers'),
  validator
]

export {
  getUserValidator, 
  createUserValidator, 
  updateUserValidator,
  deleteUserValidator, 
  changeUserPasswordValidator,
  changeLoggedUserPasswordValidator,
  updateLoggedUserValidator
};
