import { check, body } from "express-validator";
import slugify from 'slugify';

import validator from '../../middlewares/validator.js';

const getSubCategoryValidator = [
  check('id')
  .notEmpty().withMessage('SubCategory must be belong to category')
  .isMongoId().withMessage('Invalid subCategory id format'),
  validator
]

const createSubCategoryValidator = [
  check('name').notEmpty().withMessage('subCategory is required')
  .isLength({ min: 2 }).withMessage('Too Short subCategory name')
  .isLength({ max: 32 }).withMessage('Too Long subCategory name')
  .custom((value, { req }) => {
    req.body.slug = slugify(value);
    return true;
  }),
  check('category').notEmpty().withMessage('SubCategory must be belong to category')
    .isMongoId().withMessage('Invalid category id format'),
  validator
]

const updateSubCategoryValidator = [
  check('id')
  .notEmpty().withMessage('SubCategory must be belong to category')
  .isMongoId().withMessage('Invalid subCategory id format'),
  body('name').custom((value, { req }) => {
    req.body.slug = slugify(value);
    return true;
  }),
  validator
]

const deleteSubCategoryValidator = [
  check('id')
  .notEmpty().withMessage('SubCategory must be belong to category')
  .isMongoId().withMessage('Invalid subCategory id format'),
  validator
]

export {
  getSubCategoryValidator,
  createSubCategoryValidator,
  updateSubCategoryValidator,
  deleteSubCategoryValidator
}
