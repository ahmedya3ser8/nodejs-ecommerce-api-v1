import { body, check } from "express-validator";
import slugify from 'slugify';

import validator from '../../middlewares/validator.js';

const getBrandValidator = [
  check('id').isMongoId().withMessage('Invalid brand id format'),
  validator
]

const createBrandValidator = [
  check('name').notEmpty().withMessage('Brand is required')
  .isLength({ min: 3 }).withMessage('Too Short brand name')
  .isLength({ max: 32 }).withMessage('Too Long brand name')
  .custom((value, { req }) => {
    req.body.slug = slugify(value);
    return true;
  }),
  validator
]

const updateBrandValidator = [
  check('id').isMongoId().withMessage('Invalid brand id format'),
  body('name').optional().custom((value, { req }) => {
    req.body.slug = slugify(value);
    return true;
  }),
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
