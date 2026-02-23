import mongoose, { Schema, Document } from 'mongoose';

export interface IService extends Document {
  title: string;
  slug: string;
  description: string;
  longDescription: string;
  icon: string;
  gradient: string;
  features: string[];
  published: boolean;
  featured: boolean;
  order: number;
  price: string;
  createdAt: Date;
  updatedAt: Date;
}

const ServiceSchema = new Schema<IService>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    longDescription: { type: String, default: '' },
    icon: { type: String, default: 'Code2' },
    gradient: { type: String, default: 'from-blue-500 to-cyan-400' },
    features: [{ type: String }],
    published: { type: Boolean, default: true },
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
    price: { type: String, default: '' },
  },
  { timestamps: true }
);

ServiceSchema.index({ published: 1, order: 1 });

export default mongoose.models.Service || mongoose.model<IService>('Service', ServiceSchema);
