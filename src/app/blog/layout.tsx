import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog | MD Shahreer Irfan',
  description: 'Read the latest articles by MD Shahreer Irfan on web development, Django, Next.js, WordPress, and more.',
  keywords: ['Shahreer Irfan blog', 'web development articles', 'Django tutorials', 'Next.js tips', 'msisoftwares'],
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
