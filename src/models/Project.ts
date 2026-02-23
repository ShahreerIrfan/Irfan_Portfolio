import mongoose, { Schema, Document } from 'mongoose';

export interface IProject extends Document {
  title: string;
  slug: string;
  description: string;
  longDescription: string;
  category: string;
  stack: string[];
  image: string;
  images: string[];
  liveUrl: string;
  githubUrl: string;
  featured: boolean;
  published: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema<IProject>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    longDescription: { type: String, default: '' },
    category: { type: String, default: 'Full Stack' },
    stack: [{ type: String }],
    image: { type: String, default: '' },
    images: [{ type: String }],
    liveUrl: { type: String, default: '' },
    githubUrl: { type: String, default: '' },
    featured: { type: Boolean, default: false },
    published: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

ProjectSchema.index({ published: 1, order: 1 });

export default mongoose.models.Project || mongoose.model<IProject>('Project', ProjectSchema);
