import { NextRequest, NextResponse } from 'next/server';
import {
  checkRateLimit,
  recordFailedAttempt,
  resetRateLimit,
  verifyAdminCredentials,
  createAdminSessionToken,
  getAdminCookieOptions,
} from '@/lib/adminAuth';

function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  return req.headers.get('x-real-ip') || '127.0.0.1';
}

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);

    // 1. Rate Limiting Check
    const rateCheck = checkRateLimit(ip);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: `Too many failed attempts. Account locked for security. Please try again in ${rateCheck.retryAfterSeconds || 60} seconds.`,
          retryAfter: rateCheck.retryAfterSeconds,
        },
        { status: 429 }
      );
    }

    // 2. Parse request payload
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, error: 'Invalid JSON request payload.' },
        { status: 400 }
      );
    }

    const { username, password, rememberMe } = body || {};

    if (!username || typeof username !== 'string' || !password || typeof password !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Username and password are required.' },
        { status: 400 }
      );
    }

    // 3. Verify Credentials using timing-safe comparison
    const isValid = verifyAdminCredentials(username, password);

    if (!isValid) {
      const attemptResult = recordFailedAttempt(ip);
      if (attemptResult.locked) {
        return NextResponse.json(
          {
            success: false,
            error: `Maximum login attempts exceeded. Access locked for ${attemptResult.retryAfterSeconds || 900} seconds.`,
            retryAfter: attemptResult.retryAfterSeconds,
          },
          { status: 429 }
        );
      }

      return NextResponse.json(
        {
          success: false,
          error: `Invalid username or password. ${attemptResult.attemptsLeft} attempt(s) remaining before temporary lockout.`,
          attemptsLeft: attemptResult.attemptsLeft,
        },
        { status: 401 }
      );
    }

    // 4. Successful login: reset rate limiter
    resetRateLimit(ip);

    // 5. Generate signed JWT session token
    const token = await createAdminSessionToken({
      username: username.trim(),
      role: 'admin',
      rememberMe: Boolean(rememberMe),
    });

    // 6. Set secure httpOnly cookie on response
    const cookieOptions = getAdminCookieOptions(Boolean(rememberMe));
    const response = NextResponse.json({
      success: true,
      message: 'Authentication successful.',
      user: {
        username: username.trim(),
        role: 'admin',
      },
    });

    response.cookies.set({
      name: cookieOptions.name,
      value: token,
      httpOnly: cookieOptions.httpOnly,
      secure: cookieOptions.secure,
      sameSite: cookieOptions.sameSite,
      path: cookieOptions.path,
      maxAge: cookieOptions.maxAge,
    });

    return response;
  } catch (error) {
    console.error('Error in /api/admin/auth/login:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error during authentication.' },
      { status: 500 }
    );
  }
}
