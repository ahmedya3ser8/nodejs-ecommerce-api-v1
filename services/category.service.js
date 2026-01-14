import multer from 'multer';
import { v4 as uuidv4  }  from 'uuid';
import sharp from 'sharp';

import CategoryModel from '../models/category.model.js';
import factory from '../services/handlerFactory.js';
import AppError from '../utils/AppError.js';
import asyncHandler from '../middlewares/asyncHandler.js';

// 1) DiskStorage
// const multerStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'uploads/categories');
//   },
//   filename: (req, file, cb) => {
//     const ext = file.mimetype.split('/')[1];
//     const fileName = `category-${uuidv4()}-${Date.now()}.${ext}`;
//     cb(null, fileName);
//   }
// })

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  const imageType = file.mimetype.split('/')[0];
  if (imageType === 'image') {
    return cb(null, true);
  } else {
    return cb(new AppError('Only Images allowed', 400), false)
  }
}

const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

const uploadCategoryImage = upload.single('image');

const resizeImage = asyncHandler(async (req, res, next) => {
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
  deleteCategory,
  uploadCategoryImage,
  resizeImage
};

