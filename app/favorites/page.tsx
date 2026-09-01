import type { Metadata } from 'next';
import { StorefrontShell } from '@/components/StorefrontShell';

export const metadata: Metadata = {
  title: 'Favorite Dishes | Gumti Cafe',
  description: 'Your saved favorite dishes for quick and easy ordering.',
};

export default function FavoritesPage() {
  return <StorefrontShell initialView="favorites" />;
}
