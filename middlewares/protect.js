import jwt from 'jsonwebtoken';

import asyncHandler from "./asyncHandler.js";
import UserModel from '../models/user.model.js';
import AppError from '../utils/appError.js';

const protect = asyncHandler(async (req, res, next) => {
  // 1) check if token exist

  // if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
  //   return next(new AppError('Not authorized, please login to access this route', 401));
  // }
  // const token = req.headers.authorization.split(' ')[1];

  const token = req.cookies.jwt;

  if (!token) {
    return next(new AppError('Not authorized, please login to access this route', 401));
  }

  // 2) verify token (changes happen, expire token)
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  // 3) check if user exists
  const currentUser = await UserModel.findById(decoded.userId);
  if (!currentUser) {
    return next(new AppError('The user belonging to this token no longer exists', 401));
  }

  // 4) check if user active or not
  if (!currentUser.active) {
    return next(new AppError('This account is deactivated. Please contact support', 400));
  }

  // 5) check if user change password after token created
  if (currentUser.passwordChangeAt) {
    const passwordChangeTime = parseInt(currentUser.passwordChangeAt.getTime() / 1000, 10);
    console.log(passwordChangeTime, decoded.iat);
    if (passwordChangeTime > decoded.iat) {
      return next(new AppError('Password was changed recently. Please login again', 401));
    }
  }
  
  req.user = currentUser;
  next();
})

export default protect;
