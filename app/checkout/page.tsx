import type { Metadata } from 'next';
import { StorefrontShell } from '@/components/StorefrontShell';

export const metadata: Metadata = {
  title: 'Order Checkout | Gumti Cafe',
  description: 'Enter your delivery address or dine-in details and place your order directly via WhatsApp.',
};

export default function CheckoutPage() {
  return <StorefrontShell initialView="checkout" />;
}
