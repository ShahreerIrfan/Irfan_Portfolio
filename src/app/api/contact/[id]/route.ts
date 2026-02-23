import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import ContactModel from '@/models/Contact';
import { isAuthenticated } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  if (!isAuthenticated(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await dbConnect();
  const data = await req.json();
  const contact = await ContactModel.findByIdAndUpdate(params.id, data, { new: true });
  if (!contact) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(contact);
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  if (!isAuthenticated(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await dbConnect();
  const contact = await ContactModel.findByIdAndDelete(params.id);
  if (!contact) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ success: true });
}
