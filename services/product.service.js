import { v4 as uuidv4  }  from 'uuid';
import sharp from 'sharp';

import ProductModel from '../models/product.model.js';
import factory from '../services/handlerFactory.js';
import asyncHandler from '../middlewares/asyncHandler.js';
import { uploadMixOfImages } from '../middlewares/uploadImage.js';

const uploadProductImages = uploadMixOfImages([
  { name: 'imageCover', maxCount: 1 },
  { name: 'images', maxCount: 4 }
])

const resizeProductImages = asyncHandler(async (req, res, next) => {
  if (!req.files) return next();
  if (req.files.imageCover) {
    const imageCoverFileName = `product-${uuidv4()}-${Date.now()}-cover.jpeg`;
    await sharp(req.files.imageCover[0].buffer)
      .resize(2000, 1333)
      .toFormat('jpeg')
      .jpeg({ quality: 95 })
      .toFile(`uploads/products/${imageCoverFileName}`);
    // save img in DB
    req.body.imageCover = imageCoverFileName;
  }
  if (req.files.images) {
    req.body.images = [];
    await Promise.all(req.files.images.map(async (img, index) => {
      const imageName = `product-${uuidv4()}-${Date.now()}-${index + 1}.jpeg`;
      await sharp(img.buffer)
        .resize(2000, 1333)
        .toFormat('jpeg')
        .jpeg({ quality: 95 })
        .toFile(`uploads/products/${imageName}`);
      // save img in DB
      req.body.images.push(imageName);
    }))
  }
  next();
});

// @desc    Get All Products
// @route   GET /api/v1/products
// @access  Public
const getProducts = factory.getAll(ProductModel, 'Products');

// @desc    Get Specific Product By Id
// @route   GET /api/v1/products/:id
// @access  Public
const getProduct = factory.getOne(ProductModel, 'reviews');

// @desc Create Product
// @route POST /api/v1/products
// @acess Private/Admin
const createProduct = factory.createOne(ProductModel);

// @desc Update Specific Product By Id
// @route PUT /api/v1/products/:id
// @acess Private/Admin
const updateProduct = factory.updateOne(ProductModel);

// @desc delete Specific Product By Id
// @route DELETE /api/v1/products/:id
// @acess Private/Admin
const deleteProduct = factory.deleteOne(ProductModel);

export {
  getProducts,
  getProduct, 
  createProduct, 
  updateProduct,
  deleteProduct,
  uploadProductImages,
  resizeProductImages
};

