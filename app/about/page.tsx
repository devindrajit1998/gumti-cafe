import type { Metadata } from 'next';
import { StorefrontShell } from '@/components/StorefrontShell';

export const metadata: Metadata = {
  title: 'About Us | Gumti Cafe',
  description: 'Learn about Gumti Cafe, our story, artisan coffee, authentic momos, fresh pizzas and culinary passion.',
};

export default function AboutPage() {
  return <StorefrontShell initialView="about" />;
}
