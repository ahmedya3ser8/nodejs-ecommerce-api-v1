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
  deleteProduct
} from '../services/product.service.js';

const router = express.Router();

router.route('/')
  .get(getProducts)
  .post(createProductValidator, createProduct)

router.route('/:id')
  .get(getProductValidator, getProduct)
  .put(updateProductValidator, updateProduct)
  .delete(deleteProductValidator, deleteProduct)

export default router;
