import express from 'express';

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
  .post(createCategory)

router.route('/:id')
  .get(getSpecificCategory)
  .put(updateCategory)
  .delete(deleteCategory)

export default router;
