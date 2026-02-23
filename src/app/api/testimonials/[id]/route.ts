import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Testimonial from '@/models/Testimonial';
import { isAuthenticated } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  if (!isAuthenticated(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await dbConnect();
  const data = await req.json();
  const testimonial = await Testimonial.findByIdAndUpdate(params.id, data, { new: true });
  if (!testimonial) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(testimonial);
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  if (!isAuthenticated(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await dbConnect();
  const testimonial = await Testimonial.findByIdAndDelete(params.id);
  if (!testimonial) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ success: true });
}
