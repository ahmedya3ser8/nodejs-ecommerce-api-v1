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
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user'
    },
    active: {
      type: Boolean,
      default: true
    },
    passwordChangeAt: Date,
    passwordResetCode: String,
    passwordResetExpires: Date,
    passwordResetVerified: Boolean,
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
