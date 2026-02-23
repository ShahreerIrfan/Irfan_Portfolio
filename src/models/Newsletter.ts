import mongoose, { Schema, Document } from 'mongoose';

export interface INewsletter extends Document {
  email: string;
  name: string;
  subscribedAt: Date;
  active: boolean;
  source: string;
}

const NewsletterSchema = new Schema<INewsletter>(
  {
    email: { type: String, required: true, unique: true },
    name: { type: String, default: '' },
    active: { type: Boolean, default: true },
    source: { type: String, default: 'website' },
  },
  { timestamps: { createdAt: 'subscribedAt', updatedAt: true } }
);

export default mongoose.models.Newsletter || mongoose.model<INewsletter>('Newsletter', NewsletterSchema);
