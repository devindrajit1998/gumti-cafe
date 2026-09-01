import type { Metadata } from 'next';
import { StorefrontShell } from '@/components/StorefrontShell';

export const metadata: Metadata = {
  title: 'Customer Profile | Gumti Cafe',
  description: 'Manage your delivery address, saved preferences, and account info.',
};

export default function ProfilePage() {
  return <StorefrontShell initialView="profile" />;
}
