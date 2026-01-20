import UserModel from '../models/user.model.js';
import asyncHandler from '../middlewares/asyncHandler.js';

// @desc    Add Address To User Addressess List
// @route   POST /api/v1/addressess
// @access  Protect/User
const addAddress = asyncHandler(async (req, res, next) => {
  // $addToSet operator -> add addresObj to user addressess array if addressObj exist
  const user = await UserModel.findByIdAndUpdate(
    req.user._id, {
      $addToSet: { addresses: req.body }
    },
    { new: true }
  )
  return res.status(201).json({
    status: 'success',
    message: 'Address added successfully.',
    data: user.addresses
  })
})

// @desc    Remove Address From User Addressess List
// @route   DELETE /api/v1/addressess/:addressId
// @access  Protect/User
const removeAddress = asyncHandler(async (req, res, next) => {
  // $pull operator -> remove addresObj from user addressess array if addressObj exist
  const user = await UserModel.findByIdAndUpdate(
    req.user._id, {
      $pull: { addresses: { _id: req.params.addressId } }
    },
    { new: true }
  )
  return res.status(200).json({
    status: 'success',
    message: 'Address removed successfully.',
    data: user.addresses
  })
})

// @desc    Get Logged User Addressess List
// @route   GET /api/v1/addressess
// @access  Protect/User
const getLoggedUserAddressess = asyncHandler(async (req, res, next) => {
  const user = await UserModel.findById(req.user._id).populate('addresses');
  return res.status(200).json({
    status: 'success',
    results: user.addresses.length,
    data: user.addresses
  })
})

export {
  addAddress,
  removeAddress,
  getLoggedUserAddressess
}