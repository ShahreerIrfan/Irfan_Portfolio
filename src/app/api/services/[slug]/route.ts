import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Service from '@/models/Service';
import { isAuthenticated } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function PUT(req: NextRequest, { params }: { params: { slug: string } }) {
  if (!isAuthenticated(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await dbConnect();
  const data = await req.json();
  const service = await Service.findOneAndUpdate({ slug: params.slug }, data, { new: true });
  if (!service) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(service);
}

export async function DELETE(req: NextRequest, { params }: { params: { slug: string } }) {
  if (!isAuthenticated(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await dbConnect();
  const service = await Service.findOneAndDelete({ slug: params.slug });
  if (!service) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ success: true });
}
