import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import FAQ from '@/models/FAQ';
import { isAuthenticated } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  await dbConnect();
  const isAdmin = isAuthenticated(req);
  const filter: Record<string, unknown> = {};
  if (!isAdmin) filter.published = true;
  const faqs = await FAQ.find(filter).sort({ order: 1 }).lean();
  return NextResponse.json(faqs);
}

export async function POST(req: NextRequest) {
  if (!isAuthenticated(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await dbConnect();
  try {
    const data = await req.json();
    const faq = await FAQ.create(data);
    return NextResponse.json(faq, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Server error';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
