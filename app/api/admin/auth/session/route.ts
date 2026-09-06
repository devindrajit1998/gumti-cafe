import { NextRequest, NextResponse } from 'next/server';
import { ADMIN_COOKIE_NAME, verifyAdminSessionToken } from '@/lib/adminAuth';

export async function GET(request: NextRequest) {
  try {
    const sessionCookie = request.cookies.get(ADMIN_COOKIE_NAME)?.value;

    if (!sessionCookie) {
      return NextResponse.json({ authenticated: false }, { status: 200 });
    }

    const payload = await verifyAdminSessionToken(sessionCookie);

    if (!payload) {
      // Cookie is invalid or expired
      const response = NextResponse.json({ authenticated: false }, { status: 200 });
      response.cookies.set({
        name: ADMIN_COOKIE_NAME,
        value: '',
        httpOnly: true,
        path: '/',
        maxAge: 0,
      });
      return response;
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        username: payload.username,
        role: payload.role,
      },
    });
  } catch (error) {
    console.error('Error in /api/admin/auth/session:', error);
    return NextResponse.json({ authenticated: false }, { status: 200 });
  }
}
