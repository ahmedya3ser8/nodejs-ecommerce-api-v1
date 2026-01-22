import CartModel from '../models/cart.model.js';
import ProductModel from '../models/product.model.js';
import CouponModel from '../models/coupon.model.js';
import asyncHandler from '../middlewares/asyncHandler.js';
import AppError from '../utils/appError.js';

const calcTotalCartPrice = (cart) => {
  // let totalPrice = 0;
  // cart.cartItems.forEach(item => totalPrice += item.quantity * item.price);
  // cart.totalCartPrice = totalPrice;
  cart.totalPriceAfterDiscount = undefined;
  return cart.cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
}

// @desc    Add Product To Cart
// @route   POST /api/v1/cart
// @access  Private/User
const addProductToCart = asyncHandler(async (req, res, next) => {
  const { productId, color } = req.body;

  const product = await ProductModel.findById(productId);
  
  // 1) get cart for logged user
  let cart = await CartModel.findOne({ user: req.user._id });
  
  if (!cart) {
    // create cart for logged user with product
    cart = await CartModel.create({
      user: req.user._id,
      cartItems: [ { product: productId, color, price: product.price } ]
    })
  } else {
    // 1) if product exist in cart then update product quantity
    const productIndex = cart.cartItems.findIndex(item => item.product.toString() === productId && item.color === color);
    if (productIndex > -1) {
      // update quantity
      // const cartItem  = cart.cartItems[productIndex];
      // cartItem.quantity += 1;
      // cart.cartItems[productIndex] = cartItem;
      cart.cartItems[productIndex].quantity += 1;
    } else {
      // 2) if product not exist in cart then push product in cartItems array
      cart.cartItems.push({ product: productId, color, price: product.price })
    }
  }

  // 2) calculate total cart price
  cart.totalCartPrice = calcTotalCartPrice(cart);

  await cart.save();

  return res.status(201).json({
    status: 'success',
    message: 'Product added to shopping cart successfully',
    numOfCartItems: cart.cartItems.length,
    data: cart
  })
})

// @desc    Get Logged User Cart
// @route   GET /api/v1/cart
// @access  Private/User
const getLoggedUserCart = asyncHandler(async (req, res, next) => {
  const cart = await CartModel.findOne({ user: req.user._id })
  if (!cart) {
    return next(new AppError(`There is no cart for this user id: ${req.user._id}`, 404))
  }
  return res.status(200).json({
    status: 'success',
    numOfCartItems: cart.cartItems.length,
    data: cart
  })
})

// @desc    Remove Specific Cart Item
// @route   DELETE /api/v1/cart/:cartItemId
// @access  Private/User
const removeSpecificCartItem = asyncHandler(async (req, res, next) => {
  const cart = await CartModel.findOneAndUpdate({ user: req.user._id }, {
    $pull: { cartItems: { _id: req.params.cartItemId } }
  }, { new: true });

  // calculate total cart price
  cart.totalCartPrice = calcTotalCartPrice(cart);

  await cart.save();

  return res.status(200).json({
    status: 'success',
    message: 'Product removed from your shopping cart',
    numOfCartItems: cart.cartItems.length,
    data: cart
  })
})

// @desc    Clear Logged User Cart
// @route   DELETE /api/v1/cart
// @access  Private/User
const clearLoggedUserCart = asyncHandler(async (req, res, next) => {
  await CartModel.findOneAndDelete({ user: req.user._id });
  return res.status(200).json({
    status: 'success',
    message: 'Cart cleared successfully'
  })
})

// @desc    Update Specific Cart Item Quantity
// @route   PUT /api/v1/cart/:cartItemId
// @access  Private/User
const updateCartItemQuantity = asyncHandler(async (req, res, next) => {
  const { quantity } = req.body;
  const cart = await CartModel.findOne({ user: req.user._id });
  if (!cart) {
    return next(new AppError(`There is no cart for this user id: ${req.user._id}`, 404))
  }
  const itemIndex = cart.cartItems.findIndex(item => item._id.toString() === req.params.cartItemId);
  if (itemIndex > -1) {
    cart.cartItems[itemIndex].quantity = quantity;
  } else {
    return next(new AppError(`There is no cartItem for this cartItemId: ${req.params.cartItemId}`, 404));
  }

  // calculate total cart price
  cart.totalCartPrice = calcTotalCartPrice(cart);

  await cart.save();

  return res.status(200).json({
    status: 'success',
    message: 'Product qunatity updated successfully',
    numOfCartItems: cart.cartItems.length,
    data: cart
  })
})

// @desc    Apply Coupon to logged User
// @route   PUT /api/v1/cart/applyCoupon
// @access  Private/User
const applyCoupon = asyncHandler(async (req, res, next) => {
  // 1) get coupon based on coupon name
  const coupon = await CouponModel.findOne({ name: req.body.coupon, expire: { $gt: Date.now() } });
  if (!coupon) {
    return next(new AppError('Coupon is expired or invalid'))
  }
  // 2) get logged user cart to get totalCartPrice
  const cart = await CartModel.findOne({ user: req.user._id });

  // 3) calculate total cart price after discount
  cart.totalPriceAfterDiscount = (cart.totalCartPrice - (cart.totalCartPrice * coupon.discount) / 100).toFixed(2); // 99.66

  await cart.save();
  
  return res.status(200).json({
    status: 'success',
    message: 'Coupon applied successfully',
    numOfCartItems: cart.cartItems.length,
    data: cart
  })
})

export {
  addProductToCart,
  getLoggedUserCart,
  removeSpecificCartItem,
  clearLoggedUserCart,
  updateCartItemQuantity,
  applyCoupon
}
