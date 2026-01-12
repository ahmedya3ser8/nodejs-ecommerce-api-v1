import slugify from 'slugify';

import SubCategoryModel from '../models/subCategory.model.js';
import asyncHandler from '../middlewares/asyncHandler.js';
import AppError from '../utils/AppError.js';

const createFilterObj = (req, res, next) => {
  let filter = {};
  if (req.params.categoryId) filter = { category: req.params.categoryId };
  req.filter = filter;
  next();
}
// @desc    Get All subCategories
// @route   GET /api/v1/subcategories
// @access  Public
const getAllSubCategories = asyncHandler(async (req, res) => {
  const query = req.query;
  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 5;
  const skip = (page - 1) * limit;

  const subCategories = await SubCategoryModel.find(req.filter, { '__v': false }).limit(limit).skip(skip);
    // .populate({ path: 'category', select: 'name -_id' });

  return res.status(200).json({
    results: subCategories.length,
    data: subCategories
  })
})

// @desc    Get Specific subCategory By Id
// @route   GET /api/v1/subcategories/:id
// @access  Public
const getSpecificSubCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const subCategory = await SubCategoryModel.findById(id).select('-__v')
  // .populate({ 
  //   path: 'category', select: 'name -_id' 
  // });
  if (!subCategory) {
    return next(new AppError(`No subCategory For This Id ${id}`, 404));
  }
  res.status(200).json({
    data: subCategory
  })
})

// Nested Route
const setCategoryIdToBody = (req, res, next) => {
  if (!req.body.category) req.body.category = req.params.categoryId;
  next();
}

// @desc Create subCategory
// @route POST /api/v1/subcategories
// @acess Private
const createSubCategory = asyncHandler(async (req, res, next) => {
  const { name, category } = req.body;
  const newSubCategory = await SubCategoryModel.create({ 
    name, 
    slug: slugify(name), 
    category 
  })
  res.status(201).json({
    data: newSubCategory
  })
});

// @desc Update Specific subCategory By Id
// @route PUT /api/v1/subcategories/:id
// @acess Private
const updateSubCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { name, category } = req.body;
  const subCategory = await SubCategoryModel.findOneAndUpdate(
    { _id: id }, 
    { name, slug: slugify(name), category }, 
    { new: true }
  );
  if (!subCategory) {
    return next(new AppError(`No subCategory For This Id ${id}`, 404));
  }
  res.status(200).json({
    data: subCategory
  })
})

// @desc delete Specific subCategory By Id
// @route DELETE /api/v1/subcategories/:id
// @acess Private
const deleteSubCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const subCategory = await SubCategoryModel.findByIdAndDelete(id);
  if (!subCategory) {
    return next(new AppError(`No subCategory For This Id ${id}`, 404));
  }
  res.status(204).send();
})

export {
  getAllSubCategories,
  getSpecificSubCategory,
  createSubCategory,
  updateSubCategory,
  deleteSubCategory,
  setCategoryIdToBody,
  createFilterObj
}
