import type { Metadata } from 'next';
import { StorefrontShell } from '@/components/StorefrontShell';

export const metadata: Metadata = {
  title: 'Privacy Policy | Gumti Cafe',
  description: 'Privacy Policy and data practices for Gumti Cafe customers.',
};

export default function PrivacyPage() {
  return <StorefrontShell initialView="privacy" />;
}
