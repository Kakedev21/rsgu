import mongoose, { Schema, models } from 'mongoose';

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    username: {
      type: String,
      required: true,
      unique: true
    },
    email: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    role: {
      type: String
    },
    department: {
      type: String,
      required: true
    },
    srCode: {
      type: String
    },
    course: {
      type: String
    },
    verified: {
      type: Boolean,
      default: false
    },
    contactNumber: {
      type: String
    },
    verificationToken: { type: String },
    isVerified: { type: Boolean, default: false },
    resetPasswordToken: String,
    resetPasswordExpires: Date
  },
  { timestamps: true }
);

const User = models.users || mongoose.model('users', UserSchema);

export default User;
