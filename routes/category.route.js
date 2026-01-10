import express from 'express';

import { 
  getCategoryValidator, 
  createCategoryValidator, 
  updateCategoryValidator, 
  deleteCategoryValidator 
} from '../utils/validators/categoryValidator.js';

import { 
  getAllCategory, 
  getSpecificCategory, 
  updateCategory,
  createCategory,
  deleteCategory
} from '../services/category.service.js';

const router = express.Router();

router.route('/')
  .get(getAllCategory)
  .post(createCategoryValidator, createCategory)

router.route('/:id')
  .get(getCategoryValidator, getSpecificCategory)
  .put(updateCategoryValidator, updateCategory)
  .delete(deleteCategoryValidator, deleteCategory)

export default router;
