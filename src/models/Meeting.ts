import mongoose, { Schema, Document } from 'mongoose';

export interface IMeeting extends Document {
  name: string;
  email: string;
  phone: string;
  company: string;
  projectType: string;
  budget: string;
  date: Date;
  time: string;
  timezone: string;
  message: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

const MeetingSchema = new Schema<IMeeting>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, default: '' },
    company: { type: String, default: '' },
    projectType: { type: String, default: 'website' },
    budget: { type: String, default: '' },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    timezone: { type: String, default: 'UTC' },
    message: { type: String, default: '' },
    status: { type: String, enum: ['pending', 'confirmed', 'completed', 'cancelled'], default: 'pending' },
  },
  { timestamps: true }
);

export default mongoose.models.Meeting || mongoose.model<IMeeting>('Meeting', MeetingSchema);
