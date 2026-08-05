import mongoose, { Schema, Document } from 'mongoose';

export interface ISiteSettings extends Document {
  storeName: string;
  supportEmail: string;
  announcementText: string;
  heroOffer: string;
  freeShippingThreshold: number;
}

const SiteSettingsSchema: Schema = new Schema({
  storeName: { type: String, default: 'GlowMart India' },
  supportEmail: { type: String, default: 'help@glowmartindia2026.in' },
  announcementText: { type: String, default: 'FREE SHIPPING ON ALL ORDERS OVER ₹999' },
  heroOffer: { type: String, default: 'FLAT 50% OFF ON BESTSELLERS' },
  freeShippingThreshold: { type: Number, default: 1999 },
}, { timestamps: true });

const SiteSettings = (mongoose.models.SiteSettings as mongoose.Model<ISiteSettings>) || mongoose.model<ISiteSettings>('SiteSettings', SiteSettingsSchema);
export default SiteSettings;
