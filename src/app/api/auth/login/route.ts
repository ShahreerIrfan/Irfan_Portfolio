import { NextRequest, NextResponse } from 'next/server';
import { authenticateAdmin, generateToken, hashPassword } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();
    const token = await authenticateAdmin(username, password);
    if (!token) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }
    const response = NextResponse.json({ success: true, token });
    response.cookies.set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60,
      path: '/',
    });
    return response;
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
