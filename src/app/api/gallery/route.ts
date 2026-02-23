import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Gallery from '@/models/Gallery';
import { isAuthenticated } from '@/lib/auth';

// GET /api/gallery — public: published sorted by order; admin: all
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const admin = isAuthenticated(req);
    const filter = admin ? {} : { published: true };
    const galleries = await Gallery.find(filter).sort({ order: 1, createdAt: -1 });
    return NextResponse.json({ galleries });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch gallery' }, { status: 500 });
  }
}

// POST /api/gallery — admin only
export async function POST(req: NextRequest) {
  if (!isAuthenticated(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    await connectDB();
    const body = await req.json();
    const item = await Gallery.create(body);
    return NextResponse.json(item, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to create gallery item' }, { status: 500 });
  }
}
