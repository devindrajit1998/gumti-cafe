import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Playfair_Display } from 'next/font/google';
import './globals.css';

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Gumti Cafe | Coffee, Chai, Momos, Pizza & Comfort Bites',
  description: 'Welcome to Gumti Cafe. Fresh artisan coffee, chai, momos, burgers, pizzas, and comfort food with direct WhatsApp ordering.',
  icons: {
    icon: '/logo-gumti.png',
    shortcut: '/logo-gumti.png',
    apple: '/logo-gumti.png',
  },
  openGraph: {
    title: 'Gumti Cafe | Coffee, Chai, Momos & Comfort Bites',
    description: 'Good food. Good adda. Fresh coffee, chai, quick bites and comfort meals directly from Gumti Cafe.',
    type: 'website',
    images: ['/logo-gumti.png'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${plusJakarta.variable} ${playfair.variable}`}>
      <body suppressHydrationWarning className="font-sans antialiased bg-[#FAF9F5] text-[#1E1C1A]">
        {children}
      </body>
    </html>
  );
}


