import express from 'express';

import { 
  getCategoryValidator, 
  createCategoryValidator, 
  updateCategoryValidator, 
  deleteCategoryValidator 
} from '../utils/validators/categoryValidator.js';
import { 
  getCategories, 
  getCategory, 
  updateCategory,
  createCategory,
  deleteCategory,
  uploadCategoryImage,
  resizeImage
} from '../services/category.service.js';
import subCategoryRoute from './subCategory.route.js';
import protect from '../middlewares/protect.js';
import allowedTo from '../middlewares/allowedTo.js';

const router = express.Router();

router.use('/:categoryId/subcategories', subCategoryRoute)

router.route('/')
  .get(getCategories)
  .post(protect, allowedTo('admin'), uploadCategoryImage, resizeImage, createCategoryValidator, createCategory)

router.route('/:id')
  .get(getCategoryValidator, getCategory)
  .put(protect, allowedTo('admin'), uploadCategoryImage, resizeImage, updateCategoryValidator, updateCategory)
  .delete(protect, allowedTo('admin'), deleteCategoryValidator, deleteCategory)

export default router;
