import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Meeting from '@/models/Meeting';
import { isAuthenticated } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  if (!isAuthenticated(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await dbConnect();
  const meetings = await Meeting.find().sort({ date: -1 }).lean();
  return NextResponse.json(meetings);
}

export async function POST(req: NextRequest) {
  await dbConnect();
  try {
    const data = await req.json();
    const meeting = await Meeting.create(data);
    return NextResponse.json({ message: 'Meeting request submitted successfully!', meeting }, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Server error';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
