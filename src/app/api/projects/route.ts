import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Project from '@/models/Project';
import { isAuthenticated } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  await dbConnect();
  const isAdmin = isAuthenticated(req);
  const filter: Record<string, unknown> = {};
  if (!isAdmin) filter.published = true;
  const projects = await Project.find(filter).sort({ order: 1, createdAt: -1 }).lean();
  return NextResponse.json(projects);
}

export async function POST(req: NextRequest) {
  if (!isAuthenticated(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  await dbConnect();
  try {
    const data = await req.json();
    if (!data.slug) {
      data.slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }
    const project = await Project.create(data);
    return NextResponse.json(project, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Server error';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
