import express from 'express';

import {
  getSubCategoryValidator,
  createSubCategoryValidator,
  updateSubCategoryValidator,
  deleteSubCategoryValidator
} from '../utils/validators/subCategoryValidator.js';

import { 
  getSubCategories,
  getSubCategory,
  createSubCategory,
  updateSubCategory,
  deleteSubCategory,
  setCategoryIdToBody,
  createFilterObj
} from '../services/subCategory.service.js';
import protect from '../middlewares/protect.js';
import allowedTo from '../middlewares/allowedTo.js';

// mergeParams -> allow us to access parameters on other routers
// ex -> we need to access categoryId from category router
const router = express.Router({ mergeParams: true });

router.route('/')
  .get(createFilterObj, getSubCategories)
  .post(protect, allowedTo('admin'), setCategoryIdToBody, createSubCategoryValidator, createSubCategory)

router.route('/:id')
  .get(getSubCategoryValidator, getSubCategory)
  .put(protect, allowedTo('admin'), updateSubCategoryValidator, updateSubCategory)
  .delete(protect, allowedTo('admin'), deleteSubCategoryValidator, deleteSubCategory)

export default router;
