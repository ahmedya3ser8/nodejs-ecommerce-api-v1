import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Category is required'],
      unique: true,
      minlength: [3, 'Too Short category name'],
      maxlength: [32, 'Too Long category name'],
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
    const imageUrl = `${process.env.BASE_URL}/categories/${doc.image}`;
    doc.image = imageUrl;
  }
}

// fineOne, findAll, update
categorySchema.post('init', (doc) => {
  setImageUrl(doc);
})

// create
categorySchema.post('save', (doc) => {
  setImageUrl(doc);
})

export default mongoose.model('Category', categorySchema);
