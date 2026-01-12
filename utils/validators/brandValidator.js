import { check } from "express-validator";

import validator from '../../middlewares/validator.js';

const getBrandValidator = [
  check('id').isMongoId().withMessage('Invalid brand id format'),
  validator
]

const createBrandValidator = [
  check('name').notEmpty().withMessage('Brand is required')
  .isLength({ min: 3 }).withMessage('Too Short brand name')
  .isLength({ max: 32 }).withMessage('Too Long brand name'),
  validator
]

const updateBrandValidator = [
  check('id').isMongoId().withMessage('Invalid brand id format'),
  validator
]

const deleteBrandValidator = [
  check('id').isMongoId().withMessage('Invalid brand id format'),
  validator
]

export {
  getBrandValidator,
  createBrandValidator,
  updateBrandValidator,
  deleteBrandValidator
}
