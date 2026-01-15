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

const router = express.Router();

router.route('/')
  .get(getProducts)
  .post(uploadProductImages, resizeProductImages , createProductValidator, createProduct)

router.route('/:id')
  .get(getProductValidator, getProduct)
  .put(uploadProductImages, resizeProductImages, updateProductValidator, updateProduct)
  .delete(deleteProductValidator, deleteProduct)

export default router;
