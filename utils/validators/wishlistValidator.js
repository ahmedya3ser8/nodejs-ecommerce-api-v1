import { check } from "express-validator";

import validator from '../../middlewares/validator.js';
import ProductModel from "../../models/product.model.js";

const addProductToWishlistValidator = [
  check('productId')
    .notEmpty().withMessage('ProductId is required')
    .isMongoId().withMessage('Invalid product id format')
    .custom((productId) => 
      ProductModel.findById(productId).then((product) => {
        if (!product) {
          return Promise.reject(new Error('Product not found'))
        }
      })
    )
    .custom(async (productId, { req }) => {
      if (req.user.wishlist.includes(productId)) {
        throw new Error('Product already exists in wishlist');
      }
    }),
  validator
];

const removeProductFromWishlistValidator = [
  check('productId')
    .notEmpty().withMessage('ProductId is required')
    .isMongoId().withMessage('Invalid product id format')
    .custom((productId) => 
      ProductModel.findById(productId).then((product) => {
        if (!product) {
          return Promise.reject(new Error('Product not found'))
        }
      })
    )
    .custom(async (productId, { req }) => {
      if (!req.user.wishlist.includes(productId)) {
        throw new Error('Product not found in wishlist');
      }
    }),
  validator
]

export {
  addProductToWishlistValidator,
  removeProductFromWishlistValidator
}