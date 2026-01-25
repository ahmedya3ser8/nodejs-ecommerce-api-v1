import Stripe from 'stripe';
import asyncHandler from '../middlewares/asyncHandler.js';
import OrderModel from '../models/order.model.js';
import CartModel from '../models/cart.model.js';
import ProductModel from '../models/product.model.js';
import UserModel from '../models/user.model.js';
import AppError from '../utils/appError.js';
import factory from './handlerFactory.js';

const stripe = new Stripe(process.env.STRIPE_SECRET);

const createFilterObj = (req, res, next) => {
  let filter = {};
  if (req.user.role === 'user') filter = { user: req.user._id };
  req.filterObj = filter;
  next();
}

// @desc    Create Cash Order
// @route   POST /api/v1/orders/:cartId
// @access  Private/User
const createCashOrder = asyncHandler(async (req, res, next) => {
  // app settings (added by admin)
  const taxPrice = 0;
  const shippingPrice = 0;

  // 1) get cart based on cartId
  const cart = await CartModel.findById(req.params.cartId);
  if (!cart) {
    return next(new AppError(`There is no cart with this id: ${req.params.cartId}`, 404))
  }

  // 2) if coupon apply take priceAfterDiscount if not take totalCartPrice
  const cartPrice = cart.totalPriceAfterDiscount ? cart.totalPriceAfterDiscount : cart.totalCartPrice;
  const totalOrderPrice = cartPrice + taxPrice + shippingPrice;

  // 3) create order with cash
  const order = await OrderModel.create({
    user: req.user._id,
    cartItems: cart.cartItems,
    shippingAddress: req.body.shippingAddress,
    totalOrderPrice
  })

  // 4) after create order decrease product quantity and increase product sold
  if (order) {
    const bulkOption = cart.cartItems.map((item) => ({
      updateOne: {
        filter: { _id: item.product },
        update: { $inc: { quantity: -item.quantity, sold: +item.quantity } }
      }
    }))
    await ProductModel.bulkWrite(bulkOption, {});

    // 5) clear user cart
    await CartModel.findByIdAndDelete(req.params.cartId);
  }
  return res.status(201).json({
    status: 'success',
    data: order
  })
})

// @desc    Get All Orders
// @route   GET /api/v1/orders
// @access  Private/User/Admin
const getOrders = factory.getAll(OrderModel);

// @desc    Get Specific Order
// @route   GET /api/v1/orders/:id
// @access  Private/User/Admin
const getOrder = factory.getOne(OrderModel);

// @desc    Update Order Paid Status
// @route   PUT /api/v1/orders/:id/paid
// @access  Private/Admin
const updateOrderPaidStatus = asyncHandler( async (req, res, next) => {
  const order = await OrderModel.findById(req.params.id);
  if (!order) {
    return next(new AppError(`There is no order with this id: ${req.params.id}`, 404))
  }

  order.isPaid = true;
  order.paidAt = Date.now();
  const updatedOrder = await order.save();
  
  return res.status(200).json({
    status: 'success',
    data: updatedOrder
  })
})

// @desc    Update Order Delivered Status
// @route   PUT /api/v1/orders/:id/deliver
// @access  Private/Admin
const updateOrderDeliveredStatus = asyncHandler( async (req, res, next) => {
  const order = await OrderModel.findById(req.params.id);
  if (!order) {
    return next(new AppError(`There is no order with this id: ${req.params.id}`, 404))
  }
  
  order.isDelivered = true;
  order.deliveredAt = Date.now();
  const updatedOrder = await order.save();

  return res.status(200).json({
    status: 'success',
    data: updatedOrder
  })
})

// @desc    Get Checkout Session From Stripe And Send It As Response
// @route   POST /api/v1/orders/checkout-session/:cartId
// @access  Private/User
const checkoutSession = asyncHandler(async (req, res, next) => {
  // app settings (added by admin)
  const taxPrice = 0;
  const shippingPrice = 0;

  // 1) get cart based on cartId
  const cart = await CartModel.findById(req.params.cartId);
  if (!cart) {
    return next(new AppError(`There is no cart with this id: ${req.params.cartId}`, 404))
  }

  // 2) if coupon apply take priceAfterDiscount if not take totalCartPrice
  const cartPrice = cart.totalPriceAfterDiscount ? cart.totalPriceAfterDiscount : cart.totalCartPrice;
  const totalOrderPrice = cartPrice + taxPrice + shippingPrice;

  // 3) create stripe checkout session
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: 'egp',
          product_data: {
            name: `Order for ${req.user.fullName}`
          },
          unit_amount: totalOrderPrice * 100
        },
        quantity: 1
      }
    ],
    mode: 'payment',
    success_url: `${req.protocol}://${req.get('host')}/orders`,
    cancel_url: `${req.protocol}://${req.get('host')}/cart`,
    customer_email: req.user.email,
    client_reference_id: req.params.cartId,
    metadata: req.body.shippingAddress
  })

  // 4) send session to eesponse
  return res.status(200).json({
    status: 'success',
    session
  })
})

const createCardOrder = async (session) => {
  const cartId = session.client_reference_id;
  const shippingAddress = session.metadata || {};
  const oderPrice = session.amount_total / 100;

  const cart = await CartModel.findById(cartId);
  if (!cart) {
    return next(new AppError(`There is no cart with this id: ${cartId}`, 404))
  }

  const user = await UserModel.findOne({ email: session.customer_email });
  if (!user) {
    return next(new AppError(`There is no user with this id: ${user._id}`, 404))
  }

  // 1) create order with card
  const order = await OrderModel.create({
    user: user._id,
    cartItems: cart.cartItems,
    shippingAddress,
    totalOrderPrice: oderPrice,
    isPaid: true,
    paidAt: Date.now(),
    paymentMethodType: 'card'
  });

  // 2) after create order decrease product quantity and increase product sold
  if (order) {
    const bulkOption = cart.cartItems.map((item) => ({
      updateOne: {
        filter: { _id: item.product },
        update: { $inc: { quantity: -item.quantity, sold: +item.quantity } }
      }
    }))
    await ProductModel.bulkWrite(bulkOption, {});

    // 3) clear user cart
    await CartModel.findByIdAndDelete(cartId);
  }
}

// @desc    Webhook Will Run When Stripe Payment Success
// @route   POST /webhook-checkout
// @access  Private/User
const webhookCheckout = asyncHandler(async (req, res, next) => {
  console.log("🔥 STRIPE HIT RAILWAY");
  const sig = req.headers["stripe-signature"];
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  if (event.type === 'checkout.session.completed') {
    console.log("Payment success");
    await createCardOrder(event.data.object);
  }
  res.status(200).json({ received: true });
})

export {
  createCashOrder,
  getOrders,
  getOrder,
  updateOrderPaidStatus,
  updateOrderDeliveredStatus,
  checkoutSession,
  webhookCheckout,
  createFilterObj
}
