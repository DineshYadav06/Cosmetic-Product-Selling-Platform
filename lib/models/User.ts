import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  isVerified: boolean;
  otp?: string;
  otpExpires?: Date;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  dob?: string;
  phoneNumber?: string;
  building?: string;
  landmark?: string;
  location?: string;
  role: 'user' | 'admin' | 'seller';
  sellerDetails?: {
    storeName: string;
    phone: string;
    plan: 'basic' | 'pro' | 'premium';
    isApproved: boolean;
    joinedAt: Date;
    earnings: number;
  };
  cart: {
    product: mongoose.Types.ObjectId;
    quantity: number;
  }[];
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  isVerified: { type: Boolean, default: false },
  otp: { type: String },
  otpExpires: { type: Date },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
  dob: { type: String },
  phoneNumber: { type: String },
  building: { type: String },
  landmark: { type: String },
  location: { type: String },
  role: { type: String, enum: ['user', 'admin', 'seller'], default: 'user' },
  sellerDetails: {
    storeName: { type: String },
    phone: { type: String },
    plan: { type: String, enum: ['basic', 'pro', 'premium'], default: 'basic' },
    isApproved: { type: Boolean, default: false },
    joinedAt: { type: Date, default: Date.now },
    earnings: { type: Number, default: 0 }
  },
  cart: [{
    product: { type: Schema.Types.ObjectId, ref: 'Product' },
    quantity: { type: Number, default: 1 }
  }]
}, { timestamps: true });

const User = (mongoose.models.User as mongoose.Model<IUser>) || mongoose.model<IUser>('User', UserSchema);
export default User;
