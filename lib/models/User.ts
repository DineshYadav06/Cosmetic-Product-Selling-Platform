import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  isVerified: boolean;
  otp?: string;
  otpExpires?: Date;
  role: 'user' | 'admin';
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
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  cart: [{
    product: { type: Schema.Types.ObjectId, ref: 'Product' },
    quantity: { type: Number, default: 1 }
  }]
}, { timestamps: true });

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
