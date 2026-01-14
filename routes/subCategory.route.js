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

// mergeParams -> allow us to access parameters on other routers
// ex -> we need to access categoryId from category router
const router = express.Router({ mergeParams: true });

router.route('/')
  .get(createFilterObj, getSubCategories)
  .post(setCategoryIdToBody, createSubCategoryValidator, createSubCategory)

router.route('/:id')
  .get(getSubCategoryValidator, getSubCategory)
  .put(updateSubCategoryValidator, updateSubCategory)
  .delete(deleteSubCategoryValidator, deleteSubCategory)

export default router;
