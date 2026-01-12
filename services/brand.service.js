import slugify from 'slugify';

import BrandModel from '../models/brand.model.js';
import asyncHandler from '../middlewares/asyncHandler.js';
import AppError from '../utils/AppError.js';

// @desc    Get All Brands
// @route   GET /api/v1/brands
// @access  Public
const getAllBrands = asyncHandler(async (req, res) => {
  const query = req.query;
  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 5;
  const skip = (page - 1) * limit;

  const brands = await BrandModel.find({}, { '__v': false }).limit(limit).skip(skip);
  return res.status(200).json({
    results: brands.length,
    data: brands
  })
})

// @desc    Get Specific Brand By Id
// @route   GET /api/v1/brands/:id
// @access  Public
const getSpecificBrand = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const brand = await BrandModel.findById(id).select('-__v');
  if (!brand) {
    return next(new AppError(`No Brand For This Id ${id}`, 404));
  }
  res.status(200).json({
    data: brand
  })
})

// @desc Create Brand
// @route POST /api/v1/brands
// @acess Private
const createBrand = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const newBrand = await BrandModel.create({ name, slug: slugify(name) })
  res.status(201).json({
    data: newBrand
  })
});

// @desc Update Specific Brand By Id
// @route PUT /api/v1/brands/:id
// @acess Private
const updateBrand = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { name } = req.body;

  const brand = await BrandModel.findOneAndUpdate(
    { _id: id}, 
    { name, slug: slugify(name) }, 
    { new: true }
  );

  if (!brand) {
    return next(new AppError(`No Brand For This Id ${id}`, 404));
  }
  res.status(200).json({
    data: brand
  })
})

// @desc delete Specific Brand By Id
// @route DELETE /api/v1/brands/:id
// @acess Private
const deleteBrand = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const brand = await BrandModel.findByIdAndDelete(id);
  if (!brand) {
    return next(new AppError(`No Brand For This Id ${id}`, 404));
  }
  res.status(204).send();
})

export {
  getAllBrands,
  getSpecificBrand,
  createBrand,
  updateBrand,
  deleteBrand
}
