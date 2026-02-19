import type { Metadata } from 'next';
import { ThemeProvider } from '@/components/ThemeProvider';
import { ToastProvider } from '@/components/Toast';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://irfan-portfolio-dun.vercel.app'),
  title: {
    default: 'MD Shahreer Irfan — Web Developer Portfolio',
    template: '%s | MD Shahreer Irfan',
  },
  description:
    'Portfolio of MD Shahreer Irfan — Full-stack web developer specializing in Django, Next.js, and WordPress. Based in Dhaka, Bangladesh.',
  keywords: [
    'MD Shahreer Irfan',
    'Web Developer',
    'Django Developer',
    'Next.js Developer',
    'Full Stack Developer',
    'Portfolio',
    'Dhaka Bangladesh',
    'React',
    'Python',
  ],
  authors: [{ name: 'MD Shahreer Irfan' }],
  creator: 'MD Shahreer Irfan',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://irfan-portfolio-dun.vercel.app',
    title: 'MD Shahreer Irfan — Web Developer Portfolio',
    description:
      'Full-stack web developer specializing in Django, Next.js, and WordPress.',
    siteName: 'Shahreer Irfan Portfolio',
    images: [
      {
        url: '/Irfan.png',
        width: 600,
        height: 600,
        alt: 'MD Shahreer Irfan',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MD Shahreer Irfan — Web Developer Portfolio',
    description:
      'Full-stack web developer specializing in Django, Next.js, and WordPress.',
    images: ['/Irfan.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.png" type="image/png" />
        <meta name="theme-color" content="#0078D4" />
      </head>
      <body className="min-h-screen bg-ms-bg dark:bg-dark-bg text-ms-text dark:text-dark-text transition-colors duration-300">
        <ThemeProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
