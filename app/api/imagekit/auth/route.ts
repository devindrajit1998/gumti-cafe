import { NextResponse } from 'next/server';
import { getImageKitInstance } from '@/lib/imagekit';

export async function GET() {
  try {
    const imagekit = getImageKitInstance();
    if (!imagekit) {
      return NextResponse.json(
        {
          error:
            'ImageKit credentials not configured. Please set NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY, IMAGEKIT_PRIVATE_KEY, and NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT.',
        },
        { status: 500 }
      );
    }

    const authParams = imagekit.getAuthenticationParameters();
    return NextResponse.json(authParams);
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
