import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Newsletter from '@/models/Newsletter';
import { isAuthenticated } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  if (!isAuthenticated(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await dbConnect();
  const subscribers = await Newsletter.find().sort({ createdAt: -1 }).lean();
  return NextResponse.json({ subscribers, total: subscribers.length });
}

export async function POST(req: NextRequest) {
  await dbConnect();
  try {
    const data = await req.json();
    if (!data.email) return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    const existing = await Newsletter.findOne({ email: data.email });
    if (existing) {
      if (!existing.active) {
        existing.active = true;
        await existing.save();
        return NextResponse.json({ message: 'Welcome back! You have been re-subscribed.' });
      }
      return NextResponse.json({ message: 'You are already subscribed!' });
    }
    await Newsletter.create(data);
    return NextResponse.json({ message: 'Successfully subscribed!' }, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Server error';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
