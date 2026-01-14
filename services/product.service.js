import ProductModel from '../models/product.model.js';
import factory from '../services/handlerFactory.js';

// @desc    Get All Products
// @route   GET /api/v1/products
// @access  Public
const getProducts = factory.getAll(ProductModel, 'Products');

// @desc    Get Specific Product By Id
// @route   GET /api/v1/products/:id
// @access  Public
const getProduct = factory.getOne(ProductModel);

// @desc Create Product
// @route POST /api/v1/products
// @acess Private
const createProduct = factory.createOne(ProductModel);

// @desc Update Specific Product By Id
// @route PUT /api/v1/products/:id
// @acess Private
const updateProduct = factory.updateOne(ProductModel);

// @desc delete Specific Product By Id
// @route DELETE /api/v1/products/:id
// @acess Private
const deleteProduct = factory.deleteOne(ProductModel);

export {
  getProducts,
  getProduct, 
  createProduct, 
  updateProduct,
  deleteProduct 
};

