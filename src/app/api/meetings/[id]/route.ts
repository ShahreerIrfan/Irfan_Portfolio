import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Meeting from '@/models/Meeting';
import { isAuthenticated } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  if (!isAuthenticated(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await dbConnect();
  const data = await req.json();
  const meeting = await Meeting.findByIdAndUpdate(params.id, data, { new: true });
  if (!meeting) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(meeting);
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  if (!isAuthenticated(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await dbConnect();
  const meeting = await Meeting.findByIdAndDelete(params.id);
  if (!meeting) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ success: true });
}
