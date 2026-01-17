import express from 'express';

import { 
  getBrandValidator,
  createBrandValidator,
  updateBrandValidator,
  deleteBrandValidator
} from '../utils/validators/brandValidator.js';
import { 
  getBrands,
  getBrand,
  createBrand,
  deleteBrand,
  updateBrand,
  uploadBrandImage,
  resizeImage
} from '../services/brand.service.js';
import protect from '../middlewares/protect.js';
import allowedTo from '../middlewares/allowedTo.js';

const router = express.Router();

router.route('/')
  .get(getBrands)
  .post(protect, allowedTo('admin'), uploadBrandImage, resizeImage, createBrandValidator, createBrand)

router.route('/:id')
  .get(getBrandValidator, getBrand)
  .put(protect, allowedTo('admin'), uploadBrandImage, resizeImage, updateBrandValidator, updateBrand)
  .delete(protect, allowedTo('admin'), deleteBrandValidator, deleteBrand)

export default router;
