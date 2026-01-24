import express from 'express';

import { 
  createCashOrder,
  getOrders,
  getOrder,
  updateOrderPaidStatus,
  updateOrderDeliveredStatus,
  checkoutSession,
  createFilterObj
} from '../services/order.service.js';
import protect from '../middlewares/protect.js';
import allowedTo from '../middlewares/allowedTo.js';

const router = express.Router();

router.use(protect);

router.post('/checkout-session/:cartId', allowedTo('user'), checkoutSession)

router.route('/:cartId').post(allowedTo('user'), createCashOrder)

router.get('/', allowedTo('user', 'admin'), createFilterObj, getOrders)

router.get('/:id', allowedTo('user', 'admin'), getOrder)

router.put('/:id/paid', allowedTo('admin'), updateOrderPaidStatus);
router.put('/:id/deliver', allowedTo('admin'), updateOrderDeliveredStatus);

export default router;
