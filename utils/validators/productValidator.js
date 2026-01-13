import { check } from "express-validator";

import validator from '../../middlewares/validator.js';
import CategoryModel from '../../models/category.model.js';
import SubCategoryModel from '../../models/subCategory.model.js';

const getProductValidator = [
  check('id').isMongoId().withMessage('Invalid id format'),
  validator
]

const createProductValidator = [
  check('title')
    .notEmpty().withMessage('Title is required')
    .isLength({ min: 3 }).withMessage('Title must be at least 3 chars'),
  check('description')
    .notEmpty().withMessage('Description is required')
    .isLength({ min: 20 }).withMessage('Too short product description')
    .isLength({ max: 2000 }).withMessage('Too Long description'),
  check('quantity')
    .notEmpty().withMessage('Quantity is required')
    .isNumeric().withMessage('Quantity must be a number'),
  check('sold')
    .optional().isNumeric().withMessage('Sold must be a number'),
  check('price')
    .notEmpty().withMessage('Price is required')
    .isNumeric().withMessage('Price must be a number')
    .isLength({ max: 32 }).withMessage('Too long price'),
  check('priceAfterDiscount')
    .optional().isNumeric().withMessage('PriceAfterDiscount must be a number').toFloat()
    .custom((value, { req }) => {
      if (req.body.price <= value) {
        throw new Error('PriceAfterDiscount must be lower than price')
      }
      return true;
    }),
  check('colors').optional().isArray().withMessage('Colors should be array of string'),
  check('imageCover').notEmpty().withMessage('ImageCover is required'),
  check('images').optional().isArray().withMessage('Images should be array of string'),
  check('category')
    .notEmpty().withMessage('Product must be belong to category')
    .isMongoId().withMessage('Invalid id format')
    .custom((categoryId) =>
      CategoryModel.findById(categoryId).then((category) => {
        if(!category) {
          return Promise.reject(new Error(`No category for this id: ${categoryId}`))
        }
      }
    )),
  check('subcategories')
    .optional()
    .isMongoId().withMessage('Invalid id format')
    .custom((subcategoriesIds) =>
      SubCategoryModel.find({ _id: { $exists: true, $in: subcategoriesIds } }).then((result) => {
        if (result.length < 0 || result.length !== subcategoriesIds.length) {
          return Promise.reject(new Error(`Invalid subcategories Ids`));
        }
      }
    ))
    .custom((val, { req } ) =>
      SubCategoryModel.find({ category: req.body.category }).then((subcategories) => {
        const subcategoriesInDB = [];
        subcategories.forEach((subCategory) => {
          subcategoriesInDB.push(subCategory._id.toString());
        })
        // check if subcategories ids in db include subcategories in req.body (true / false)
        const checker = (target, arr) => target.every((v) => arr.includes(v))
        if (!checker(val, subcategoriesInDB)) {
          return Promise.reject(new Error(`subcategories not belong to category`));
        }
      })
    ),
  check('brand')
    .optional()
    .isMongoId().withMessage('Invalid id format'),
  check('ratingsAverage')
    .optional().isNumeric().withMessage('RatingsAverage must be a number')
    .isLength({ min: 1 }).withMessage('Rating must be above or equal 1.0')
    .isLength({ max: 5 }).withMessage('Rating must be below or equal 5.0'),
  check('ratingsQuantity')
    .optional().isNumeric().withMessage('RatingsQuantity must be a number'),
  validator
]

const updateProductValidator = [
  check('id').isMongoId().withMessage('Invalid id format'),
  validator
]

const deleteProductValidator = [
  check('id').isMongoId().withMessage('Invalid id format'),
  validator
]

export {
  getProductValidator,
  createProductValidator,
  updateProductValidator,
  deleteProductValidator
}
