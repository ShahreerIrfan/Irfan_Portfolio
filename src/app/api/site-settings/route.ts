import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import SiteSettings from '@/models/SiteSettings';
import { isAuthenticated } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  await dbConnect();
  const settings = await SiteSettings.find().lean();
  const mapped: Record<string, unknown> = {};
  settings.forEach((s: Record<string, unknown>) => { mapped[s.key as string] = s.value; });
  return NextResponse.json(mapped);
}

export async function PUT(req: NextRequest) {
  if (!isAuthenticated(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await dbConnect();
  try {
    const data = await req.json();
    const updates = Object.entries(data).map(([key, value]) =>
      SiteSettings.findOneAndUpdate({ key }, { key, value }, { upsert: true, new: true })
    );
    await Promise.all(updates);
    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Server error';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
