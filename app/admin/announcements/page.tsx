'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Legacy announcements page — now redirects to the unified Banner Manager
 * which handles announcements, hero banners, and promo carousel slides.
 */
export default function AdminAnnouncementsPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/admin/banners');
  }, [router]);

  return (
    <div className="p-6 lg:p-8">
      <p className="text-sm text-zinc-500">
        Announcements have moved to the Banner Manager. Redirecting…
      </p>
    </div>
  );
}
