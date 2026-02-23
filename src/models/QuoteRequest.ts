import mongoose, { Schema, Document } from 'mongoose';

export interface IQuoteRequest extends Document {
  name: string;
  email: string;
  phone: string;
  company: string;
  projectType: string;
  budget: string;
  timeline: string;
  description: string;
  features: string[];
  status: 'new' | 'reviewed' | 'quoted' | 'accepted' | 'declined';
  quotedAmount: string;
  adminNotes: string;
  createdAt: Date;
  updatedAt: Date;
}

const QuoteRequestSchema = new Schema<IQuoteRequest>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, default: '' },
    company: { type: String, default: '' },
    projectType: { type: String, required: true },
    budget: { type: String, default: '' },
    timeline: { type: String, default: '' },
    description: { type: String, required: true },
    features: [{ type: String }],
    status: { type: String, enum: ['new', 'reviewed', 'quoted', 'accepted', 'declined'], default: 'new' },
    quotedAmount: { type: String, default: '' },
    adminNotes: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.models.QuoteRequest || mongoose.model<IQuoteRequest>('QuoteRequest', QuoteRequestSchema);
