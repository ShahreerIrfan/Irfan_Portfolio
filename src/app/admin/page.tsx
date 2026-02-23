'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  LayoutDashboard, FileText, FolderOpen, Wrench, HelpCircle,
  MessageSquare, BarChart3, Settings, LogOut, Menu, X, Plus,
  Eye, Users, Globe, TrendingUp, ChevronRight, Bell, Search,
  Sun, Moon, Edit, Trash2, Check, XCircle, ExternalLink,
  ChevronDown, ArrowUpRight, Clock, Mail, Calendar, Image as ImageIcon
} from 'lucide-react';

type Tab = 'dashboard' | 'blogs' | 'projects' | 'services' | 'faqs' | 'gallery' | 'contacts' | 'analytics' | 'settings';

interface DashboardData {
  totalViews: number;
  uniqueVisitors: number;
  viewsByPage: { _id: string; count: number }[];
  viewsByDay: { _id: string; count: number }[];
  topCountries: { _id: string; count: number }[];
  totalBlogs: number;
  totalProjects: number;
  totalContacts: number;
  recentViews: unknown[];
  topBlogs: { title: string; slug: string; views: number }[];
}

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState('');
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [loading, setLoading] = useState(false);

  // Data states
  const [dashData, setDashData] = useState<DashboardData | null>(null);
  const [blogs, setBlogs] = useState<Record<string, unknown>[]>([]);
  const [projects, setProjects] = useState<Record<string, unknown>[]>([]);
  const [services, setServices] = useState<Record<string, unknown>[]>([]);
  const [faqs, setFaqs] = useState<Record<string, unknown>[]>([]);
  const [contacts, setContacts] = useState<Record<string, unknown>[]>([]);
  const [gallery, setGallery] = useState<Record<string, unknown>[]>([]);

  // Editor states
  const [editMode, setEditMode] = useState<string | null>(null);
  const [editData, setEditData] = useState<Record<string, unknown>>({});

  useEffect(() => {
    const saved = localStorage.getItem('admin_token');
    if (saved) {
      setToken(saved);
      setIsLoggedIn(true);
    }
  }, []);

  const authHeaders = useCallback(() => ({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  }), [token]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginForm),
      });
      const data = await res.json();
      if (data.success) {
        setToken(data.token);
        localStorage.setItem('admin_token', data.token);
        setIsLoggedIn(true);
      } else {
        setLoginError(data.error || 'Login failed');
      }
    } catch {
      setLoginError('Network error');
    }
    setLoading(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    setToken('');
    setIsLoggedIn(false);
  };

  // Fetch data based on active tab
  useEffect(() => {
    if (!isLoggedIn) return;
    const load = async () => {
      setLoading(true);
      try {
        switch (activeTab) {
          case 'dashboard':
          case 'analytics': {
            const res = await fetch('/api/analytics', { headers: authHeaders() });
            const data = await res.json();
            setDashData(data);
            break;
          }
          case 'blogs': {
            const res = await fetch('/api/blogs?limit=100', { headers: authHeaders() });
            const data = await res.json();
            setBlogs(data.blogs || []);
            break;
          }
          case 'projects': {
            const res = await fetch('/api/projects', { headers: authHeaders() });
            const data = await res.json();
            setProjects(data || []);
            break;
          }
          case 'services': {
            const res = await fetch('/api/services', { headers: authHeaders() });
            const data = await res.json();
            setServices(data || []);
            break;
          }
          case 'faqs': {
            const res = await fetch('/api/faqs', { headers: authHeaders() });
            const data = await res.json();
            setFaqs(data || []);
            break;
          }
          case 'contacts': {
            const res = await fetch('/api/contact', { headers: authHeaders() });
            const data = await res.json();
            setContacts(data || []);
            break;
          }
          case 'gallery': {
            const res = await fetch('/api/gallery', { headers: authHeaders() });
            const data = await res.json();
            setGallery(data.galleries || []);
            break;
          }
        }
      } catch (err) {
        console.error('Failed to load data:', err);
      }
      setLoading(false);
    };
    load();
  }, [activeTab, isLoggedIn, authHeaders]);

  // CRUD helpers
  const deleteItem = async (endpoint: string, id: string, refresh: () => void) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    try {
      await fetch(`${endpoint}/${id}`, { method: 'DELETE', headers: authHeaders() });
      refresh();
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const saveItem = async (endpoint: string, data: Record<string, unknown>, isNew: boolean, refresh: () => void) => {
    try {
      const method = isNew ? 'POST' : 'PUT';
      const url = isNew ? endpoint : `${endpoint}/${data.slug || data._id}`;
      await fetch(url, {
        method,
        headers: authHeaders(),
        body: JSON.stringify(data),
      });
      setEditMode(null);
      setEditData({});
      refresh();
    } catch (err) {
      console.error('Save failed:', err);
    }
  };

  // ===== LOGIN SCREEN =====
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 mb-4 shadow-2xl shadow-blue-500/30">
              <LayoutDashboard className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
            <p className="text-slate-400 mt-2">Sign in to manage your portfolio</p>
          </div>

          <form onSubmit={handleLogin} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 space-y-5">
            {loginError && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-red-400 text-sm flex items-center gap-2">
                <XCircle className="w-4 h-4" />
                {loginError}
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
              <input
                type="email"
                value={loginForm.username}
                onChange={e => setLoginForm(f => ({ ...f, username: e.target.value }))}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/40 outline-none transition"
                placeholder="admin@example.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
              <input
                type="password"
                value={loginForm.password}
                onChange={e => setLoginForm(f => ({ ...f, password: e.target.value }))}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/40 outline-none transition"
                placeholder="••••••••"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg shadow-blue-500/25 disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ===== SIDEBAR TABS =====
  const tabs: { key: Tab; label: string; icon: React.ElementType }[] = [
    { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { key: 'blogs', label: 'Blog Posts', icon: FileText },
    { key: 'projects', label: 'Projects', icon: FolderOpen },
    { key: 'services', label: 'Services', icon: Wrench },
    { key: 'faqs', label: 'FAQs', icon: HelpCircle },
    { key: 'gallery', label: 'Gallery', icon: ImageIcon },
    { key: 'contacts', label: 'Messages', icon: MessageSquare },
    { key: 'analytics', label: 'Analytics', icon: BarChart3 },
  ];

  const refreshTab = () => {
    const current = activeTab;
    setActiveTab('dashboard');
    setTimeout(() => setActiveTab(current), 50);
  };

  // ===== RENDER CONTENT =====
  const renderContent = () => {
    if (loading && !dashData) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      );
    }

    switch (activeTab) {
      case 'dashboard':
        return renderDashboard();
      case 'blogs':
        return renderBlogs();
      case 'projects':
        return renderProjects();
      case 'services':
        return renderServices();
      case 'faqs':
        return renderFAQs();
      case 'gallery':
        return renderGallery();
      case 'contacts':
        return renderContacts();
      case 'analytics':
        return renderAnalytics();
      default:
        return null;
    }
  };

  // ===== DASHBOARD TAB =====
  const renderDashboard = () => {
    const stats = [
      { label: 'Total Views', value: dashData?.totalViews || 0, icon: Eye, color: 'from-blue-500 to-cyan-400', change: '+12%' },
      { label: 'Unique Visitors', value: dashData?.uniqueVisitors || 0, icon: Users, color: 'from-purple-500 to-pink-400', change: '+8%' },
      { label: 'Blog Posts', value: dashData?.totalBlogs || 0, icon: FileText, color: 'from-emerald-500 to-teal-400', change: '' },
      { label: 'Messages', value: dashData?.totalContacts || 0, icon: MessageSquare, color: 'from-amber-500 to-orange-400', change: 'new' },
    ];

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Welcome back, Shahreer!</h1>
            <p className="text-slate-500 dark:text-slate-400">Here&apos;s what&apos;s happening with your portfolio</p>
          </div>
          <div className="text-sm text-slate-400 flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map(s => (
            <div key={s.label} className="bg-white dark:bg-slate-800/50 rounded-2xl p-5 border border-slate-200 dark:border-slate-700/50 hover:shadow-lg transition-all group">
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2.5 rounded-xl bg-gradient-to-br ${s.color} shadow-lg`}>
                  <s.icon className="w-5 h-5 text-white" />
                </div>
                {s.change && (
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                    s.change === 'new' ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400' : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400'}`}>
                    {s.change === 'new' ? '📬 New' : s.change}
                  </span>
                )}
              </div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{s.value.toLocaleString()}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Views Chart */}
          <div className="bg-white dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-700/50">
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-500" />
              Page Views (Last 30 Days)
            </h3>
            <div className="h-48 flex items-end gap-1">
              {(dashData?.viewsByDay || []).slice(-30).map((d, i) => {
                const max = Math.max(...(dashData?.viewsByDay || []).map(x => x.count), 1);
                const height = (d.count / max) * 100;
                return (
                  <div key={i} className="flex-1 group/bar relative">
                    <div
                      className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-sm hover:from-blue-600 hover:to-blue-500 transition-all cursor-pointer"
                      style={{ height: `${Math.max(height, 2)}%` }}
                    />
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 hidden group-hover/bar:block bg-slate-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10">
                      {d.count} views
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Top Countries */}
          <div className="bg-white dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-700/50">
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Globe className="w-5 h-5 text-purple-500" />
              Visitor Locations
            </h3>
            <div className="space-y-3">
              {(dashData?.topCountries || []).slice(0, 6).map((c, i) => {
                const max = Math.max(...(dashData?.topCountries || []).map(x => x.count), 1);
                const pct = (c.count / max) * 100;
                return (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300 w-24 truncate">{c._id}</span>
                    <div className="flex-1 h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-purple-500 to-pink-400 rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="text-xs text-slate-500 w-8 text-right">{c.count}</span>
                  </div>
                );
              })}
              {(!dashData?.topCountries || dashData.topCountries.length === 0) && (
                <p className="text-sm text-slate-400 text-center py-8">No location data yet</p>
              )}
            </div>
          </div>
        </div>

        {/* Top Blog Posts */}
        <div className="bg-white dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-700/50">
          <h3 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-500" />
            Top Blog Posts
          </h3>
          <div className="space-y-3">
            {(dashData?.topBlogs || []).map((b, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold text-slate-300 dark:text-slate-600 w-6">#{i + 1}</span>
                  <span className="font-medium text-slate-700 dark:text-slate-300">{b.title}</span>
                </div>
                <span className="text-sm text-slate-500 flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5" />
                  {b.views} views
                </span>
              </div>
            ))}
            {(!dashData?.topBlogs || dashData.topBlogs.length === 0) && (
              <p className="text-sm text-slate-400 text-center py-4">No blog posts yet. Create your first post!</p>
            )}
          </div>
        </div>
      </div>
    );
  };

  // ===== BLOG EDITOR =====
  const renderBlogEditor = () => {
    return (
      <div className="bg-white dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-700/50 space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            {editMode === 'new' ? 'Create New Blog Post' : 'Edit Blog Post'}
          </h3>
          <button onClick={() => { setEditMode(null); setEditData({}); }}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Title *</label>
            <input
              type="text" value={(editData.title as string) || ''} onChange={e => setEditData(d => ({ ...d, title: e.target.value }))}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/30 outline-none"
              placeholder="Blog post title"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Slug</label>
            <input
              type="text" value={(editData.slug as string) || ''} onChange={e => setEditData(d => ({ ...d, slug: e.target.value }))}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/30 outline-none"
              placeholder="auto-generated-from-title"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Excerpt *</label>
          <textarea
            value={(editData.excerpt as string) || ''} onChange={e => setEditData(d => ({ ...d, excerpt: e.target.value }))}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/30 outline-none resize-none h-20"
            placeholder="Short description of the post"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Content * (HTML supported)</label>
          <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
            {/* Rich text toolbar */}
            <div className="flex flex-wrap gap-1 p-2 bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
              {[
                { label: 'B', cmd: 'bold', style: 'font-bold' },
                { label: 'I', cmd: 'italic', style: 'italic' },
                { label: 'U', cmd: 'underline', style: 'underline' },
                { label: 'H1', cmd: 'h1', style: 'text-xs font-bold' },
                { label: 'H2', cmd: 'h2', style: 'text-xs font-bold' },
                { label: 'H3', cmd: 'h3', style: 'text-xs font-bold' },
                { label: '🔗', cmd: 'link', style: '' },
                { label: '📷', cmd: 'image', style: '' },
                { label: '• List', cmd: 'ul', style: 'text-xs' },
                { label: '1. List', cmd: 'ol', style: 'text-xs' },
                { label: '" Quote', cmd: 'quote', style: 'text-xs' },
                { label: '< Code', cmd: 'code', style: 'text-xs font-mono' },
              ].map(btn => (
                <button
                  key={btn.cmd}
                  type="button"
                  onClick={() => {
                    const content = (editData.content as string) || '';
                    let wrap = '';
                    switch (btn.cmd) {
                      case 'bold': wrap = `<strong>bold text</strong>`; break;
                      case 'italic': wrap = `<em>italic text</em>`; break;
                      case 'underline': wrap = `<u>underlined text</u>`; break;
                      case 'h1': wrap = `<h1>Heading 1</h1>`; break;
                      case 'h2': wrap = `<h2>Heading 2</h2>`; break;
                      case 'h3': wrap = `<h3>Heading 3</h3>`; break;
                      case 'link': wrap = `<a href="https://example.com">link text</a>`; break;
                      case 'image': wrap = `<img src="https://example.com/image.jpg" alt="description" class="w-full rounded-xl my-4" />`; break;
                      case 'ul': wrap = `<ul><li>Item 1</li><li>Item 2</li></ul>`; break;
                      case 'ol': wrap = `<ol><li>Item 1</li><li>Item 2</li></ol>`; break;
                      case 'quote': wrap = `<blockquote>Quote text</blockquote>`; break;
                      case 'code': wrap = `<pre><code>code here</code></pre>`; break;
                    }
                    setEditData(d => ({ ...d, content: content + '\n' + wrap }));
                  }}
                  className={`px-3 py-1.5 rounded-lg text-sm hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors ${btn.style}`}
                >
                  {btn.label}
                </button>
              ))}
            </div>
            <textarea
              value={(editData.content as string) || ''}
              onChange={e => setEditData(d => ({ ...d, content: e.target.value }))}
              className="w-full px-4 py-3 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none resize-none h-64 font-mono text-sm"
              placeholder="Write your blog content here... HTML tags are supported for rich formatting."
            />
          </div>
          {/* Live Preview */}
          {(editData.content as string) && (
            <div className="mt-3">
              <p className="text-xs font-medium text-slate-500 mb-2">Preview:</p>
              <div className="prose prose-sm dark:prose-invert max-w-none p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700 max-h-64 overflow-auto"
                dangerouslySetInnerHTML={{ __html: (editData.content as string) || '' }} />
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Category</label>
            <input
              type="text" value={(editData.category as string) || ''} onChange={e => setEditData(d => ({ ...d, category: e.target.value }))}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/30 outline-none"
              placeholder="e.g. Web Development"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Tags (comma-separated)</label>
            <input
              type="text" value={Array.isArray(editData.tags) ? (editData.tags as string[]).join(', ') : (editData.tags as string) || ''}
              onChange={e => setEditData(d => ({ ...d, tags: e.target.value.split(',').map(t => t.trim()) }))}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/30 outline-none"
              placeholder="react, nextjs, tutorial"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Cover Image URL</label>
            <input
              type="text" value={(editData.coverImage as string) || ''} onChange={e => setEditData(d => ({ ...d, coverImage: e.target.value }))}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/30 outline-none"
              placeholder="https://example.com/image.jpg"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Meta Title (SEO)</label>
            <input
              type="text" value={(editData.metaTitle as string) || ''} onChange={e => setEditData(d => ({ ...d, metaTitle: e.target.value }))}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/30 outline-none"
              placeholder="SEO-optimized page title"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Meta Description (SEO)</label>
            <input
              type="text" value={(editData.metaDescription as string) || ''} onChange={e => setEditData(d => ({ ...d, metaDescription: e.target.value }))}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/30 outline-none"
              placeholder="Brief description for search engines"
            />
          </div>
        </div>

        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={!!editData.published} onChange={e => setEditData(d => ({ ...d, published: e.target.checked }))}
              className="w-4 h-4 rounded border-slate-300 text-blue-500 focus:ring-blue-500" />
            <span className="text-sm text-slate-700 dark:text-slate-300">Published</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={!!editData.featured} onChange={e => setEditData(d => ({ ...d, featured: e.target.checked }))}
              className="w-4 h-4 rounded border-slate-300 text-blue-500 focus:ring-blue-500" />
            <span className="text-sm text-slate-700 dark:text-slate-300">Featured</span>
          </label>
        </div>

        <div className="flex gap-3 pt-2">
          <button onClick={() => saveItem('/api/blogs', editData, editMode === 'new', refreshTab)}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg shadow-blue-500/25">
            {editMode === 'new' ? 'Create Post' : 'Update Post'}
          </button>
          <button onClick={() => { setEditMode(null); setEditData({}); }}
            className="px-6 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
            Cancel
          </button>
        </div>
      </div>
    );
  };

  // ===== BLOGS TAB =====
  const renderBlogs = () => {
    if (editMode) return renderBlogEditor();

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Blog Posts</h2>
          <button onClick={() => { setEditMode('new'); setEditData({ published: false, featured: false }); }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg shadow-blue-500/25">
            <Plus className="w-4 h-4" />
            New Post
          </button>
        </div>

        <div className="bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700/50 overflow-hidden">
          {blogs.length === 0 ? (
            <div className="p-12 text-center">
              <FileText className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600 mb-3" />
              <p className="text-slate-500 dark:text-slate-400">No blog posts yet. Create your first post!</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-700/50">
              {blogs.map((blog: Record<string, unknown>) => (
                <div key={blog._id as string} className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700/20 transition-colors">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-slate-900 dark:text-white truncate">{blog.title as string}</h3>
                      {blog.featured ? <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400">Featured</span> : null}
                      <span className={`text-xs px-2 py-0.5 rounded-full ${blog.published ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400' : 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400'}`}>
                        {blog.published ? 'Published' : 'Draft'}
                      </span>
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 truncate">{blog.excerpt as string}</p>
                    <div className="flex items-center gap-4 mt-1 text-xs text-slate-400">
                      <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{(blog.views as number) || 0} views</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{new Date(blog.createdAt as string).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <button onClick={() => { setEditMode('edit'); setEditData(blog); }}
                      className="p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-500/10 text-slate-400 hover:text-blue-500 transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button onClick={() => deleteItem('/api/blogs', blog.slug as string, refreshTab)}
                      className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 text-slate-400 hover:text-red-500 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  // ===== GENERIC LIST RENDERER =====
  const renderGenericList = (
    title: string,
    items: Record<string, unknown>[],
    endpoint: string,
    fields: { key: string; label: string; type?: string }[],
    nameKey: string = 'title'
  ) => {
    if (editMode) {
      return (
        <div className="bg-white dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-700/50 space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {editMode === 'new' ? `Add ${title.slice(0, -1)}` : `Edit ${title.slice(0, -1)}`}
            </h3>
            <button onClick={() => { setEditMode(null); setEditData({}); }}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {fields.map(f => (
              <div key={f.key} className={f.type === 'textarea' ? 'md:col-span-2' : ''}>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{f.label}</label>
                {f.type === 'textarea' ? (
                  <textarea
                    value={(editData[f.key] as string) || ''}
                    onChange={e => setEditData(d => ({ ...d, [f.key]: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/30 outline-none resize-none h-24"
                  />
                ) : f.type === 'checkbox' ? (
                  <label className="flex items-center gap-2 mt-2 cursor-pointer">
                    <input type="checkbox" checked={!!editData[f.key]}
                      onChange={e => setEditData(d => ({ ...d, [f.key]: e.target.checked }))}
                      className="w-4 h-4 rounded border-slate-300 text-blue-500 focus:ring-blue-500" />
                    <span className="text-sm text-slate-600 dark:text-slate-400">Enable</span>
                  </label>
                ) : f.type === 'array' ? (
                  <input
                    type="text"
                    value={Array.isArray(editData[f.key]) ? (editData[f.key] as string[]).join(', ') : (editData[f.key] as string) || ''}
                    onChange={e => setEditData(d => ({ ...d, [f.key]: e.target.value.split(',').map(t => t.trim()) }))}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/30 outline-none"
                    placeholder="Comma-separated values"
                  />
                ) : (
                  <input
                    type={f.type || 'text'}
                    value={(editData[f.key] as string) || ''}
                    onChange={e => setEditData(d => ({ ...d, [f.key]: f.type === 'number' ? Number(e.target.value) : e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/30 outline-none"
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={() => saveItem(endpoint, editData, editMode === 'new', refreshTab)}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg shadow-blue-500/25">
              {editMode === 'new' ? 'Create' : 'Update'}
            </button>
            <button onClick={() => { setEditMode(null); setEditData({}); }}
              className="px-6 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
              Cancel
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">{title}</h2>
          <button onClick={() => { setEditMode('new'); setEditData({}); }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg shadow-blue-500/25">
            <Plus className="w-4 h-4" />
            Add New
          </button>
        </div>
        <div className="bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700/50 overflow-hidden">
          {items.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-slate-500 dark:text-slate-400">No {title.toLowerCase()} yet.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-700/50">
              {items.map((item: Record<string, unknown>) => (
                <div key={(item._id || item.slug) as string} className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700/20 transition-colors">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-slate-900 dark:text-white truncate">{item[nameKey] as string}</h3>
                    {item.description ? <p className="text-sm text-slate-500 dark:text-slate-400 truncate mt-0.5">{String(item.description)}</p> : null}
                    {item.question ? <p className="text-sm text-slate-500 dark:text-slate-400 truncate mt-0.5">{String(item.answer)}</p> : null}
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <button onClick={() => { setEditMode('edit'); setEditData(item); }}
                      className="p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-500/10 text-slate-400 hover:text-blue-500 transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button onClick={() => deleteItem(endpoint, (item.slug || item._id) as string, refreshTab)}
                      className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 text-slate-400 hover:text-red-500 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  // ===== PROJECTS TAB =====
  const renderProjects = () =>
    renderGenericList('Projects', projects, '/api/projects', [
      { key: 'title', label: 'Title' },
      { key: 'slug', label: 'Slug' },
      { key: 'description', label: 'Short Description', type: 'textarea' },
      { key: 'longDescription', label: 'Long Description', type: 'textarea' },
      { key: 'category', label: 'Category' },
      { key: 'stack', label: 'Tech Stack', type: 'array' },
      { key: 'image', label: 'Image URL' },
      { key: 'liveUrl', label: 'Live URL' },
      { key: 'githubUrl', label: 'GitHub URL' },
      { key: 'order', label: 'Order', type: 'number' },
      { key: 'featured', label: 'Featured', type: 'checkbox' },
      { key: 'published', label: 'Published', type: 'checkbox' },
    ]);

  // ===== SERVICES TAB =====
  const renderServices = () =>
    renderGenericList('Services', services, '/api/services', [
      { key: 'title', label: 'Title' },
      { key: 'slug', label: 'Slug' },
      { key: 'description', label: 'Short Description', type: 'textarea' },
      { key: 'longDescription', label: 'Long Description', type: 'textarea' },
      { key: 'icon', label: 'Icon Name (Lucide)' },
      { key: 'gradient', label: 'Gradient (e.g. from-blue-500 to-cyan-400)' },
      { key: 'features', label: 'Features', type: 'array' },
      { key: 'price', label: 'Price' },
      { key: 'order', label: 'Order', type: 'number' },
      { key: 'featured', label: 'Featured', type: 'checkbox' },
      { key: 'published', label: 'Published', type: 'checkbox' },
    ]);

  // ===== FAQS TAB =====
  const renderFAQs = () =>
    renderGenericList('FAQs', faqs, '/api/faqs', [
      { key: 'question', label: 'Question' },
      { key: 'answer', label: 'Answer', type: 'textarea' },
      { key: 'category', label: 'Category' },
      { key: 'order', label: 'Order', type: 'number' },
      { key: 'published', label: 'Published', type: 'checkbox' },
    ], 'question');

  // ===== GALLERY TAB =====
  const renderGallery = () => {
    const isEditing = editMode === 'gallery-new' || editMode === 'gallery-edit';

    if (isEditing) {
      return (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">{editMode === 'gallery-new' ? 'Add Gallery Image' : 'Edit Gallery Image'}</h2>
            <button onClick={() => { setEditMode(null); setEditData({}); }} className="text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">Cancel</button>
          </div>
          <div className="bg-white dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-700/50 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Title</label>
              <input value={String(editData.title || '')} onChange={e => setEditData(d => ({ ...d, title: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/30" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Image URL</label>
              <input value={String(editData.imageUrl || '')} onChange={e => setEditData(d => ({ ...d, imageUrl: e.target.value }))}
                placeholder="/shahreer_irfan.jpg or https://..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/30" />
              {Boolean(editData.imageUrl) && (
                <div className="mt-2 w-32 h-32 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
                  <img src={String(editData.imageUrl)} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description</label>
              <textarea value={String(editData.description || '')} onChange={e => setEditData(d => ({ ...d, description: e.target.value }))} rows={3}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/30 resize-none" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Category</label>
                <input value={String(editData.category || '')} onChange={e => setEditData(d => ({ ...d, category: e.target.value }))} placeholder="General"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/30" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Order</label>
                <input type="number" value={String(editData.order || 0)} onChange={e => setEditData(d => ({ ...d, order: Number(e.target.value) }))}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/30" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" checked={Boolean(editData.published !== false)} onChange={e => setEditData(d => ({ ...d, published: e.target.checked }))} id="gal-published" className="rounded" />
              <label htmlFor="gal-published" className="text-sm text-slate-700 dark:text-slate-300">Published</label>
            </div>
            <button
              onClick={async () => {
                const isNew = editMode === 'gallery-new';
                const method = isNew ? 'POST' : 'PUT';
                const url = isNew ? '/api/gallery' : `/api/gallery/${editData._id}`;
                await fetch(url, { method, headers: authHeaders(), body: JSON.stringify(editData) });
                setEditMode(null);
                setEditData({});
                setActiveTab('dashboard'); setTimeout(() => setActiveTab('gallery'), 50);
              }}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg"
            >
              {editMode === 'gallery-new' ? 'Add Image' : 'Save Changes'}
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Gallery ({gallery.length})</h2>
          <button onClick={() => { setEditMode('gallery-new'); setEditData({ published: true, order: gallery.length }); }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-semibold hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg">
            <Plus className="w-4 h-4" /> Add Image
          </button>
        </div>
        {gallery.length === 0 ? (
          <div className="bg-white dark:bg-slate-800/50 rounded-2xl p-12 border border-slate-200 dark:border-slate-700/50 text-center">
            <ImageIcon className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600 mb-3" />
            <p className="text-slate-500 dark:text-slate-400">No gallery images yet. Add your first image!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {gallery.map((item: Record<string, unknown>) => (
              <div key={item._id as string} className="group relative bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700/50 overflow-hidden">
                <div className="aspect-square relative">
                  <img src={String(item.imageUrl)} alt={String(item.title)} className="w-full h-full object-cover" />
                  {!item.published && (
                    <span className="absolute top-2 left-2 text-xs px-2 py-0.5 rounded-full bg-red-500/90 text-white">Draft</span>
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                    <button onClick={() => { setEditMode('gallery-edit'); setEditData({ ...item }); }}
                      className="p-2 rounded-lg bg-white/90 text-slate-700 hover:bg-white transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button onClick={() => deleteItem('/api/gallery', item._id as string, () => { setActiveTab('dashboard'); setTimeout(() => setActiveTab('gallery'), 50); })}
                      className="p-2 rounded-lg bg-white/90 text-red-500 hover:bg-white transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="p-3">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{String(item.title)}</p>
                  <p className="text-xs text-slate-400">{String(item.category || 'General')}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  // ===== CONTACTS TAB =====
  const renderContacts = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Contact Messages</h2>
        <span className="text-sm text-slate-500">
          {contacts.filter(c => !c.read).length} unread
        </span>
      </div>
      <div className="bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700/50 overflow-hidden">
        {contacts.length === 0 ? (
          <div className="p-12 text-center">
            <Mail className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600 mb-3" />
            <p className="text-slate-500 dark:text-slate-400">No messages yet.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-700/50">
            {contacts.map((c: Record<string, unknown>) => (
              <div key={c._id as string} className={`p-5 hover:bg-slate-50 dark:hover:bg-slate-700/20 transition-colors ${!c.read ? 'bg-blue-50/30 dark:bg-blue-500/5' : ''}`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-slate-900 dark:text-white">{c.name as string}</h3>
                      {!c.read && <span className="w-2 h-2 rounded-full bg-blue-500" />}
                    </div>
                    <p className="text-sm text-blue-500">{c.email as string}</p>
                    {c.subject ? <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mt-1">{String(c.subject)}</p> : null}
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{c.message as string}</p>
                    <p className="text-xs text-slate-400 mt-2">{new Date(c.createdAt as string).toLocaleString()}</p>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    {!c.read && (
                      <button
                        onClick={async () => {
                          await fetch(`/api/contact/${c._id}`, { method: 'PUT', headers: authHeaders(), body: JSON.stringify({ read: true }) });
                          refreshTab();
                        }}
                        className="p-2 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-500/10 text-slate-400 hover:text-emerald-500 transition-colors"
                        title="Mark as read"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    )}
                    <button onClick={() => deleteItem('/api/contact', c._id as string, refreshTab)}
                      className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 text-slate-400 hover:text-red-500 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  // ===== ANALYTICS TAB =====
  const renderAnalytics = () => {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Analytics Overview</h2>
          <div className="flex items-center gap-2">
            {[7, 14, 30, 90].map(d => (
              <button key={d}
                className="px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                {d}d
              </button>
            ))}
          </div>
        </div>

        {/* Big Numbers */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-700/50 text-center">
            <Eye className="w-8 h-8 mx-auto mb-2 text-blue-500" />
            <p className="text-3xl font-bold text-slate-900 dark:text-white">{(dashData?.totalViews || 0).toLocaleString()}</p>
            <p className="text-sm text-slate-500">Total Page Views</p>
          </div>
          <div className="bg-white dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-700/50 text-center">
            <Users className="w-8 h-8 mx-auto mb-2 text-purple-500" />
            <p className="text-3xl font-bold text-slate-900 dark:text-white">{(dashData?.uniqueVisitors || 0).toLocaleString()}</p>
            <p className="text-sm text-slate-500">Unique Visitors</p>
          </div>
          <div className="bg-white dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-700/50 text-center">
            <Globe className="w-8 h-8 mx-auto mb-2 text-emerald-500" />
            <p className="text-3xl font-bold text-slate-900 dark:text-white">{dashData?.topCountries?.length || 0}</p>
            <p className="text-sm text-slate-500">Countries</p>
          </div>
        </div>

        {/* Views by Page */}
        <div className="bg-white dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-700/50">
          <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Top Pages</h3>
          <div className="space-y-3">
            {(dashData?.viewsByPage || []).map((p, i) => {
              const max = Math.max(...(dashData?.viewsByPage || []).map(x => x.count), 1);
              const pct = (p.count / max) * 100;
              return (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300 w-40 truncate">{p._id}</span>
                  <div className="flex-1 h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="text-xs text-slate-500 w-12 text-right">{p.count}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-700/50">
          <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Recent Activity</h3>
          <div className="space-y-2 max-h-64 overflow-auto">
            {(dashData?.recentViews as Record<string, unknown>[] || []).slice(0, 15).map((v: Record<string, unknown>, i: number) => (
              <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/30 text-sm">
                <div className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="text-slate-700 dark:text-slate-300">{v.page as string}</span>
                <span className="text-slate-400 text-xs">{v.country as string}</span>
                <span className="ml-auto text-slate-400 text-xs">{new Date(v.createdAt as string).toLocaleTimeString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // ===== MAIN LAYOUT =====
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex">
      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 transform transition-transform lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
              <LayoutDashboard className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-bold text-slate-900 dark:text-white text-sm">Admin Panel</p>
              <p className="text-xs text-slate-500">Irfan Portfolio</p>
            </div>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <nav className="p-3 space-y-1">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => { setActiveTab(tab.key); setEditMode(null); setEditData({}); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeTab === tab.key
                  ? 'bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              {tab.label}
              {tab.key === 'contacts' && contacts.filter(c => !c.read).length > 0 && (
                <span className="ml-auto bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {contacts.filter(c => !c.read).length}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-slate-200 dark:border-slate-700">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Bar */}
        <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-700 px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700">
              <Menu className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            </button>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white capitalize">{activeTab}</h2>
          </div>
          <div className="flex items-center gap-3">
            <a href="/" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-slate-500 hover:text-blue-500 transition-colors">
              <ExternalLink className="w-4 h-4" />
              View Site
            </a>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-6 overflow-auto">
          {renderContent()}
        </main>
      </div>

      {/* Sidebar overlay for mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}
    </div>
  );
}
