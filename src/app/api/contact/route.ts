import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import ContactModel from '@/models/Contact';
import { isAuthenticated } from '@/lib/auth';

// POST /api/contact - Submit contact form (public)
export async function POST(req: NextRequest) {
  await dbConnect();
  try {
    const data = await req.json();
    const { name, email, subject, message } = data;
    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Name, email, and message are required' }, { status: 400 });
    }
    const contact = await ContactModel.create({ name, email, subject, message });
    return NextResponse.json({ success: true, id: contact._id }, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Server error';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

// GET /api/contact - Get all submissions (admin only)
export async function GET(req: NextRequest) {
  if (!isAuthenticated(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await dbConnect();
  const contacts = await ContactModel.find().sort({ createdAt: -1 }).lean();
  return NextResponse.json(contacts);
}
