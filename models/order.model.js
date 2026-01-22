import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Order must be belong to user']
    },
    cartItems: [
      {
        product: {
          type: mongoose.Schema.ObjectId,
          ref: 'Product'
        },
        quantity: Number,
        color: String,
        price: Number
      }
    ],
    taxPrice: {
      type: Number,
      default: 0
    },
    shippingPrice: {
      type: Number,
      default: 0
    },
    shippingAddress: {
      details: String,
      phoneNumber: String,
      city: String,
      postalCode: String
    },
    totalOrderPrice: Number,
    paymentMethodType: {
      type: String,
      enum: ['cash', 'card'],
      default: 'cash'
    },
    isPaid: {
      type: Boolean,
      default: false
    },
    paidAt: Date,
    isDelivered: {
      type: Boolean,
      default: false
    },
    deliveredAt: Date
  }, 
  { timestamps: true }
)

orderSchema.pre(/^find/, function() {
  this.populate({
    path: 'cartItems.product'
  }).populate({
    path: 'user',
    select: 'fullName email phoneNumber profileImage'
  })
})

export default mongoose.model('Order', orderSchema);
