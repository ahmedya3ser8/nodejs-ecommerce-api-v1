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
import reviewRoute from './review.route.js';
import protect from '../middlewares/protect.js';
import allowedTo from '../middlewares/allowedTo.js';

const router = express.Router();

// POST  /products/696656db3d537603709cc673/reviews
// GET  /products/696656db3d537603709cc673/reviews
// GET  /products/696656db3d537603709cc673/reviews/asgsagsga
router.use('/:productId/reviews', reviewRoute);

router.route('/')
  .get(getProducts)
  .post(protect, allowedTo('admin'), uploadProductImages, resizeProductImages , createProductValidator, createProduct)

router.route('/:id')
  .get(getProductValidator, getProduct)
  .put(protect, allowedTo('admin'), uploadProductImages, resizeProductImages, updateProductValidator, updateProduct)
  .delete(protect, allowedTo('admin'), deleteProductValidator, deleteProduct)

export default router;
