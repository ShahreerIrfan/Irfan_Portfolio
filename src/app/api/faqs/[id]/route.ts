import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import FAQ from '@/models/FAQ';
import { isAuthenticated } from '@/lib/auth';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  if (!isAuthenticated(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await dbConnect();
  const data = await req.json();
  const faq = await FAQ.findByIdAndUpdate(params.id, data, { new: true });
  if (!faq) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(faq);
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  if (!isAuthenticated(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await dbConnect();
  const faq = await FAQ.findByIdAndDelete(params.id);
  if (!faq) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ success: true });
}
