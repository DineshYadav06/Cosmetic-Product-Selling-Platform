import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  brand: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  description: string;
  rating: number;
  reviews: number;
  category: string;
  inStock: boolean;
  stockCount: number;
  skinType?: string[]; // e.g. ["Oily", "Dry"]
  concerns?: string[]; // e.g. ["Acne", "Dark Spots"]
  benefits?: string;
  sellerId?: mongoose.Types.ObjectId;
  isFeatured?: boolean;
}

const ProductSchema: Schema = new Schema({
  brand: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  originalPrice: { type: Number },
  image: { type: String, required: true },
  description: { type: String, default: "A premium fragrance for the modern man." },
  rating: { type: Number, default: 0 },
  reviews: { type: Number, default: 0 },
  category: { type: String, required: true, default: "Fragrance" },
  inStock: { type: Boolean, default: true },
  stockCount: { type: Number, default: 50 },
  skinType: [{ type: String }],
  concerns: [{ type: String }],
  benefits: { type: String },
  sellerId: { type: Schema.Types.ObjectId, ref: 'User' },
  isFeatured: { type: Boolean, default: false },
}, { timestamps: true });

const Product = (mongoose.models.Product as mongoose.Model<IProduct>) || mongoose.model<IProduct>('Product', ProductSchema);
export default Product;
