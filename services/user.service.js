import { v4 as uuidv4  }  from 'uuid';
import sharp from 'sharp';

import UserModel from '../models/user.model.js';
import factory from '../services/handlerFactory.js';
import asyncHandler from '../middlewares/asyncHandler.js';
import { uploadSingleImage } from '../middlewares/uploadImage.js';

const uploadUserImage = uploadSingleImage('profileImage');

const resizeImage = asyncHandler(async (req, res, next) => {
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
// @access  Private
const getUsers = factory.getAll(UserModel);

// @desc    Get Specific User By Id
// @route   GET /api/v1/users/:id
// @access  Private
const getUser = factory.getOne(UserModel);

// @desc Create User
// @route POST /api/v1/users
// @acess Private
const createUser = factory.createOne(UserModel);

// @desc Update Specific User By Id
// @route PUT /api/v1/users/:id
// @acess Private
const updateUser = factory.updateOne(UserModel);

// @desc delete Specific User By Id
// @route DELETE /api/v1/users/:id
// @acess Private
const deleteUser = factory.deleteOne(UserModel);

export {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  uploadUserImage,
  resizeImage
};

