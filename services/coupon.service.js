import CouponModel from '../models/coupon.model.js';
import factory from './handlerFactory.js';

// @desc    Get All Coupons
// @route   GET /api/v1/coupons
// @access  Private/Admin
const getCoupons = factory.getAll(CouponModel);

// @desc    Get Specific Coupon By Id
// @route   GET /api/v1/coupons/:id
// @access  Private/Admin
const getCoupon = factory.getOne(CouponModel);

// @desc Create Coupon
// @route POST /api/v1/coupons
// @acess Private/Admin
const createCoupon = factory.createOne(CouponModel);

// @desc Update Specific Coupon By Id
// @route PUT /api/v1/coupons/:id
// @acess Private/Admin
const updateCoupon = factory.updateOne(CouponModel);

// @desc delete Specific Coupon By Id
// @route DELETE /api/v1/coupons/:id
// @acess Private/Admin
const deleteCoupon = factory.deleteOne(CouponModel);

export {
  getCoupons,
  getCoupon,
  createCoupon,
  updateCoupon,
  deleteCoupon
};
