import type { Metadata } from 'next';
import { StorefrontShell } from '@/components/StorefrontShell';

export const metadata: Metadata = {
  title: 'Track Order | Gumti Cafe',
  description: 'Live preparation and delivery tracking for your Gumti Cafe order.',
};

export default function OrderTrackingPage() {
  return <StorefrontShell initialView="order-tracking" />;
}
