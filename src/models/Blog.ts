import mongoose, { Schema, Document } from 'mongoose';

// Block types for WordPress-like editor
export interface IBlock {
  id: string;
  type: 'paragraph' | 'heading' | 'image' | 'gallery' | 'list' | 'quote' | 'code' | 'table' | 'video' | 'divider' | 'callout' | 'button' | 'html' | 'spacer';
  data: Record<string, unknown>;
}

export interface IBlog extends Document {
  title: string;
  slug: string;
  excerpt: string;
  content: string; // Generated HTML from blocks (for backward compat + SEO)
  blocks: IBlock[]; // Structured block content
  coverImage: string;
  category: string;
  tags: string[];
  author: string;
  published: boolean;
  featured: boolean;
  views: number;
  readTime: number;
  metaTitle: string;
  metaDescription: string;
  createdAt: Date;
  updatedAt: Date;
}

const BlockSchema = new Schema(
  {
    id: { type: String, required: true },
    type: {
      type: String,
      required: true,
      enum: ['paragraph', 'heading', 'image', 'gallery', 'list', 'quote', 'code', 'table', 'video', 'divider', 'callout', 'button', 'html', 'spacer'],
    },
    data: { type: Schema.Types.Mixed, default: {} },
  },
  { _id: false }
);

const BlogSchema = new Schema<IBlog>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    excerpt: { type: String, required: true },
    content: { type: String, default: '' },
    blocks: { type: [BlockSchema], default: [] },
    coverImage: { type: String, default: '' },
    category: { type: String, default: 'General' },
    tags: [{ type: String }],
    author: { type: String, default: 'MD Shahreer Irfan' },
    published: { type: Boolean, default: false },
    featured: { type: Boolean, default: false },
    views: { type: Number, default: 0 },
    readTime: { type: Number, default: 5 },
    metaTitle: { type: String, default: '' },
    metaDescription: { type: String, default: '' },
  },
  { timestamps: true }
);

BlogSchema.index({ slug: 1 });
BlogSchema.index({ published: 1, createdAt: -1 });
BlogSchema.index({ tags: 1 });

export default mongoose.models.Blog || mongoose.model<IBlog>('Blog', BlogSchema);
