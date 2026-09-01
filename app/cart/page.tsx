import type { Metadata } from 'next';
import { StorefrontShell } from '@/components/StorefrontShell';

export const metadata: Metadata = {
  title: 'Your Food Cart | Gumti Cafe',
  description: 'Review your selected dishes, customize preferences, apply coupons, and proceed to direct WhatsApp checkout.',
};

export default function CartPage() {
  return <StorefrontShell initialView="cart" />;
}
