import mongoose, { Schema, Document } from 'mongoose';

export interface ITestimonial extends Document {
  name: string;
  role: string;
  company: string;
  avatar: string;
  content: string;
  rating: number;
  featured: boolean;
  published: boolean;
  order: number;
  projectUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

const TestimonialSchema = new Schema<ITestimonial>(
  {
    name: { type: String, required: true },
    role: { type: String, default: '' },
    company: { type: String, default: '' },
    avatar: { type: String, default: '' },
    content: { type: String, required: true },
    rating: { type: Number, default: 5, min: 1, max: 5 },
    featured: { type: Boolean, default: false },
    published: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
    projectUrl: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.models.Testimonial || mongoose.model<ITestimonial>('Testimonial', TestimonialSchema);
