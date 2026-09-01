import type { Metadata } from 'next';
import { StorefrontShell } from '@/components/StorefrontShell';

export const metadata: Metadata = {
  title: 'Special Offers & Coupons | Gumti Cafe',
  description: 'Discover discount promo codes, combo meal deals, and exclusive offers at Gumti Cafe.',
};

export default function OffersPage() {
  return <StorefrontShell initialView="offers" />;
}
