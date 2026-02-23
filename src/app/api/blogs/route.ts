import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Blog from '@/models/Blog';
import { isAuthenticated } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// GET /api/blogs - Get all published blogs (public) or all blogs (admin)
export async function GET(req: NextRequest) {
  await dbConnect();
  const isAdmin = isAuthenticated(req);
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '12');
  const category = searchParams.get('category');
  const tag = searchParams.get('tag');
  const search = searchParams.get('search');

  const filter: Record<string, unknown> = {};
  if (!isAdmin) filter.published = true;
  if (category) filter.category = category;
  if (tag) filter.tags = tag;
  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { excerpt: { $regex: search, $options: 'i' } },
      { tags: { $regex: search, $options: 'i' } },
    ];
  }

  const total = await Blog.countDocuments(filter);
  const blogs = await Blog.find(filter)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .select('-content -blocks')
    .lean();

  return NextResponse.json({ blogs, total, page, totalPages: Math.ceil(total / limit) });
}

// Helper to extract plain text from blocks for read time
function getBlocksPlainText(blocks: Array<{ type: string; data: Record<string, unknown> }>): string {
  return blocks.map(block => {
    const d = block.data;
    switch (block.type) {
      case 'paragraph': case 'heading': return (d.text as string) || '';
      case 'quote': return (d.text as string) || '';
      case 'list': return ((d.items as string[]) || []).join(' ');
      case 'callout': return `${d.title || ''} ${d.text || ''}`;
      case 'code': return (d.code as string) || '';
      default: return '';
    }
  }).join(' ');
}

// POST /api/blogs - Create a new blog (admin only)
export async function POST(req: NextRequest) {
  if (!isAuthenticated(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  await dbConnect();
  try {
    const data = await req.json();
    // Auto-generate slug from title
    if (!data.slug) {
      data.slug = data.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }
    // Calculate read time from blocks or content
    if (data.blocks && data.blocks.length > 0) {
      const text = getBlocksPlainText(data.blocks);
      const wordCount = text.split(/\s+/).filter(Boolean).length;
      data.readTime = Math.max(1, Math.ceil(wordCount / 200));
    } else if (data.content) {
      const wordCount = data.content.replace(/<[^>]*>/g, '').split(/\s+/).length;
      data.readTime = Math.max(1, Math.ceil(wordCount / 200));
    }
    const blog = await Blog.create(data);
    return NextResponse.json(blog, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Server error';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
