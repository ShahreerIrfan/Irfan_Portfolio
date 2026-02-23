import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Testimonial from '@/models/Testimonial';
import { isAuthenticated } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  await dbConnect();
  const isAdmin = isAuthenticated(req);
  const filter = isAdmin ? {} : { published: true };
  const testimonials = await Testimonial.find(filter).sort({ order: 1, createdAt: -1 }).lean();
  return NextResponse.json(testimonials);
}

export async function POST(req: NextRequest) {
  if (!isAuthenticated(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await dbConnect();
  try {
    const data = await req.json();
    const testimonial = await Testimonial.create(data);
    return NextResponse.json(testimonial, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Server error';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
