import bcrypt from 'bcryptjs';

import asyncHandler from '../middlewares/asyncHandler.js';
import UserModel from '../models/user.model.js';
import AppError from '../utils/AppError.js';
import generateJWT from '../utils/generateToken.js';

// @desc    SignUp
// @route   POST /api/v1/auth/signup
// @access  Public
const signUp = asyncHandler(async (req, res, next) => {
  const user = await UserModel.create({
    fullName: req.body.fullName,
    email: req.body.email,
    password: req.body.password,
    phoneNumber: req.body.phoneNumber
  });

  const token = generateJWT({
    userId: user._id,
    email: user.email,
    role: user.role
  });

  user.password = undefined;

  return res.status(201).json({
    data: user,
    token
  })
})

// @desc    Login
// @route   POST /api/v1/auth/login
// @access  Public
const login = asyncHandler(async (req, res, next) => {
  const user = await UserModel.findOne({ email: req.body.email });
  if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  const token = generateJWT({
    userId: user._id,
    email: user.email,
    role: user.role
  });

  user.password = undefined;

  return res.status(200).json({
    data: user,
    token
  })
})


export {
  signUp,
  login
}
