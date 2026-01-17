import express from 'express';

import { 
  getProductValidator,
  createProductValidator,
  updateProductValidator,
  deleteProductValidator
} from '../utils/validators/productValidator.js';
import { 
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  resizeProductImages,
  uploadProductImages
} from '../services/product.service.js';
import protect from '../middlewares/protect.js';
import allowedTo from '../middlewares/allowedTo.js';

const router = express.Router();

router.route('/')
  .get(getProducts)
  .post(protect, allowedTo('admin'), uploadProductImages, resizeProductImages , createProductValidator, createProduct)

router.route('/:id')
  .get(getProductValidator, getProduct)
  .put(protect, allowedTo('admin'), uploadProductImages, resizeProductImages, updateProductValidator, updateProduct)
  .delete(protect, allowedTo('admin'), deleteProductValidator, deleteProduct)

export default router;
