import type { Metadata } from 'next';
import { StorefrontShell } from '@/components/StorefrontShell';

export const metadata: Metadata = {
  title: 'Category Dishes | Gumti Cafe',
  description: 'Explore all dishes in this food and beverage category at Gumti Cafe.',
};

export default function CategoryDetailPage() {
  return <StorefrontShell initialView="category-detail" />;
}
