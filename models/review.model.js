import mongoose from "mongoose";
import ProductModel from "./product.model.js";

const reviewSchema = new mongoose.Schema(
  {
    title: String,
    ratings: {
      type: Number,
      min: [1, 'Min Rating value is 1'],
      max: [5, 'Max Rating value is 5'],
      required: [true, 'Rating is required']
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must be belong to user']
    },
    // parent ref (one to many)
    product: {
      type: mongoose.Schema.ObjectId,
      ref: 'Product',
      required: [true, 'Review must be belong to product']
    },
  }, { timestamps: true }
)

reviewSchema.pre(/^find/, function() {
  this.populate({
    path: 'user',
    select: 'fullName profileImage'
  })
})

reviewSchema.statics.calcAverageRatingsAndQuantity = async function (productId) {
  const result = await this.aggregate([
    // 1) Get all reviews for specific product
    { 
      $match: { product : productId } 
    },
    // 2) Grouping reviews base on productId and calculate ratingsAverage, ratingsQuantity
    {
      $group: { 
        _id: '$product', 
        ratingsAverage: { $avg: '$ratings' }, 
        ratingsQuantity: { $sum: 1 } 
      }
    }
  ]);
  if (result.length > 0) {
    await ProductModel.findByIdAndUpdate(productId, { 
      ratingsAverage: result[0].ratingsAverage, 
      ratingsQuantity: result[0].ratingsQuantity 
    })
  } else {
    await ProductModel.findByIdAndUpdate(productId, { 
      ratingsAverage: 0, 
      ratingsQuantity: 0 
    })
  }
}

reviewSchema.post('save', async function () {
  await this.constructor.calcAverageRatingsAndQuantity(this.product);
})

reviewSchema.post('deleteOne', { document: true }, async function () {
  await this.constructor.calcAverageRatingsAndQuantity(this.product);
})

export default mongoose.model('Review', reviewSchema);
