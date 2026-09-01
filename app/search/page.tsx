import type { Metadata } from 'next';
import { StorefrontShell } from '@/components/StorefrontShell';

export const metadata: Metadata = {
  title: 'Search Dishes & Categories | Gumti Cafe',
  description: 'Search our wide range of tea, coffee, snacks, momos, pizzas and meals.',
};

export default function SearchPage() {
  return <StorefrontShell initialView="search" />;
}
