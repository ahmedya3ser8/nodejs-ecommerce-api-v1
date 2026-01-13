import express from 'express';

import { 
  getProductValidator,
  createProductValidator,
  updateProductValidator,
  deleteProductValidator
} from '../utils/validators/productValidator.js';
import { 
  getAllProducts,
  getSpecificProduct,
  createProduct,
  updateProduct,
  deleteProduct
} from '../services/product.service.js';

const router = express.Router();

router.route('/')
  .get(getAllProducts)
  .post(createProductValidator, createProduct)

router.route('/:id')
  .get(getProductValidator, getSpecificProduct)
  .put(updateProductValidator, updateProduct)
  .delete(deleteProductValidator, deleteProduct)

export default router;
