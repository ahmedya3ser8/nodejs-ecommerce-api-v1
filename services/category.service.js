import slugify from 'slugify';

import CategoryModel from '../models/category.model.js';
import asyncHandler from '../middlewares/asyncHandler.js';

// @desc    Get All Categories
// @route   GET /api/v1/categories
// @access  Public
const getAllCategory = asyncHandler(async (req, res) => {
  const query = req.query;
  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 5;
  const skip = (page - 1) * limit;
  const categories = await CategoryModel.find({}, { '__v': false }).limit(limit).skip(skip);
  return res.status(200).json({
    results: categories.length,
    data: categories
  })
})

// @desc    Get Specific Category By Id
// @route   GET /api/v1/categories/:id
// @access  Public
const getSpecificCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const category = await CategoryModel.findById(id).select('-__v');
  if (!category) {
    return res.status(404).json({
      message: `No Category For This Id ${id}`
    })
  }
  return res.status(200).json({
    data: category
  })
})

// @desc Create Category
// @route POST /api/v1/categories
// @acess Private
const createCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ message: 'Category name is required' });
  }
  const newCategory = await CategoryModel.create({ name, slug: slugify(name) })
  return res.status(201).json({
    data: newCategory
  })
});

// @desc Update Specific Category By Id
// @route PUT /api/v1/categories/:id
// @acess Private
const updateCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  const category = await CategoryModel.findOneAndUpdate({_id: id}, { name, slug: slugify(name) }, { new: true });
  if (!category) {
    return res.status(404).json({
      message: `No Category For This Id ${id}`
    })
  }
  return res.status(200).json({
    data: category
  })
})

// @desc delete Specific Category By Id
// @route DELETE /api/v1/categories/:id
// @acess Private
const deleteCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const category = await CategoryModel.findByIdAndDelete(id);
  if (!category) {
    return res.status(404).json({
      message: `No Category For This Id ${id}`
    })
  }
  return res.status(204).send();
})

export {
  getAllCategory,
  getSpecificCategory,
  updateCategory,
  createCategory,
  deleteCategory
}
