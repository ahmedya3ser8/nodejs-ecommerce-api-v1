import { v4 as uuidv4  }  from 'uuid';
import sharp from 'sharp';

import BrandModel from '../models/brand.model.js';
import factory from '../services/handlerFactory.js';
import asyncHandler from '../middlewares/asyncHandler.js';
import { uploadSingleImage } from '../middlewares/uploadImage.js';

const uploadBrandImage = uploadSingleImage('image');

const resizeImage = asyncHandler(async (req, res, next) => {
  const fileName = `brand-${uuidv4()}-${Date.now()}.jpeg`;
  await sharp(req.file.buffer)
    .resize(600,600)
    .toFormat('jpeg')
    .jpeg({ quality: 100 })
    .toFile(`uploads/brands/${fileName}`);
  // save img in DB
  req.body.image = fileName;
  next();
});

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
  deleteBrand ,
  uploadBrandImage,
  resizeImage
};

