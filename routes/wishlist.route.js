import express from 'express';

import {
  addProductToWishlistValidator,
  removeProductFromWishlistValidator
} from '../utils/validators/wishlistValidator.js';
import { 
  addProductToWishlist,
  removeProductToWishlist,
  getLoggedUserWishlist
} from '../services/wishlist.service.js';
import protect from '../middlewares/protect.js';
import allowedTo from '../middlewares/allowedTo.js';

const router = express.Router();

router.use(protect, allowedTo('user'));

router.route('/')
  .get(getLoggedUserWishlist)
  .post(addProductToWishlistValidator, addProductToWishlist)

router
  .delete('/:productId', removeProductFromWishlistValidator, removeProductToWishlist)

export default router;
