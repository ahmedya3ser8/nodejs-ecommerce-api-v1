import UserModel from '../models/user.model.js';
import asyncHandler from '../middlewares/asyncHandler.js';

// @desc    Add Product To Wishlist
// @route   POST /api/v1/wishlist
// @access  Protect/User
const addProductToWishlist = asyncHandler(async (req, res, next) => {
  // $addToSet operator -> add productId to wishlist array if productId exist
  const user = await UserModel.findByIdAndUpdate(
    req.user._id, {
      $addToSet: { wishlist: req.body.productId }
    },
    { new: true }
  )
  return res.status(201).json({
    status: 'success',
    message: 'Product added to wishlist successfully.',
    data: user.wishlist
  })
})

// @desc    Remove Product To Wishlist
// @route   DELETE /api/v1/wishlist/:productId
// @access  Protect/User
const removeProductToWishlist = asyncHandler(async (req, res, next) => {
  // $pull operator -> remove productId from wishlist array if productId exist
  const user = await UserModel.findByIdAndUpdate(
    req.user._id, {
      $pull: { wishlist: req.params.productId }
    },
    { new: true }
  )
  return res.status(200).json({
    status: 'success',
    message: 'Product removed to wishlist successfully.',
    data: user.wishlist
  })
})

// @desc    Get Logged User Wishlist
// @route   GET /api/v1/wishlist
// @access  Protect/User
const getLoggedUserWishlist = asyncHandler(async (req, res, next) => {
  const user = await UserModel.findById(req.user._id).populate('wishlist');
  return res.status(200).json({
    status: 'success',
    results: user.wishlist.length,
    data: user.wishlist
  })
})

export {
  addProductToWishlist,
  removeProductToWishlist,
  getLoggedUserWishlist
}