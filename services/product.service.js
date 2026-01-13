import slugify from 'slugify';
import qs from 'qs';

import ProductModel from '../models/product.model.js';
import asyncHandler from '../middlewares/asyncHandler.js';
import AppError from '../utils/AppError.js';

// @desc    Get All Products
// @route   GET /api/v1/products
// @access  Public
const getAllProducts = asyncHandler(async (req, res) => {
  // 1) filtering
  const queryObj = qs.parse(req.query);
  const excludesFields = ['page', 'sort', 'limit', 'fields', 'keyword'];
  excludesFields.forEach(field => delete queryObj[field]);
  // apply filteration using (gte, gt, lte, lt)
  let queryStr = JSON.stringify(queryObj)
  queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

  // 2) pagination
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 50;
  const skip = (page - 1) * limit;

  let mongooseQuery = ProductModel.find(JSON.parse(queryStr)).limit(limit).skip(skip).populate({
    path: 'category',
    select: 'name -_id'
  });

  // 3) sorting
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    mongooseQuery = mongooseQuery.sort(sortBy);
  } else {
    mongooseQuery = mongooseQuery.sort('-createdAt');
  }

  // 4) limiting Fields
  if (req.query.fields) {
    const fields = req.query.fields.split(',').join(' ');
    mongooseQuery = mongooseQuery.select(fields);
  } else {
    mongooseQuery = mongooseQuery.select("-__v");
  }

  // 5) searching
  if (req.query.keyword) {
    const query = {};
    query.$or = [
      { title: { $regex: req.query.keyword, $options: 'i' } },
      { description: { $regex: req.query.keyword, $options: 'i' } }
    ];
    mongooseQuery = mongooseQuery.find(query);
  }

  const products = await mongooseQuery;

  return res.status(200).json({
    results: products.length,
    data: products
  })
})

// @desc    Get Specific Product By Id
// @route   GET /api/v1/products/:id
// @access  Public
const getSpecificProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const product = await ProductModel.findById(id).select('-__v').populate({
    path: 'category',
    select: 'name -_id'
  });;
  if (!product) {
    return next(new AppError(`No Product For This Id ${id}`, 404));
  }
  res.status(200).json({
    data: product
  })
})

// @desc Create Product
// @route POST /api/v1/products
// @acess Private
const createProduct = asyncHandler(async (req, res, next) => {
  req.body.slug = slugify(req.body.title);
  const newProduct = await ProductModel.create(req.body);
  res.status(201).json({
    data: newProduct
  })
});

// @desc Update Specific Product By Id
// @route PUT /api/v1/products/:id
// @acess Private
const updateProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  if (req.body.title) req.body.slug = slugify(req.body.title);

  const product = await ProductModel.findOneAndUpdate( { _id: id }, req.body, { new: true } );

  if (!product) {
    return next(new AppError(`No Product For This Id ${id}`, 404));
  }
  res.status(200).json({
    data: product
  })
})

// @desc delete Specific Product By Id
// @route DELETE /api/v1/products/:id
// @acess Private
const deleteProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const product = await ProductModel.findByIdAndDelete(id);
  if (!product) {
    return next(new AppError(`No Product For This Id ${id}`, 404));
  }
  res.status(204).send();
})

export {
  getAllProducts,
  getSpecificProduct,
  createProduct,
  updateProduct,
  deleteProduct
}
