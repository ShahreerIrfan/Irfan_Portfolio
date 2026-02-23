'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calendar, Clock, Eye, Search, ArrowRight, BookOpen, Sparkles, TrendingUp } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface Blog {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string;
  category: string;
  tags: string[];
  author: string;
  views: number;
  readTime: number;
  createdAt: string;
  featured: boolean;
}

export default function BlogPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch('/api/blogs?limit=50');
        const data = await res.json();
        setBlogs(data.blogs || []);
      } catch (err) {
        console.error('Failed to fetch blogs:', err);
      }
      setLoading(false);
    };
    fetchBlogs();
    fetch('/api/analytics', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ page: '/blog', sessionId: localStorage.getItem('session_id') || '' }) });
  }, []);

  const categories = ['All', ...Array.from(new Set(blogs.map(b => b.category).filter(Boolean)))];
  const filtered = blogs.filter(b => {
    const matchCat = activeCategory === 'All' || b.category === activeCategory;
    const matchSearch = !search || b.title.toLowerCase().includes(search.toLowerCase()) || b.excerpt.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const featured = blogs.filter(b => b.featured);

  return (
    <>
      <Navbar onCommandPalette={() => {}} />
      <main className="min-h-screen pt-20">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50/40 to-teal-50/30 dark:from-[#0A0F1E] dark:via-[#0F1A35] dark:to-[#0A1628]" />
            <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full opacity-[0.06] dark:opacity-[0.10]"
              style={{ background: 'linear-gradient(135deg, var(--active-accent), #7C3AED)' }} />
          </div>
          <div className="section-container text-center pb-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--active-accent)]/10 text-[var(--active-accent)] text-sm font-medium mb-4">
              <BookOpen className="w-4 h-4" /> Blog
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4">
              <span className="text-slate-900 dark:text-white">Latest </span>
              <span className="bg-gradient-to-r from-[var(--active-accent)] to-purple-500 bg-clip-text text-transparent">Articles</span>
            </h1>
            <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto mb-8">
              Thoughts, tutorials, and insights on web development, design, and technology.
            </p>

            {/* Search with floating card style */}
            <div className="relative max-w-xl mx-auto">
              <div className="glass-card p-2 flex items-center gap-2 shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50">
                <Search className="w-5 h-5 text-slate-400 ml-3" />
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search articles..."
                  className="flex-1 bg-transparent py-2.5 px-2 text-sm text-slate-900 dark:text-white placeholder-slate-400 outline-none"
                />
                {search && (
                  <button onClick={() => setSearch('')} className="text-xs text-slate-400 hover:text-slate-600 px-3 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">Clear</button>
                )}
              </div>
            </div>

            {/* Categories */}
            <div className="flex flex-wrap justify-center gap-2 mt-6">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    activeCategory === cat
                      ? 'bg-[var(--active-accent)] text-white shadow-lg shadow-[var(--active-accent)]/25'
                      : 'bg-white/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:text-[var(--active-accent)] border border-slate-200/50 dark:border-slate-700/50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Featured */}
        {featured.length > 0 && !search && activeCategory === 'All' && (
          <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-6">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="w-5 h-5 text-[var(--active-accent)]" />
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Featured</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {featured.slice(0, 2).map(blog => (
                <Link key={blog._id} href={`/blog/${blog.slug}`}
                  className="group relative glass-card overflow-hidden rounded-2xl hover:shadow-2xl transition-all duration-500">
                  {blog.coverImage && (
                    <div className="relative h-56 overflow-hidden">
                      <img src={blog.coverImage} alt={blog.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4">
                        <span className="inline-block text-xs font-semibold px-3 py-1 rounded-full bg-[var(--active-accent)] text-white mb-2">{blog.category}</span>
                        <h3 className="text-xl font-bold text-white leading-tight">{blog.title}</h3>
                        <div className="flex items-center gap-3 mt-2 text-xs text-white/70">
                          <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{new Date(blog.createdAt).toLocaleDateString()}</span>
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{blog.readTime} min</span>
                          <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{blog.views}</span>
                        </div>
                      </div>
                    </div>
                  )}
                  {!blog.coverImage && (
                    <div className="p-6">
                      <span className="inline-block text-xs font-semibold px-3 py-1 rounded-full bg-[var(--active-accent)]/10 text-[var(--active-accent)] mb-3">{blog.category}</span>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-[var(--active-accent)] transition-colors">{blog.title}</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 line-clamp-2">{blog.excerpt}</p>
                    </div>
                  )}
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Blog Grid */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="glass-card rounded-2xl overflow-hidden animate-pulse">
                  <div className="h-44 bg-slate-200 dark:bg-slate-700" />
                  <div className="p-5">
                    <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-3" />
                    <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-full mb-2" />
                    <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-[var(--active-accent)]/10 flex items-center justify-center">
                <BookOpen className="w-10 h-10 text-[var(--active-accent)]/50" />
              </div>
              <p className="text-lg font-semibold text-slate-500 dark:text-slate-400">
                {search ? 'No articles match your search' : 'No articles yet. Check back soon!'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map(blog => (
                <Link key={blog._id} href={`/blog/${blog.slug}`}
                  className="group glass-card-hover overflow-hidden rounded-2xl flex flex-col">
                  {blog.coverImage ? (
                    <div className="relative h-48 overflow-hidden">
                      <img src={blog.coverImage} alt={blog.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  ) : (
                    <div className="h-48 bg-gradient-to-br from-[var(--active-accent)]/5 to-purple-500/5 flex items-center justify-center">
                      <BookOpen className="w-10 h-10 text-[var(--active-accent)]/30" />
                    </div>
                  )}
                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[var(--active-accent)]/10 text-[var(--active-accent)]">{blog.category}</span>
                      {blog.featured && (
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center gap-1">
                          <Sparkles className="w-3 h-3" /> Featured
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-[var(--active-accent)] transition-colors line-clamp-2 text-base">{blog.title}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 line-clamp-2 flex-1">{blog.excerpt}</p>
                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/50">
                      <div className="flex items-center gap-3 text-xs text-slate-400">
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{blog.readTime} min</span>
                        <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{blog.views}</span>
                      </div>
                      <span className="text-xs font-semibold text-[var(--active-accent)] flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-0 translate-x-[-4px]">
                        Read <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
