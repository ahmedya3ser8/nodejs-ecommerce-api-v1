import mongoose from "mongoose";

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
    }
  }, 
  { timestamps: true }
);

export default mongoose.model('User', userSchema);
