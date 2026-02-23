import type { Metadata } from 'next';
import { ThemeProvider } from '@/components/ThemeProvider';
import { ToastProvider } from '@/components/Toast';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://irfan-portfolio-dun.vercel.app'),
  title: {
    default: 'Shahreer Irfan — Full Stack Web Developer & WordPress Expert | msisoftwares',
    template: '%s | Shahreer Irfan',
  },
  description:
    'Shahreer Irfan (Md Shahreer Irfan / Muhammad Shahreer Irfan) — Full-stack web developer, WordPress expert & founder of msisoftwares & astralorbitals. Specializing in React, Next.js, Node.js, Django & WordPress development. Based in Dhaka, Bangladesh.',
  keywords: [
    'Shahreer Irfan',
    'Md Shahreer Irfan',
    'Muhammad Shahreer Irfan',
    'Mohammad Shahreer Irfan',
    'Irfan',
    'shahreer irfan',
    'msisoftwares',
    'msisoftware',
    'astralorbitals',
    'Web Developer',
    'Full Stack Developer',
    'WordPress Expert',
    'React Developer',
    'Next.js Developer',
    'Django Developer',
    'Node.js Developer',
    'Portfolio',
    'Dhaka Bangladesh',
    'Freelance Web Developer',
    'Website Development',
    'Web Application Development',
  ],
  authors: [{ name: 'Md Shahreer Irfan', url: 'https://irfan-portfolio-dun.vercel.app' }],
  creator: 'Md Shahreer Irfan',
  publisher: 'msisoftwares',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://irfan-portfolio-dun.vercel.app',
    title: 'Shahreer Irfan — Full Stack Web Developer & WordPress Expert',
    description:
      'Full-stack web developer specializing in React, Next.js, Node.js, Django & WordPress. Founder of msisoftwares & astralorbitals.',
    siteName: 'Shahreer Irfan Portfolio',
    images: [
      {
        url: '/shahreer_irfan.jpg',
        width: 1200,
        height: 630,
        alt: 'Shahreer Irfan — Full Stack Web Developer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Shahreer Irfan — Full Stack Web Developer & WordPress Expert',
    description:
      'Full-stack web developer specializing in React, Next.js, Node.js, Django & WordPress. Founder of msisoftwares & astralorbitals.',
    images: ['/shahreer_irfan.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://irfan-portfolio-dun.vercel.app',
  },
  verification: {
    google: '',
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
        <meta name="theme-color" content="#2563EB" />
        <link rel="canonical" href="https://irfan-portfolio-dun.vercel.app" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Person',
              name: 'Md Shahreer Irfan',
              alternateName: ['Shahreer Irfan', 'Muhammad Shahreer Irfan', 'Mohammad Shahreer Irfan', 'Irfan'],
              url: 'https://irfan-portfolio-dun.vercel.app',
              image: 'https://irfan-portfolio-dun.vercel.app/shahreer_irfan.jpg',
              jobTitle: 'Full Stack Web Developer',
              description: 'Full-stack web developer & WordPress expert. Founder of msisoftwares & astralorbitals.',
              address: { '@type': 'PostalAddress', addressLocality: 'Dhaka', addressCountry: 'BD' },
              sameAs: [
                'https://github.com/msi-shahreer-irfan',
                'https://linkedin.com/in/md-shahreer-irfan',
              ],
              worksFor: [
                { '@type': 'Organization', name: 'msisoftwares' },
                { '@type': 'Organization', name: 'astralorbitals' },
              ],
              knowsAbout: ['React', 'Next.js', 'Node.js', 'Django', 'WordPress', 'Full Stack Development', 'Web Development'],
            }),
          }}
        />
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
