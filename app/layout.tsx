import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'LUMIÈRE — Minimalist Luxury Boutique',
  description: 'Curated architectural silhouettes, noble natural fabrics, and timeless minimalist elegance crafted for the discerning modern wardrobe.',
  openGraph: {
    title: 'LUMIÈRE — Minimalist Luxury Boutique',
    description: 'Curated architectural silhouettes, noble natural fabrics, and timeless minimalist elegance crafted for the discerning modern wardrobe.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LUMIÈRE — Minimalist Luxury Boutique',
    description: 'Curated architectural silhouettes, noble natural fabrics, and timeless minimalist elegance crafted for the discerning modern wardrobe.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-screen bg-[#FAF9F6] text-[#18181B] selection:bg-[#EAE4D9] selection:text-[#18181B]" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
