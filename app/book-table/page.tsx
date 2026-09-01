import type { Metadata } from 'next';
import { StorefrontShell } from '@/components/StorefrontShell';

export const metadata: Metadata = {
  title: 'Book a Table | Gumti Cafe',
  description: 'Reserve your dining table at Gumti Cafe for special occasions, gatherings, or casual dining.',
};

export default function BookTablePage() {
  return <StorefrontShell initialView="book-table" />;
}
