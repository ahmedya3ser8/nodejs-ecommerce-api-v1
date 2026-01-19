import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      minlength: [3, 'Too short product title'],
      maxlength: [100, 'Too long product title'],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      minlength: [20, 'Too short product description'],
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required']
    },
    sold: {
      type: Number,
      default: 0
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      max: [200000, 'Too long product price']
    },
    priceAfterDiscount: {
      type: Number,
    },
    colors: [String],
    imageCover: {
      type: String,
      required: [true, 'ImageCover is required']
    },
    images: [String],
    category: {
      type: mongoose.Schema.ObjectId,
      ref: 'Category',
      required: [true, 'Product must be belong to category'],
    },
    subcategories: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'SubCategory',
      }
    ],
    brand: {
      type: mongoose.Schema.ObjectId,
      ref: 'Brand',
    },
    ratingsAverage: {
      type: Number,
      min: [1, 'Rating must be above or equal 1.0'],
      max: [5, 'Rating must be below or equal 5.0']
    },
    ratingsQuantity: {
      type: Number,
      default: 0
    }
  },
  { 
    timestamps: true, 
    // to enable virtual populate
    toJSON: { virtuals: true }, 
    toObject: { virtuals: true } 
  }
)

productSchema.virtual('reviews', { 
  ref: 'Review',
  foreignField: 'product',
  localField: '_id'
})

productSchema.pre(/^find/, function() {
  this.populate({
    path: 'category',
    select: 'name -_id'
  })
})

const setImageUrl = (doc) => {
  if (doc.imageCover) {
    const imageUrl = `${process.env.BASE_URL}/products/${doc.imageCover}`;
    doc.imageCover = imageUrl;
  }
  if (doc.images) {
    const imagesList = [];
    doc.images.forEach(img => {
      const imageUrl = `${process.env.BASE_URL}/products/${img}`;
      imagesList.push(imageUrl);
    })
    doc.images = imagesList;
  }
}

// fineOne, findAll, update
productSchema.post('init', (doc) => {
  setImageUrl(doc);
})

// create
productSchema.post('save', (doc) => {
  setImageUrl(doc);
})

export default mongoose.model('Product', productSchema);
