import express from 'express';

// import { 
//   getBrandValidator,
//   createBrandValidator,
//   updateBrandValidator,
//   deleteBrandValidator
// } from '../utils/validators/brandValidator.js';
import { 
  addProductToCart,
  getLoggedUserCart,
  removeSpecificCartItem,
  clearLoggedUserCart,
  updateCartItemQuantity,
  applyCoupon
} from '../services/cart.service.js';
import protect from '../middlewares/protect.js';
import allowedTo from '../middlewares/allowedTo.js';

const router = express.Router();

router.use(protect, allowedTo('user'));

router.put('/applyCoupon', applyCoupon);

router.route('/')
  .get(getLoggedUserCart)
  .post(addProductToCart)
  .delete(clearLoggedUserCart)

router.route('/:cartItemId')
  .put(updateCartItemQuantity)
  .delete(removeSpecificCartItem)

export default router;
