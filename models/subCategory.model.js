import mongoose from "mongoose";

const subCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      unique: true,
      minlength: [2, 'Too Short subCategory name'],
      maxlength: [32, 'Too Long subCategory name'],
    },
    slug: {
      type: String,
      lowercase: true
    },
    category: {
      type: mongoose.Schema.ObjectId,
      ref: 'Category',
      required: [true, 'SubCategory must be belong to category'],
    }
  }, 
  { timestamps: true }
)

export default mongoose.model('SubCategory', subCategorySchema);
