import type { Metadata } from 'next';
import { StorefrontShell } from '@/components/StorefrontShell';

export const metadata: Metadata = {
  title: 'Dish Details | Gumti Cafe',
  description: 'View dish ingredients, portion size, chef preparation notes, and customize options.',
};

export default function ItemDetailPage() {
  return <StorefrontShell initialView="item-detail" />;
}
