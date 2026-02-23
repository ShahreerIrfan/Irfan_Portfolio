'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Calendar, Clock, Eye, Tag, Share2, Copy, Check, Facebook, Twitter, Linkedin, Heart } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BlockRenderer from '@/components/BlockRenderer';

interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  coverImage: string;
  tags: string[];
  author: string;
  views: number;
  readTime: number;
  blocks?: Array<{ id: string; type: string; data: Record<string, unknown> }>;
  createdAt: string;
  updatedAt: string;
}

export default function BlogPostClient({ blog }: { blog: BlogPost }) {
  const [copied, setCopied] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [liked, setLiked] = useState(false);

  const postUrl = typeof window !== 'undefined' ? window.location.href : '';

  useEffect(() => {
    // Track view
    fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ page: `/blog/${blog.slug}`, type: 'blog_view' }),
    }).catch(() => {});
  }, [blog.slug]);

  const copyLink = () => {
    navigator.clipboard.writeText(postUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(postUrl)}&text=${encodeURIComponent(blog.title)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(postUrl)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(blog.title + ' ' + postUrl)}`,
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  const hasBlocks = blog.blocks && blog.blocks.length > 0;

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-white pt-24 pb-16">
        {/* Hero Section */}
        <article className="max-w-4xl mx-auto px-4 sm:px-6">
          {/* Back Link */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Blog
          </Link>

          {/* Tags */}
          {blog.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {blog.tags.map((tag: string) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20"
                >
                  <Tag className="w-3 h-3" />
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Title */}
          <h1 className="text-3xl md:text-5xl font-extrabold leading-tight mb-6 bg-gradient-to-r from-white to-gray-400 dark:from-white dark:to-gray-500 bg-clip-text text-transparent">
            {blog.title}
          </h1>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-8 pb-8 border-b border-gray-200 dark:border-gray-800">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              {formatDate(blog.createdAt)}
            </span>
            {blog.readTime > 0 && (
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                {blog.readTime} min read
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <Eye className="w-4 h-4" />
              {blog.views?.toLocaleString() || 0} views
            </span>
            <span className="text-gray-600 dark:text-gray-300 font-medium">
              By {blog.author || 'Irfan'}
            </span>

            {/* Share & Like */}
            <div className="ml-auto flex items-center gap-2 relative">
              <button
                onClick={() => setLiked(!liked)}
                className={`p-2 rounded-full transition-all ${liked ? 'bg-red-500/20 text-red-400' : 'bg-gray-100 dark:bg-gray-800 text-gray-500 hover:text-red-400'}`}
                aria-label="Like"
              >
                <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
              </button>
              <button
                onClick={() => setShareOpen(!shareOpen)}
                className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 hover:text-blue-400 transition-colors"
                aria-label="Share"
              >
                <Share2 className="w-4 h-4" />
              </button>

              {shareOpen && (
                <div className="absolute right-0 top-12 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl p-3 flex gap-2 z-50 animate-in fade-in slide-in-from-top-2">
                  <a href={shareLinks.facebook} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg hover:bg-blue-500/10 text-blue-600 transition-colors" title="Facebook">
                    <Facebook className="w-5 h-5" />
                  </a>
                  <a href={shareLinks.twitter} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg hover:bg-sky-500/10 text-sky-500 transition-colors" title="Twitter">
                    <Twitter className="w-5 h-5" />
                  </a>
                  <a href={shareLinks.linkedin} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg hover:bg-blue-700/10 text-blue-700 transition-colors" title="LinkedIn">
                    <Linkedin className="w-5 h-5" />
                  </a>
                  <a href={shareLinks.whatsapp} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg hover:bg-green-500/10 text-green-500 transition-colors" title="WhatsApp">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  </a>
                  <button onClick={copyLink} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 transition-colors" title="Copy link">
                    {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Cover Image */}
          {blog.coverImage && (
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden mb-10 shadow-2xl">
              <Image
                src={blog.coverImage}
                alt={blog.title}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 896px"
              />
            </div>
          )}

          {/* Blog Content */}
          <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl prose-pre:bg-gray-900 prose-pre:border prose-pre:border-gray-700">
            {hasBlocks ? (
              <BlockRenderer blocks={blog.blocks!} />
            ) : (
              <div dangerouslySetInnerHTML={{ __html: blog.content }} />
            )}
          </div>

          {/* Author & Share Footer */}
          <div className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-800">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                  {(blog.author || 'I')[0].toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">{blog.author || 'Irfan'}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Published {formatDate(blog.createdAt)}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <a
                  href={shareLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-lg bg-sky-500/10 text-sky-400 text-sm font-medium hover:bg-sky-500/20 transition-colors"
                >
                  Share on Twitter
                </a>
                <a
                  href={shareLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-lg bg-blue-600/10 text-blue-400 text-sm font-medium hover:bg-blue-600/20 transition-colors"
                >
                  Share on LinkedIn
                </a>
              </div>
            </div>
          </div>

          {/* Back to Blog CTA */}
          <div className="mt-12 text-center">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium hover:from-blue-500 hover:to-purple-500 transition-all shadow-lg shadow-blue-500/25"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to All Posts
            </Link>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
