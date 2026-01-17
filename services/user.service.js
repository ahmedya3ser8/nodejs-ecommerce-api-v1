import { v4 as uuidv4  }  from 'uuid';
import sharp from 'sharp';
import bcrypt from 'bcryptjs';

import UserModel from '../models/user.model.js';
import factory from '../services/handlerFactory.js';
import asyncHandler from '../middlewares/asyncHandler.js';
import AppError from '../utils/AppError.js';
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
  const document = await UserModel.findByIdAndUpdate(req.params.id, {
    fullName: req.body.fullName,
    email: req.body.email,
    profileImage: req.body.profileImage,
    phoneNumber: req.body.phoneNumber,
    role: req.body.role,
    active: req.body.active,
  } , { new: true });
  if (!document) {
    return next(new AppError(`No document For This Id ${req.params.id}`, 404));
  }
  res.status(200).json({
    data: document
  })
})

// @desc Update Specific User Password By Id
// @route PUT /api/v1/users/changePassword/:id
// @acess Private/Admin
const changeUserPassword = asyncHandler(async (req, res, next) => {
  const document = await UserModel.findByIdAndUpdate(req.params.id, {
    password: await bcrypt.hash(req.body.password, 12),
    passwordChangeAt: Date.now()
  } , { new: true });
  if (!document) {
    return next(new AppError(`No document For This Id ${req.params.id}`, 404));
  }
  res.status(200).json({
    data: document
  })
})

// @desc delete Specific User By Id
// @route DELETE /api/v1/users/:id
// @acess Private/Admin
const deleteUser = factory.deleteOne(UserModel);

export {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  changeUserPassword,
  uploadUserImage,
  resizeImage
};

