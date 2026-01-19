import SubCategoryModel from '../models/subCategory.model.js';
import factory from '../services/handlerFactory.js';

// Nested Route
// GET /categories/696656db3d537603709cc673/subcategories
const createFilterObj = (req, res, next) => {
  let filter = {};
  if (req.params.categoryId) filter = { category: req.params.categoryId };
  req.filterObj = filter;
  next();
}

const setCategoryIdToBody = (req, res, next) => {
  if (!req.body.category) req.body.category = req.params.categoryId;
  next();
}

// @desc    Get All subCategories
// @route   GET /api/v1/subcategories
// @access  Public
const getSubCategories = factory.getAll(SubCategoryModel);

// @desc    Get Specific subCategory By Id
// @route   GET /api/v1/subcategories/:id
// @access  Public
const getSubCategory = factory.getOne(SubCategoryModel);

// @desc Create subCategory
// @route POST /api/v1/subcategories
// @acess Private/Admin
const createSubCategory = factory.createOne(SubCategoryModel);

// @desc Update Specific subCategory By Id
// @route PUT /api/v1/subcategories/:id
// @acess Private/Admin
const updateSubCategory = factory.updateOne(SubCategoryModel);

// @desc delete Specific subCategory By Id
// @route DELETE /api/v1/subcategories/:id
// @acess Private/Admin
const deleteSubCategory = factory.deleteOne(SubCategoryModel);

export {
  createFilterObj, 
  setCategoryIdToBody, 
  getSubCategories,
  getSubCategory, 
  createSubCategory, 
  updateSubCategory,
  deleteSubCategory
};

