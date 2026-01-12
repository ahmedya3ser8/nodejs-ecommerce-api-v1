import express from 'express';

import { 
  getBrandValidator,
  createBrandValidator,
  updateBrandValidator,
  deleteBrandValidator
} from '../utils/validators/brandValidator.js';
import { 
  getAllBrands,
  getSpecificBrand,
  createBrand,
  deleteBrand,
  updateBrand
} from '../services/brand.service.js';

const router = express.Router();

router.route('/')
  .get(getAllBrands)
  .post(createBrandValidator, createBrand)

router.route('/:id')
  .get(getBrandValidator, getSpecificBrand)
  .put(updateBrandValidator, updateBrand)
  .delete(deleteBrandValidator, deleteBrand)

export default router;
