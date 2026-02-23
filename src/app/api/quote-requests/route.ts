import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import QuoteRequest from '@/models/QuoteRequest';
import { isAuthenticated } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  if (!isAuthenticated(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await dbConnect();
  const quotes = await QuoteRequest.find().sort({ createdAt: -1 }).lean();
  return NextResponse.json(quotes);
}

export async function POST(req: NextRequest) {
  await dbConnect();
  try {
    const data = await req.json();
    const quote = await QuoteRequest.create(data);
    return NextResponse.json({ message: 'Quote request submitted! I\'ll get back to you soon.', quote }, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Server error';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
