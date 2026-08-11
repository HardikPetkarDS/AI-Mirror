import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI Mirror — Virtual Fitting Room & Multi-Store Fashion Search',
  description: 'AI-powered virtual shopping assistant, live camera mirror try-on, and smart size recommendation engine across Myntra, Nykaa, AJIO, Amazon, Zara & H&M.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-slate-950 text-slate-100 antialiased min-h-screen flex flex-col">
        {children}
      </body>
    </html>
  );
}
