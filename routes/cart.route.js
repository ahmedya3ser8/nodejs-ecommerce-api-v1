import express from 'express';

import { 
  addProductItemValidator,
  removeProductItemValidator,
  updateProductQuantityValidator
} from '../utils/validators/cartValidator.js';
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
  .post(addProductItemValidator, addProductToCart)
  .delete(clearLoggedUserCart)

router.route('/:cartItemId')
  .put(updateProductQuantityValidator, updateCartItemQuantity)
  .delete(removeProductItemValidator, removeSpecificCartItem)

export default router;
