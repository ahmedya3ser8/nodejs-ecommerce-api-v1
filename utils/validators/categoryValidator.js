import { check } from "express-validator";

import validator from '../../middlewares/validator.js';

const getCategoryValidator = [
  check('id').isMongoId().withMessage('Invalid category id format'),
  validator
]

const createCategoryValidator = [
  check('name').notEmpty().withMessage('Category is required')
  .isLength({ min: 3 }).withMessage('Too Short category name')
  .isLength({ max: 32 }).withMessage('Too Long category name'),
  validator
]

const updateCategoryValidator = [
  check('id').isMongoId().withMessage('Invalid category id format'),
  validator
]

const deleteCategoryValidator = [
  check('id').isMongoId().withMessage('Invalid category id format'),
  validator
]

export {
  getCategoryValidator,
  createCategoryValidator,
  updateCategoryValidator,
  deleteCategoryValidator
}
