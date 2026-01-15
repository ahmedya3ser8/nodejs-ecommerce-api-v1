import mongoose from "mongoose";

const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Brand is required'],
      unique: true,
      minlength: [3, 'Too Short Brand name'],
      maxlength: [32, 'Too Long Brand name'],
      trim: true
    },
    slug: {
      type: String,
      lowercase: true
    },
    image: String
  },
  { timestamps: true }
)

const setImageUrl = (doc) => {
  if (doc.image) {
    const imageUrl = `${process.env.BASE_URL}/brands/${doc.image}`;
    doc.image = imageUrl;
  }
}

// fineOne, findAll, update
brandSchema.post('init', (doc) => {
  setImageUrl(doc);
})

// create
brandSchema.post('save', (doc) => {
  setImageUrl(doc);
})

export default mongoose.model('Brand', brandSchema);
