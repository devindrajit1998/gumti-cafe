import { NextRequest, NextResponse } from 'next/server';
import { getImageKitInstance } from '@/lib/imagekit';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const fileName = (formData.get('fileName') as string) || file?.name || `upload_${Date.now()}`;
    const folder = (formData.get('folder') as string) || '/gumti-cafe';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const imagekit = getImageKitInstance();
    if (!imagekit) {
      return NextResponse.json(
        {
          error:
            'ImageKit credentials not configured. Please set NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY, IMAGEKIT_PRIVATE_KEY, and NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT in environment variables.',
        },
        { status: 500 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const result = await imagekit.upload({
      file: buffer,
      fileName,
      folder,
      useUniqueFileName: true,
    });

    return NextResponse.json({
      success: true,
      fileId: result.fileId,
      url: result.url,
      thumbnailUrl: result.thumbnailUrl,
      name: result.name,
    });
  } catch (error: unknown) {
    const err = error as Error;
    console.error('ImageKit upload error:', err);
    return NextResponse.json(
      { error: err.message || 'ImageKit upload failed' },
      { status: 500 }
    );
  }
}
