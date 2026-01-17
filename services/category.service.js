import { v4 as uuidv4  }  from 'uuid';
import sharp from 'sharp';

import CategoryModel from '../models/category.model.js';
import factory from '../services/handlerFactory.js';
import asyncHandler from '../middlewares/asyncHandler.js';
import { uploadSingleImage } from '../middlewares/uploadImage.js';

const uploadCategoryImage = uploadSingleImage('image');

const resizeImage = asyncHandler(async (req, res, next) => {
  if (!req.file) return next();
  const fileName = `category-${uuidv4()}-${Date.now()}.jpeg`;
  await sharp(req.file.buffer)
    .resize(600,600)
    .toFormat('jpeg')
    .jpeg({ quality: 95 })
    .toFile(`uploads/categories/${fileName}`);
  // save img in DB
  req.body.image = fileName;
  next();
});

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
// @acess Private/Admin
const createCategory = factory.createOne(CategoryModel);

// @desc Update Specific Category By Id
// @route PUT /api/v1/categories/:id
// @acess Private/Admin
const updateCategory = factory.updateOne(CategoryModel);

// @desc delete Specific Category By Id
// @route DELETE /api/v1/categories/:id
// @acess Private/Admin
const deleteCategory = factory.deleteOne(CategoryModel);

export {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  uploadCategoryImage,
  resizeImage
};

