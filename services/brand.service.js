import BrandModel from '../models/brand.model.js';
import factory from '../services/handlerFactory.js';

// @desc    Get All Brands
// @route   GET /api/v1/brands
// @access  Public
const getBrands = factory.getAll(BrandModel);

// @desc    Get Specific Brand By Id
// @route   GET /api/v1/brands/:id
// @access  Public
const getBrand = factory.getOne(BrandModel);

// @desc Create Brand
// @route POST /api/v1/brands
// @acess Private
const createBrand = factory.createOne(BrandModel);

// @desc Update Specific Brand By Id
// @route PUT /api/v1/brands/:id
// @acess Private
const updateBrand = factory.updateOne(BrandModel);

// @desc delete Specific Brand By Id
// @route DELETE /api/v1/brands/:id
// @acess Private
const deleteBrand = factory.deleteOne(BrandModel);

export {
  getBrands,
  getBrand, 
  createBrand, 
  updateBrand,
  deleteBrand 
};

