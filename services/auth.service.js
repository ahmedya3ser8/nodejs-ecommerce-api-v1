import bcrypt from 'bcryptjs';
import crypto from 'crypto';

import asyncHandler from '../middlewares/asyncHandler.js';
import UserModel from '../models/user.model.js';
import AppError from '../utils/appError.js';
import generateJWT from '../utils/generateToken.js';
import sendEmail from '../utils/sendEmail.js';

const sanitizeUser = function(user) {
  return {
    _id: user._id,
    fullName: user.fullName,
    email: user.email,
    phoneNumber: user.phoneNumber
  };
};

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

  res.cookie('jwt', token, {
    maxAge: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90d
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true
  })

  return res.status(201).json({
    data: sanitizeUser(user),
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

  res.cookie('jwt', token, {
    maxAge: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90d
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true
  })

  return res.status(200).json({
    data: sanitizeUser(user),
    token
  })
})

// @desc    Forgot Password
// @route   POST /api/v1/auth/forgotPassword
// @access  Public
const forgotPassword = asyncHandler(async (req, res, next) => {
  // 1) get user by email
  const user = await UserModel.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError(`There is no user with this email: ${req.body.email}`, 404));
  }

  // 2) generate random 6-digit reset code and hash reset code and save to DB
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedResetCode = crypto.createHash('sha256').update(resetCode).digest('hex');
  
  user.passwordResetCode = hashedResetCode;
  user.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 min
  user.passwordResetVerified = false;

  await user.save();
  // 3) send reset code via email
  const message = `Hi ${user.fullName},\n We received a request to reset the password on your E-shop Account. \n Your reset code is: ${resetCode} \n Enter this code to complete the reset. It is valid for 10 minutes. \n If you did not request a password reset, please ignore this email.`
  try {
    await sendEmail({
      email: user.email,
      subject: 'Your Password Reset Code (valid for 10 min)',
      message
    })
  } catch (err) {
    user.passwordResetCode = undefined;
    user.passwordResetExpires = undefined;
    user.passwordResetVerified = undefined;
    await user.save();
    return next(new AppError('There was an error sending the email. Try again later!', 500));
  }
  
  return res.status(200).json({
    status: 'success',
    message: 'Reset code sent to email'
  })
})

// @desc    Verify Password Reset Code
// @route   POST /api/v1/auth/verifyResetCode
// @access  Public
const verifyPasswordResetCode = asyncHandler(async (req, res, next) => {
  // 1) get user base on reset code
  const hashedResetCode = crypto.createHash('sha256').update(req.body.resetCode).digest('hex');
  const user = await UserModel.findOne({ 
    passwordResetCode: hashedResetCode, 
    passwordResetExpires: { $gt: Date.now() } 
  });
  if (!user) {
    return next(new AppError('Invalid or expired reset code', 400));
  }
  // 2) reset code valid
  user.passwordResetVerified = true;
  await user.save();
  return res.status(200).json({
    status: 'success',
    message: 'Reset code verified successfully'
  })
})

// @desc    Verify Password Reset Code
// @route   PUT /api/v1/auth/resetPassword
// @access  Public
const resetPassword = asyncHandler(async (req, res, next) => {
  // 1) get user based on email
  const user = await UserModel.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError(`There is no user with this email: ${req.body.email}`, 404));
  }

  // 2) check reset code verified
  if (!user.passwordResetVerified) {
    return next(new AppError('Reset code not verified', 400));
  }

  user.password = req.body.newPassword;
  user.passwordResetCode = undefined;
  user.passwordResetExpires = undefined;
  user.passwordResetVerified = undefined;
  await user.save();

  // 3) generate new token
  const token = generateJWT({
    userId: user._id,
    email: user.email,
    role: user.role
  });

  res.cookie('jwt', token, {
    maxAge: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90d
    secure: process.env.NODE_ENV === 'production', 
    httpOnly: true
  })

  return res.status(200).json({
    status: 'success',
    message: 'Password has been reset successfully',
    token
  })
});

export {
  signUp,
  login,
  forgotPassword,
  verifyPasswordResetCode,
  resetPassword
}
