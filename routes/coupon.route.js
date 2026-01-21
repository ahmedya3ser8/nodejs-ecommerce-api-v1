import express from 'express';

import { 
  addCouponValidator,
  updateCouponValidator,
  getCouponValidator,
  deleteCouponValidator
} from '../utils/validators/couponValidator.js';
import { 
  getCoupons,
  getCoupon,
  createCoupon,
  updateCoupon,
  deleteCoupon
} from '../services/coupon.service.js';
import protect from '../middlewares/protect.js';
import allowedTo from '../middlewares/allowedTo.js';

const router = express.Router();

router.use(protect, allowedTo('admin'));

router.route('/')
  .get(getCoupons)
  .post(addCouponValidator, createCoupon)

router.route('/:id')
  .get(getCouponValidator, getCoupon)
  .put(updateCouponValidator, updateCoupon)
  .delete(deleteCouponValidator, deleteCoupon)

export default router;
