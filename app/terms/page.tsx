import type { Metadata } from 'next';
import { StorefrontShell } from '@/components/StorefrontShell';

export const metadata: Metadata = {
  title: 'Terms & Conditions | Gumti Cafe',
  description: 'Terms and Conditions for ordering food, dine-in, and deliveries from Gumti Cafe.',
};

export default function TermsPage() {
  return <StorefrontShell initialView="terms" />;
}
