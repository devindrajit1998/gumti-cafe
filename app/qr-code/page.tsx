import type { Metadata } from 'next';
import { StorefrontShell } from '@/components/StorefrontShell';

export const metadata: Metadata = {
  title: 'Table QR Standee | Gumti Cafe',
  description: 'Scan table QR codes to view menu and order directly to kitchen WhatsApp.',
};

export default function QRCodePage() {
  return <StorefrontShell initialView="qr-code" />;
}
