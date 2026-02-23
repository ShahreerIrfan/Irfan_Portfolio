'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Calendar, Clock, Eye, Tag, ArrowLeft, Share2, BookOpen } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface Blog {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  category: string;
  tags: string[];
  author: string;
  views: number;
  readTime: number;
  createdAt: string;
}

export default function BlogPostPage() {
  const params = useParams();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await fetch(`/api/blogs/${params.slug}`);
        if (res.ok) {
          const data = await res.json();
          setBlog(data);
        }
      } catch (err) {
        console.error('Failed to fetch blog:', err);
      }
      setLoading(false);
    };
    if (params.slug) fetchBlog();
    // Track visit
    fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ page: '/blog', slug: params.slug, sessionId: localStorage.getItem('session_id') || '' }),
    });
  }, [params.slug]);

  const sharePost = () => {
    if (navigator.share) {
      navigator.share({ title: blog?.title, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar onCommandPalette={() => {}} />
        <main className="min-h-screen pt-20">
          <div className="section-container max-w-4xl">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2" />
              <div className="h-64 bg-slate-200 dark:bg-slate-700 rounded-2xl" />
              <div className="space-y-2">
                {[1, 2, 3, 4, 5].map(i => <div key={i} className="h-4 bg-slate-200 dark:bg-slate-700 rounded" />)}
              </div>
            </div>
          </div>
        </main>
      </>
    );
  }

  if (!blog) {
    return (
      <>
        <Navbar onCommandPalette={() => {}} />
        <main className="min-h-screen pt-20 flex items-center justify-center">
          <div className="text-center">
            <BookOpen className="w-16 h-16 mx-auto text-slate-300 dark:text-slate-600 mb-4" />
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Post Not Found</h1>
            <Link href="/blog" className="text-[var(--active-accent)] hover:underline">Back to Blog</Link>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar onCommandPalette={() => {}} />
      <main className="min-h-screen pt-20">
        <article className="section-container max-w-4xl">
          {/* Back + Share */}
          <div className="flex items-center justify-between mb-6">
            <Link href="/blog" className="flex items-center gap-2 text-sm text-slate-500 hover:text-[var(--active-accent)] transition-colors">
              <ArrowLeft className="w-4 h-4" />
              All Articles
            </Link>
            <button onClick={sharePost} className="flex items-center gap-2 text-sm text-slate-500 hover:text-[var(--active-accent)] transition-colors">
              <Share2 className="w-4 h-4" />
              Share
            </button>
          </div>

          {/* Category */}
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--active-accent)]/10 text-[var(--active-accent)] text-sm font-medium mb-4">
            {blog.category}
          </span>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white leading-tight mb-4">
            {blog.title}
          </h1>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 dark:text-slate-400 mb-8">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              {new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              {blog.readTime} min read
            </span>
            <span className="flex items-center gap-1.5">
              <Eye className="w-4 h-4" />
              {blog.views} views
            </span>
          </div>

          {/* Cover Image */}
          {blog.coverImage && (
            <div className="rounded-2xl overflow-hidden mb-10 shadow-xl">
              <img src={blog.coverImage} alt={blog.title} className="w-full h-auto" />
            </div>
          )}

          {/* Content */}
          <div
            className="prose prose-lg dark:prose-invert max-w-none
              prose-headings:font-bold prose-headings:text-slate-900 dark:prose-headings:text-white
              prose-p:text-slate-600 dark:prose-p:text-slate-300 prose-p:leading-relaxed
              prose-a:text-[var(--active-accent)] prose-a:no-underline hover:prose-a:underline
              prose-img:rounded-xl prose-img:shadow-lg
              prose-blockquote:border-l-[var(--active-accent)] prose-blockquote:bg-[var(--active-accent)]/5 prose-blockquote:rounded-r-xl prose-blockquote:py-1
              prose-code:bg-slate-100 dark:prose-code:bg-slate-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-lg prose-code:text-sm
              prose-pre:bg-slate-900 prose-pre:rounded-xl prose-pre:shadow-lg"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />

          {/* Tags */}
          {blog.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-10 pt-6 border-t border-slate-200 dark:border-slate-700">
              <Tag className="w-4 h-4 text-slate-400 mt-0.5" />
              {blog.tags.map(tag => (
                <Link key={tag} href={`/blog?tag=${tag}`}
                  className="px-3 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-[var(--active-accent)]/10 hover:text-[var(--active-accent)] transition-colors">
                  {tag}
                </Link>
              ))}
            </div>
          )}
        </article>
      </main>
      <Footer />
    </>
  );
}
