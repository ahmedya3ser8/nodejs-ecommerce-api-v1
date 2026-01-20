import express from 'express';

import {
  addAddressValidator,
  removeAddressValidator
} from '../utils/validators/addressValidator.js';
import { 
  addAddress,
  removeAddress,
  getLoggedUserAddressess
} from '../services/address.service.js';
import protect from '../middlewares/protect.js';
import allowedTo from '../middlewares/allowedTo.js';

const router = express.Router();

router.use(protect, allowedTo('user'));

router.route('/')
  .get(getLoggedUserAddressess)
  .post(addAddressValidator, addAddress)

router
  .delete('/:addressId', removeAddressValidator, removeAddress)

export default router;
