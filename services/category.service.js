import CategoryModel from '../models/category.model.js';
import factory from '../services/handlerFactory.js';

// @desc    Get All Categories
// @route   GET /api/v1/categories
// @access  Public
const getCategories = factory.getAll(CategoryModel);

// @desc    Get Specific Category By Id
// @route   GET /api/v1/categories/:id
// @access  Public
const getCategory = factory.getOne(CategoryModel);

// @desc Create Category
// @route POST /api/v1/categories
// @acess Private
const createCategory = factory.createOne(CategoryModel);

// @desc Update Specific Category By Id
// @route PUT /api/v1/categories/:id
// @acess Private
const updateCategory = factory.updateOne(CategoryModel);

// @desc delete Specific Category By Id
// @route DELETE /api/v1/categories/:id
// @acess Private
const deleteCategory = factory.deleteOne(CategoryModel);

export {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory 
};

