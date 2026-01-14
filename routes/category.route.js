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
  deleteCategory
} from '../services/category.service.js';
import subCategoryRoute from './subCategory.route.js';

const router = express.Router();

router.use('/:categoryId/subcategories', subCategoryRoute)

router.route('/')
  .get(getCategories)
  .post(createCategoryValidator, createCategory)

router.route('/:id')
  .get(getCategoryValidator, getCategory)
  .put(updateCategoryValidator, updateCategory)
  .delete(deleteCategoryValidator, deleteCategory)

export default router;
