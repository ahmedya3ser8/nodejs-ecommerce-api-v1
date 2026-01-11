import express from 'express';

import {
  getSubCategoryValidator,
  createSubCategoryValidator,
  updateSubCategoryValidator,
  deleteSubCategoryValidator
} from '../utils/validators/subCategoryValidator.js';

import { 
  getAllSubCategory,
  getSpecificSubCategory,
  createSubCategory,
  updateSubCategory,
  deleteSubCategory
} from '../services/subCategory.service.js';

const router = express.Router();

router.route('/')
  .get(getAllSubCategory)
  .post(createSubCategoryValidator, createSubCategory)

router.route('/:id')
  .get(getSubCategoryValidator, getSpecificSubCategory)
  .put(updateSubCategoryValidator, updateSubCategory)
  .delete(deleteSubCategoryValidator, deleteSubCategory)

export default router;
