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

const router = express.Router();

router.use('/:categoryId/subcategories', subCategoryRoute)

router.route('/')
  .get(getCategories)
  .post(uploadCategoryImage, resizeImage, createCategoryValidator, createCategory)

router.route('/:id')
  .get(getCategoryValidator, getCategory)
  .put(uploadCategoryImage, resizeImage, updateCategoryValidator, updateCategory)
  .delete(deleteCategoryValidator, deleteCategory)

export default router;
