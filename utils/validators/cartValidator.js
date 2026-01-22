import { check } from "express-validator";

import validator from '../../middlewares/validator.js';

const addProductItemValidator = [
  check('productId')
    .notEmpty().withMessage('ProductId is required')
    .isMongoId().withMessage('Invalid product id format'),
  check('color')
    .notEmpty().withMessage('Product color is required'),
  validator
];

const removeProductItemValidator = [
  check('cartItemId')
    .notEmpty().withMessage('CartItem Id is required')
    .isMongoId().withMessage('Invalid CartItem Id format'),
  validator
];

const updateProductQuantityValidator = [
  check('cartItemId')
    .notEmpty().withMessage('CartItem Id is required')
    .isMongoId().withMessage('Invalid CartItem Id format'),
  check('quantity')
    .notEmpty().withMessage('quantity is required')
    .isNumeric().withMessage('Quantity must be a number'),
  validator
];

export {
  addProductItemValidator,
  removeProductItemValidator,
  updateProductQuantityValidator
}