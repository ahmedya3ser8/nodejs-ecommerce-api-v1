import express from 'express';

import { 
  createCashOrder,
  getOrders,
  getOrder,
  updateOrderPaidStatus,
  updateOrderDeliveredStatus,
  createFilterObj
} from '../services/order.service.js';
import protect from '../middlewares/protect.js';
import allowedTo from '../middlewares/allowedTo.js';

const router = express.Router();

router.use(protect);

router.route('/:cartId').post(allowedTo('user'), createCashOrder)

router.route('/').get(allowedTo('user', 'admin'), createFilterObj, getOrders)

router.route('/:id').get(allowedTo('user', 'admin'), getOrder)

router.put('/:id/paid', allowedTo('admin'), updateOrderPaidStatus);
router.put('/:id/deliver', allowedTo('admin'), updateOrderDeliveredStatus);

export default router;
