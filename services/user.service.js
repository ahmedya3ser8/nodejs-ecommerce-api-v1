import { v4 as uuidv4  }  from 'uuid';
import sharp from 'sharp';
import bcrypt from 'bcryptjs';

import UserModel from '../models/user.model.js';
import factory from '../services/handlerFactory.js';
import asyncHandler from '../middlewares/asyncHandler.js';
import AppError from '../utils/AppError.js';
import generateJWT from '../utils/generateToken.js';
import { uploadSingleImage } from '../middlewares/uploadImage.js';

const uploadUserImage = uploadSingleImage('profileImage');

const resizeImage = asyncHandler(async (req, res, next) => {
  if (!req.file) return next();
  const fileName = `user-${uuidv4()}-${Date.now()}.jpeg`;
  if (req.file) {
    await sharp(req.file.buffer)
      .resize(400,400)
      .toFormat('jpeg')
      .jpeg({ quality: 100 })
      .toFile(`uploads/users/${fileName}`);
    // save img in DB
    req.body.profileImage = fileName;
  }
  next();
});

// @desc    Get All Users
// @route   GET /api/v1/users
// @access  Private/Admin
const getUsers = factory.getAll(UserModel);

// @desc    Get Specific User By Id
// @route   GET /api/v1/users/:id
// @access  Private/Admin
const getUser = factory.getOne(UserModel);

// @desc Create User
// @route POST /api/v1/users
// @acess Private/Admin
const createUser = factory.createOne(UserModel);

// @desc Update Specific User By Id
// @route PUT /api/v1/users/:id
// @acess Private/Admin
const updateUser = asyncHandler(async (req, res, next) => {
  const user = await UserModel.findByIdAndUpdate(req.params.id, {
    fullName: req.body.fullName,
    email: req.body.email,
    profileImage: req.body.profileImage,
    phoneNumber: req.body.phoneNumber,
    role: req.body.role,
    active: req.body.active,
  } , { new: true });
  if (!user) {
    return next(new AppError(`No user For This Id ${req.params.id}`, 404));
  }
  res.status(200).json({
    data: user
  })
})

// @desc Update Specific User Password By Id
// @route PUT /api/v1/users/changePassword/:id
// @acess Private/Admin
const changeUserPassword = asyncHandler(async (req, res, next) => {
  const user = await UserModel.findByIdAndUpdate(req.params.id, {
    password: await bcrypt.hash(req.body.password, 12),
    passwordChangeAt: Date.now()
  } , { new: true });
  if (!user) {
    return next(new AppError(`No user For This Id ${req.params.id}`, 404));
  }
  res.status(200).json({
    data: user
  })
})

// @desc Deactivate Specific User By Id
// @route DELETE /api/v1/users/:id
// @acess Private/Admin
const deleteUser = asyncHandler(async (req, res, next) => {
  await UserModel.findByIdAndUpdate(req.params.id, { active: false });
  return res.status(200).json({
    status: 'success'
  });
})

// @desc    Get Logged User Data
// @route   GET /api/v1/users/getMe
// @access  Private/Protect
const getLoggedUserData = asyncHandler(async (req, res, next) => {
  req.params.id = req.user._id;
  next();
})

// @desc    Update Logged User Password
// @route   PUT /api/v1/users/updateMyPassword
// @access  Private/Protect
const updateLoggedUserPassword = asyncHandler(async (req, res, next) => {
  // 1) update user password based on user payload (req.user._id)
  const user = await UserModel.findByIdAndUpdate(req.user._id, {
    password: await bcrypt.hash(req.body.password, 12),
    passwordChangeAt: Date.now()
  } , { new: true });

  user.password = undefined;

  const token = generateJWT({
    userId: user._id,
    email: user.email,
    role: user.role
  });

  res.status(200).json({
    status: 'success',
    message: 'Password updated successfully',
    data: user,
    token
  })
})

// @desc    Update Logged User Data without(password, role, active)
// @route   PUT /api/v1/users/updateMe
// @access  Private/Protect
const updateLoggedUserData = asyncHandler(async (req, res, next) => {
  const updatedUser = await UserModel.findByIdAndUpdate(req.user._id, {
    fullName: req.body.fullName,
    email: req.body.email,
    phoneNumber: req.body.phoneNumber
  }, { new: true });
  return res.status(200).json({
    data: updatedUser
  })
})

// @desc    Deactivate Logged User
// @route   DELETE /api/v1/users/deleteMe
// @access  Private/Protect
const deleteLoggedUserData = asyncHandler(async (req, res, next) => {
  await UserModel.findByIdAndUpdate(req.user._id, { active: false });
  return res.status(200).json({
    status: 'success'
  });
})

export {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  changeUserPassword,
  uploadUserImage,
  resizeImage,
  getLoggedUserData,
  updateLoggedUserPassword,
  updateLoggedUserData,
  deleteLoggedUserData
};
