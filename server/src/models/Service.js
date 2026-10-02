import mongoose from 'mongoose';

const serviceDetailsSchema = new mongoose.Schema({
  description: { type: String, default: '' },
  whatYouCanExplore: { type: [String], default: [] },
  beforeYourSession: { type: String, default: '' },
  note: { type: String, default: '' },
}, { _id: false });

const serviceSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, trim: true },
  name: { type: String, required: true, trim: true },
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  price: { type: String, required: true, trim: true },
  priceNumeric: { type: Number, default: 0, min: 0 },
  isCaseBased: { type: Boolean, default: false },
  image: { type: String, default: '' },
  badge: { type: String, default: '' },
  shortDescription: { type: String, required: true, trim: true },
  tags: { type: [String], default: [] },
  details: { type: serviceDetailsSchema, default: () => ({}) },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

export const Service = mongoose.models.Service || mongoose.model('Service', serviceSchema);
