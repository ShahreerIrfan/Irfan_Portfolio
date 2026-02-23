import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Blog from '@/models/Blog';
import { isAuthenticated } from '@/lib/auth';

// GET /api/blogs/[slug]
export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
  await dbConnect();
  const blog = await Blog.findOne({ slug: params.slug });
  if (!blog) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  // Increment views for public access
  if (!isAuthenticated(req)) {
    await Blog.findByIdAndUpdate(blog._id, { $inc: { views: 1 } });
  }
  return NextResponse.json(blog);
}

// PUT /api/blogs/[slug]
export async function PUT(req: NextRequest, { params }: { params: { slug: string } }) {
  if (!isAuthenticated(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  await dbConnect();
  const data = await req.json();
  if (data.content) {
    const wordCount = data.content.replace(/<[^>]*>/g, '').split(/\s+/).length;
    data.readTime = Math.max(1, Math.ceil(wordCount / 200));
  }
  const blog = await Blog.findOneAndUpdate({ slug: params.slug }, data, { new: true });
  if (!blog) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(blog);
}

// DELETE /api/blogs/[slug]
export async function DELETE(req: NextRequest, { params }: { params: { slug: string } }) {
  if (!isAuthenticated(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  await dbConnect();
  const blog = await Blog.findOneAndDelete({ slug: params.slug });
  if (!blog) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ success: true });
}
