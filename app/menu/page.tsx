import type { Metadata } from 'next';
import { StorefrontShell } from '@/components/StorefrontShell';

export const metadata: Metadata = {
  title: 'Full Menu & Dishes | Gumti Cafe',
  description: 'Explore our full artisan cafe menu with coffee, chai, momos, pizzas, sandwiches, and combo platters.',
};

export default function MenuPage() {
  return <StorefrontShell initialView="home" />;
}
