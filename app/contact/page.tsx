import type { Metadata } from 'next';
import { StorefrontShell } from '@/components/StorefrontShell';

export const metadata: Metadata = {
  title: 'Contact Us | Gumti Cafe',
  description: 'Reach out to Gumti Cafe for questions, catering inquiries, table bookings, or direct WhatsApp support.',
};

export default function ContactPage() {
  return <StorefrontShell initialView="contact" />;
}
