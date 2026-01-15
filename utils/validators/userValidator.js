import { check } from "express-validator";

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
  validator
]

const deleteUserValidator = [
  check('id').isMongoId().withMessage('Invalid user id format'),
  validator
]

export {
  getUserValidator, 
  createUserValidator, 
  updateUserValidator,
  deleteUserValidator, 
};

