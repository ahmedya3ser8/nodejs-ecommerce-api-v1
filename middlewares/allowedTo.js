import AppError from "../utils/appError.js";
import asyncHandler from "./asyncHandler.js";

const allowedTo = (...roles) => {
  return asyncHandler(async (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError('You are not allowed to access this route', 403))
    }
    next();
  })
}

export default allowedTo;
