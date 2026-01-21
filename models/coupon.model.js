import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Coupon Name is required'],
      unique: true,
      trim: true
    },
    expire: {
      type: Date,
      required: [true, 'Coupon expireTime is required']
    },
    discount: {
      type: Number,
      required: [true, 'Coupon discount is required']
    }
  }, { timestamps: true }
)

export default mongoose.model('Coupon', couponSchema);
