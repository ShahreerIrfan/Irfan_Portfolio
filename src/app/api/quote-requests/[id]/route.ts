import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import QuoteRequest from '@/models/QuoteRequest';
import { isAuthenticated } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  if (!isAuthenticated(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await dbConnect();
  const data = await req.json();
  const quote = await QuoteRequest.findByIdAndUpdate(params.id, data, { new: true });
  if (!quote) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(quote);
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  if (!isAuthenticated(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await dbConnect();
  const quote = await QuoteRequest.findByIdAndDelete(params.id);
  if (!quote) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ success: true });
}
