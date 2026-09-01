import type { Metadata } from 'next';
import { StorefrontShell } from '@/components/StorefrontShell';

export const metadata: Metadata = {
  title: 'Your Orders | Gumti Cafe',
  description: 'View your order history, live status, KOT receipts, and reorder favourite meals.',
};

export default function OrdersPage() {
  return <StorefrontShell initialView="orders" />;
}
