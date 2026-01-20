import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      trim: true,
      required: [true, 'FullName is required']
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true
    },
    phoneNumber: String,
    profileImage: String,
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Too Short password'],
    },
    passwordChangeAt: Date,
    passwordResetCode: String,
    passwordResetExpires: Date,
    passwordResetVerified: Boolean,
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user'
    },
    active: {
      type: Boolean,
      default: true
    },
    // child reference (one to many)
    wishlist: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Product'
      }
    ],
    addresses: [
      {
        id: mongoose.Schema.ObjectId,
        alias: String,
        details: String,
        phoneNumber: String,
        city: String,
        postalCode: String
      }
    ]
  }, 
  { timestamps: true }
);

const setImageUrl = (doc) => {
  if (doc.profileImage) {
    const imageUrl = `${process.env.BASE_URL}/users/${doc.profileImage}`;
    doc.profileImage = imageUrl;
  }
}

// fineOne, findAll, update
userSchema.post('init', (doc) => {
  setImageUrl(doc);
})

// create
userSchema.post('save', (doc) => {
  setImageUrl(doc);
})

// create User
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 12);
})

export default mongoose.model('User', userSchema);
