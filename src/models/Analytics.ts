import mongoose, { Schema, Document } from 'mongoose';

export interface IAnalytics extends Document {
  page: string;
  slug: string;
  ip: string;
  country: string;
  city: string;
  userAgent: string;
  referrer: string;
  sessionId: string;
  createdAt: Date;
}

const AnalyticsSchema = new Schema<IAnalytics>(
  {
    page: { type: String, required: true },
    slug: { type: String, default: '' },
    ip: { type: String, default: '' },
    country: { type: String, default: 'Unknown' },
    city: { type: String, default: 'Unknown' },
    userAgent: { type: String, default: '' },
    referrer: { type: String, default: '' },
    sessionId: { type: String, default: '' },
  },
  { timestamps: true }
);

AnalyticsSchema.index({ page: 1, createdAt: -1 });
AnalyticsSchema.index({ sessionId: 1 });
AnalyticsSchema.index({ createdAt: -1 });

export default mongoose.models.Analytics || mongoose.model<IAnalytics>('Analytics', AnalyticsSchema);
