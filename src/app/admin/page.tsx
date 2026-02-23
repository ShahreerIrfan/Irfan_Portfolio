'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  LayoutDashboard, FileText, FolderOpen, Wrench, HelpCircle,
  MessageSquare, BarChart3, LogOut, Menu, X, Plus,
  Eye, Users, Globe, TrendingUp,
  Edit, Trash2, Check, XCircle, ExternalLink,
  Clock, Mail, Calendar, Image as ImageIcon,
  Star, CalendarClock, DollarSign, Newspaper, Settings,
  Zap, Target, Award, Activity, ShieldCheck,
  Download, Palette, RotateCcw
} from 'lucide-react';
import BlockEditor, { Block, blocksToHtml } from '@/components/admin/BlockEditor';

type Tab = 'dashboard' | 'blogs' | 'projects' | 'services' | 'faqs' | 'gallery' |
  'contacts' | 'analytics' | 'testimonials' | 'meetings' | 'quotes' | 'newsletter' | 'settings';

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
  const [blogs, setBlogs] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [faqs, setFaqs] = useState<any[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);
  const [gallery, setGallery] = useState<any[]>([]);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [meetings, setMeetings] = useState<any[]>([]);
  const [quotes, setQuotes] = useState<any[]>([]);
  const [newsletters, setNewsletters] = useState<any[]>([]);
  const [siteSettings, setSiteSettings] = useState<Record<string, any>>({});

  // Editor states
  const [editMode, setEditMode] = useState<string | null>(null);
  const [editData, setEditData] = useState<Record<string, any>>({});
  const [blogBlocks, setBlogBlocks] = useState<Block[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('admin_token');
    if (saved) { setToken(saved); setIsLoggedIn(true); }
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
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginForm),
      });
      const data = await res.json();
      if (data.success) { setToken(data.token); localStorage.setItem('admin_token', data.token); setIsLoggedIn(true); }
      else { setLoginError(data.error || 'Login failed'); }
    } catch { setLoginError('Network error'); }
    setLoading(false);
  };

  const handleLogout = () => { localStorage.removeItem('admin_token'); setToken(''); setIsLoggedIn(false); };

  // Fetch data based on active tab
  useEffect(() => {
    if (!isLoggedIn) return;
    const load = async () => {
      setLoading(true);
      try {
        switch (activeTab) {
          case 'dashboard':
          case 'analytics': {
            const [analRes, settRes] = await Promise.all([
              fetch('/api/analytics', { headers: authHeaders() }),
              fetch('/api/site-settings'),
            ]);
            const analData = await analRes.json();
            setDashData(analData);
            const settData = await settRes.json();
            setSiteSettings(settData || {});
            try {
              const [testRes, meetRes, quoteRes, nlRes] = await Promise.all([
                fetch('/api/testimonials', { headers: authHeaders() }),
                fetch('/api/meetings', { headers: authHeaders() }),
                fetch('/api/quote-requests', { headers: authHeaders() }),
                fetch('/api/newsletter', { headers: authHeaders() }),
              ]);
              const testData = await testRes.json();
              setTestimonials(Array.isArray(testData) ? testData : []);
              const meetData = await meetRes.json();
              setMeetings(Array.isArray(meetData) ? meetData : []);
              const quoteData = await quoteRes.json();
              setQuotes(Array.isArray(quoteData) ? quoteData : []);
              const nlData = await nlRes.json();
              setNewsletters(nlData?.subscribers || []);
            } catch { /* new endpoints might not exist yet */ }
            break;
          }
          case 'blogs': {
            const res = await fetch('/api/blogs?limit=100', { headers: authHeaders() });
            const data = await res.json(); setBlogs(data.blogs || []); break;
          }
          case 'projects': {
            const res = await fetch('/api/projects', { headers: authHeaders() });
            const data = await res.json(); setProjects(Array.isArray(data) ? data : []); break;
          }
          case 'services': {
            const res = await fetch('/api/services', { headers: authHeaders() });
            const data = await res.json(); setServices(Array.isArray(data) ? data : []); break;
          }
          case 'faqs': {
            const res = await fetch('/api/faqs', { headers: authHeaders() });
            const data = await res.json(); setFaqs(Array.isArray(data) ? data : []); break;
          }
          case 'contacts': {
            const res = await fetch('/api/contact', { headers: authHeaders() });
            const data = await res.json(); setContacts(Array.isArray(data) ? data : []); break;
          }
          case 'gallery': {
            const res = await fetch('/api/gallery', { headers: authHeaders() });
            const data = await res.json(); setGallery(data.galleries || data || []); break;
          }
          case 'testimonials': {
            const res = await fetch('/api/testimonials', { headers: authHeaders() });
            const data = await res.json(); setTestimonials(Array.isArray(data) ? data : []); break;
          }
          case 'meetings': {
            const res = await fetch('/api/meetings', { headers: authHeaders() });
            const data = await res.json(); setMeetings(Array.isArray(data) ? data : []); break;
          }
          case 'quotes': {
            const res = await fetch('/api/quote-requests', { headers: authHeaders() });
            const data = await res.json(); setQuotes(Array.isArray(data) ? data : []); break;
          }
          case 'newsletter': {
            const res = await fetch('/api/newsletter', { headers: authHeaders() });
            const data = await res.json(); setNewsletters(data?.subscribers || []); break;
          }
          case 'settings': {
            const res = await fetch('/api/site-settings');
            const data = await res.json(); setSiteSettings(data || {}); break;
          }
        }
      } catch (err) { console.error('Failed to load data:', err); }
      setLoading(false);
    };
    load();
  }, [activeTab, isLoggedIn, authHeaders]);

  // CRUD helpers
  const deleteItem = async (endpoint: string, id: string, refresh: () => void) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    try { await fetch(`${endpoint}/${id}`, { method: 'DELETE', headers: authHeaders() }); refresh(); }
    catch (err) { console.error('Delete failed:', err); }
  };

  const saveItem = async (endpoint: string, data: any, isNew: boolean, refresh: () => void) => {
    try {
      const method = isNew ? 'POST' : 'PUT';
      const url = isNew ? endpoint : `${endpoint}/${data.slug || data._id}`;
      await fetch(url, { method, headers: authHeaders(), body: JSON.stringify(data) });
      setEditMode(null); setEditData({}); refresh();
    } catch (err) { console.error('Save failed:', err); }
  };

  const refreshTab = () => {
    const current = activeTab;
    setActiveTab('dashboard');
    setTimeout(() => setActiveTab(current), 50);
  };

  // ===== LOGIN SCREEN =====
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 mb-4 shadow-2xl shadow-blue-500/30 animate-pulse">
              <LayoutDashboard className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
            <p className="text-slate-400 mt-2">Sign in to manage your portfolio</p>
          </div>
          <form onSubmit={handleLogin} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 space-y-5 shadow-2xl">
            {loginError && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-red-400 text-sm flex items-center gap-2">
                <XCircle className="w-4 h-4" /> {loginError}
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
              <input type="email" value={loginForm.username} onChange={e => setLoginForm(f => ({ ...f, username: e.target.value }))}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/40 outline-none transition" placeholder="admin@example.com" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
              <input type="password" value={loginForm.password} onChange={e => setLoginForm(f => ({ ...f, password: e.target.value }))}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/40 outline-none transition" placeholder="••••••••" required />
            </div>
            <button type="submit" disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg shadow-blue-500/25 disabled:opacity-50">
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ===== SIDEBAR TABS =====
  const tabGroups = [
    {
      label: 'Main',
      items: [
        { key: 'dashboard' as Tab, label: 'Dashboard', icon: LayoutDashboard },
        { key: 'analytics' as Tab, label: 'Analytics', icon: BarChart3 },
      ]
    },
    {
      label: 'Content',
      items: [
        { key: 'blogs' as Tab, label: 'Blog Posts', icon: FileText },
        { key: 'projects' as Tab, label: 'Projects', icon: FolderOpen },
        { key: 'services' as Tab, label: 'Services', icon: Wrench },
        { key: 'gallery' as Tab, label: 'Gallery', icon: ImageIcon },
        { key: 'faqs' as Tab, label: 'FAQs', icon: HelpCircle },
      ]
    },
    {
      label: 'Client Hub',
      items: [
        { key: 'testimonials' as Tab, label: 'Testimonials', icon: Star },
        { key: 'meetings' as Tab, label: 'Meetings', icon: CalendarClock },
        { key: 'quotes' as Tab, label: 'Quote Requests', icon: DollarSign },
        { key: 'contacts' as Tab, label: 'Messages', icon: MessageSquare },
        { key: 'newsletter' as Tab, label: 'Newsletter', icon: Newspaper },
      ]
    },
    {
      label: 'System',
      items: [
        { key: 'settings' as Tab, label: 'Site Settings', icon: Settings },
      ]
    },
  ];

  // ===== RENDER CONTENT =====
  const renderContent = () => {
    if (loading && !dashData && !blogs.length) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-3 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-slate-400">Loading...</p>
          </div>
        </div>
      );
    }
    switch (activeTab) {
      case 'dashboard': return renderDashboard();
      case 'blogs': return renderBlogs();
      case 'projects': return renderProjects();
      case 'services': return renderServices();
      case 'faqs': return renderFAQs();
      case 'gallery': return renderGallery();
      case 'contacts': return renderContacts();
      case 'analytics': return renderAnalytics();
      case 'testimonials': return renderTestimonials();
      case 'meetings': return renderMeetings();
      case 'quotes': return renderQuotes();
      case 'newsletter': return renderNewsletter();
      case 'settings': return renderSettings();
      default: return null;
    }
  };

  // ===== ENHANCED DASHBOARD TAB =====
  const renderDashboard = () => {
    const stats = [
      { label: 'Total Views', value: dashData?.totalViews || 0, icon: Eye, gradient: 'from-blue-500 to-cyan-400', bgGlow: 'shadow-blue-500/20' },
      { label: 'Unique Visitors', value: dashData?.uniqueVisitors || 0, icon: Users, gradient: 'from-violet-500 to-purple-400', bgGlow: 'shadow-violet-500/20' },
      { label: 'Blog Posts', value: dashData?.totalBlogs || 0, icon: FileText, gradient: 'from-emerald-500 to-teal-400', bgGlow: 'shadow-emerald-500/20' },
      { label: 'Messages', value: dashData?.totalContacts || 0, icon: MessageSquare, gradient: 'from-amber-500 to-orange-400', bgGlow: 'shadow-amber-500/20' },
      { label: 'Projects', value: dashData?.totalProjects || 0, icon: FolderOpen, gradient: 'from-pink-500 to-rose-400', bgGlow: 'shadow-pink-500/20' },
      { label: 'Testimonials', value: testimonials.length, icon: Star, gradient: 'from-yellow-500 to-amber-400', bgGlow: 'shadow-yellow-500/20' },
      { label: 'Pending Meetings', value: meetings.filter(m => m.status === 'pending').length, icon: CalendarClock, gradient: 'from-indigo-500 to-blue-400', bgGlow: 'shadow-indigo-500/20' },
      { label: 'New Quotes', value: quotes.filter(q => q.status === 'new').length, icon: DollarSign, gradient: 'from-lime-500 to-green-400', bgGlow: 'shadow-lime-500/20' },
    ];

    const quickActions = [
      { label: 'New Blog Post', icon: FileText, action: () => { setActiveTab('blogs'); setEditMode('new'); setEditData({ published: false, featured: false }); setBlogBlocks([]); } },
      { label: 'Add Project', icon: FolderOpen, action: () => { setActiveTab('projects'); setEditMode('new'); setEditData({}); } },
      { label: 'Add Testimonial', icon: Star, action: () => { setActiveTab('testimonials'); setEditMode('new'); setEditData({ published: true, rating: 5 }); } },
      { label: 'View Site', icon: ExternalLink, action: () => window.open('/', '_blank') },
    ];

    const availableForHire = siteSettings.availableForHire !== false;

    return (
      <div className="space-y-8">
        {/* Welcome Header */}
        <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 rounded-3xl p-8 text-white">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4" />
          <div className="relative z-10">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h1 className="text-3xl font-bold mb-2">Welcome back! 👋</h1>
                <p className="text-white/70 text-lg">Here&apos;s your portfolio overview for today</p>
              </div>
              <div className="flex items-center gap-3">
                <div className={`flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-sm ${
                  availableForHire ? 'bg-emerald-500/20 border border-emerald-400/30' : 'bg-red-500/20 border border-red-400/30'
                }`}>
                  <div className={`w-2.5 h-2.5 rounded-full animate-pulse ${availableForHire ? 'bg-emerald-400' : 'bg-red-400'}`} />
                  <span className="text-sm font-medium">{availableForHire ? 'Available for Hire' : 'Currently Busy'}</span>
                </div>
                <div className="text-sm text-white/60 flex items-center gap-1.5 bg-white/10 rounded-full px-4 py-2 backdrop-blur-sm">
                  <Calendar className="w-4 h-4" />
                  {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {quickActions.map((action, i) => (
            <button key={i} onClick={action.action}
              className="flex items-center gap-3 p-4 bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700/50 hover:border-blue-300 dark:hover:border-blue-500/30 hover:shadow-lg hover:shadow-blue-500/5 transition-all group">
              <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-500/10 group-hover:bg-blue-100 dark:group-hover:bg-blue-500/20 transition-colors">
                <action.icon className="w-5 h-5 text-blue-500" />
              </div>
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{action.label}</span>
            </button>
          ))}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {stats.map(s => (
            <div key={s.label} className={`relative bg-white dark:bg-slate-800/60 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-700/50 hover:shadow-xl ${s.bgGlow} transition-all group overflow-hidden`}>
              <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${s.gradient} opacity-5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:opacity-10 transition-opacity`} />
              <div className={`inline-flex p-2.5 rounded-xl bg-gradient-to-br ${s.gradient} shadow-lg mb-3`}>
                <s.icon className="w-5 h-5 text-white" />
              </div>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">{s.value.toLocaleString()}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Charts + Activity Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Views Chart */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-800/60 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-700/50">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-500" /> Page Views (Last 30 Days)
              </h3>
              <span className="text-sm text-slate-400">{(dashData?.viewsByDay || []).reduce((a, b) => a + b.count, 0)} total</span>
            </div>
            <div className="h-52 flex items-end gap-[3px]">
              {(dashData?.viewsByDay || []).slice(-30).map((d, i) => {
                const max = Math.max(...(dashData?.viewsByDay || []).map(x => x.count), 1);
                const height = (d.count / max) * 100;
                return (
                  <div key={i} className="flex-1 group/bar relative">
                    <div className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-sm hover:from-blue-600 hover:to-blue-500 transition-all cursor-pointer"
                      style={{ height: `${Math.max(height, 3)}%` }} />
                    <div className="absolute -top-9 left-1/2 -translate-x-1/2 hidden group-hover/bar:block bg-slate-900 text-white text-[10px] px-2 py-1 rounded-lg whitespace-nowrap z-10 shadow-lg">
                      {d.count} views
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          {/* Top Countries */}
          <div className="bg-white dark:bg-slate-800/60 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-700/50">
            <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Globe className="w-5 h-5 text-purple-500" /> Visitor Locations
            </h3>
            <div className="space-y-3">
              {(dashData?.topCountries || []).slice(0, 6).map((c, i) => {
                const max = Math.max(...(dashData?.topCountries || []).map(x => x.count), 1);
                return (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300 w-20 truncate">{c._id}</span>
                    <div className="flex-1 h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-purple-500 to-pink-400 rounded-full" style={{ width: `${(c.count / max) * 100}%` }} />
                    </div>
                    <span className="text-xs font-semibold text-slate-500 w-8 text-right">{c.count}</span>
                  </div>
                );
              })}
              {(!dashData?.topCountries || dashData.topCountries.length === 0) && (
                <div className="text-center py-6">
                  <Globe className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-600 mb-2" />
                  <p className="text-sm text-slate-400">No location data yet</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-slate-800/60 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-700/50">
            <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-emerald-500" /> Top Blog Posts
            </h3>
            <div className="space-y-2">
              {(dashData?.topBlogs || []).slice(0, 5).map((b, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors group">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold bg-gradient-to-br from-blue-500 to-purple-500 text-white w-7 h-7 rounded-lg flex items-center justify-center">{i + 1}</span>
                    <span className="font-medium text-sm text-slate-700 dark:text-slate-300 group-hover:text-blue-500 transition-colors">{b.title}</span>
                  </div>
                  <span className="text-xs text-slate-500 flex items-center gap-1"><Eye className="w-3 h-3" />{b.views}</span>
                </div>
              ))}
              {(!dashData?.topBlogs || dashData.topBlogs.length === 0) && (
                <div className="text-center py-6"><FileText className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-600 mb-2" /><p className="text-sm text-slate-400">No blog posts yet</p></div>
              )}
            </div>
          </div>
          <div className="bg-white dark:bg-slate-800/60 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-700/50">
            <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-amber-500" /> Recent Activity
            </h3>
            <div className="space-y-2 max-h-64 overflow-auto">
              {meetings.filter(m => m.status === 'pending').slice(0, 3).map((m, i) => (
                <div key={`m${i}`} className="flex items-center gap-3 p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-500/5 border border-indigo-100 dark:border-indigo-500/10">
                  <CalendarClock className="w-4 h-4 text-indigo-500" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate">Meeting: {m.name as string}</p>
                    <p className="text-xs text-slate-400">{m.date ? new Date(m.date as string).toLocaleDateString() : ''}</p>
                  </div>
                </div>
              ))}
              {quotes.filter(q => q.status === 'new').slice(0, 3).map((q, i) => (
                <div key={`q${i}`} className="flex items-center gap-3 p-2.5 rounded-xl bg-green-50 dark:bg-green-500/5 border border-green-100 dark:border-green-500/10">
                  <DollarSign className="w-4 h-4 text-green-500" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate">Quote: {q.name as string}</p>
                  </div>
                </div>
              ))}
              {contacts.filter(c => !c.read).slice(0, 3).map((c, i) => (
                <div key={`c${i}`} className="flex items-center gap-3 p-2.5 rounded-xl bg-amber-50 dark:bg-amber-500/5 border border-amber-100 dark:border-amber-500/10">
                  <Mail className="w-4 h-4 text-amber-500" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate">{c.name as string}: {(c.subject || c.message) as string}</p>
                  </div>
                </div>
              ))}
              {meetings.filter(m => m.status === 'pending').length === 0 && quotes.filter(q => q.status === 'new').length === 0 && contacts.filter(c => !c.read).length === 0 && (
                <div className="text-center py-6"><Activity className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-600 mb-2" /><p className="text-sm text-slate-400">No recent activity</p></div>
              )}
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl p-6 text-white">
            <Newspaper className="w-8 h-8 mb-3 opacity-80" />
            <p className="text-3xl font-bold">{newsletters.length}</p>
            <p className="text-white/70 text-sm">Newsletter Subscribers</p>
          </div>
          <div className="bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl p-6 text-white">
            <Award className="w-8 h-8 mb-3 opacity-80" />
            <p className="text-3xl font-bold">{testimonials.filter(t => t.published).length}</p>
            <p className="text-white/70 text-sm">Published Reviews</p>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-6 text-white">
            <Target className="w-8 h-8 mb-3 opacity-80" />
            <p className="text-3xl font-bold">{quotes.length + meetings.length}</p>
            <p className="text-white/70 text-sm">Total Leads</p>
          </div>
        </div>
      </div>
    );
  };

  // ===== BLOG EDITOR WITH BLOCKS =====
  const renderBlogEditor = () => {
    const saveBlog = async () => {
      const data = {
        ...editData,
        blocks: blogBlocks,
        content: blocksToHtml(blogBlocks),
      };
      await saveItem('/api/blogs', data, editMode === 'new', refreshTab);
      setBlogBlocks([]);
    };

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            {editMode === 'new' ? 'Create New Blog Post' : 'Edit Blog Post'}
          </h3>
          <button onClick={() => { setEditMode(null); setEditData({}); setBlogBlocks([]); }}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500"><X className="w-5 h-5" /></button>
        </div>

        {/* Post Metadata */}
        <div className="bg-white dark:bg-slate-800/60 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-700/50 space-y-4">
          <h4 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Post Details</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Title *</label>
              <input type="text" value={(editData.title as string) || ''} onChange={e => setEditData(d => ({ ...d, title: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/30 outline-none text-lg font-medium"
                placeholder="Your awesome blog post title..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Slug</label>
              <input type="text" value={(editData.slug as string) || ''} onChange={e => setEditData(d => ({ ...d, slug: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/30 outline-none"
                placeholder="auto-generated-from-title" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Excerpt *</label>
            <textarea value={(editData.excerpt as string) || ''} onChange={e => setEditData(d => ({ ...d, excerpt: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/30 outline-none resize-none h-20"
              placeholder="A compelling summary that makes readers want to read more..." />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Category</label>
              <input type="text" value={(editData.category as string) || ''} onChange={e => setEditData(d => ({ ...d, category: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/30 outline-none"
                placeholder="e.g. Web Development" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Tags (comma-separated)</label>
              <input type="text" value={Array.isArray(editData.tags) ? (editData.tags as string[]).join(', ') : (editData.tags as string) || ''}
                onChange={e => setEditData(d => ({ ...d, tags: e.target.value.split(',').map(t => t.trim()) }))}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/30 outline-none"
                placeholder="react, nextjs, tutorial" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Cover Image URL</label>
              <input type="text" value={(editData.coverImage as string) || ''} onChange={e => setEditData(d => ({ ...d, coverImage: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/30 outline-none"
                placeholder="https://example.com/image.jpg" />
            </div>
          </div>
          {Boolean(editData.coverImage) && (
            <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 max-h-48">
              <img src={editData.coverImage as string} alt="Cover preview" className="w-full h-48 object-cover" />
            </div>
          )}
        </div>

        {/* Block Editor */}
        <div className="bg-white dark:bg-slate-800/60 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-700/50">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Palette className="w-4 h-4" /> Content Blocks
            </h4>
            <span className="text-xs text-slate-400">{blogBlocks.length} block{blogBlocks.length !== 1 ? 's' : ''}</span>
          </div>
          <BlockEditor blocks={blogBlocks} onChange={setBlogBlocks} />
        </div>

        {/* SEO & Social */}
        <div className="bg-white dark:bg-slate-800/60 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-700/50 space-y-4">
          <h4 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">SEO & Social Preview</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Meta Title</label>
              <input type="text" value={(editData.metaTitle as string) || ''} onChange={e => setEditData(d => ({ ...d, metaTitle: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/30 outline-none"
                placeholder="SEO-optimized page title" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Meta Description</label>
              <input type="text" value={(editData.metaDescription as string) || ''} onChange={e => setEditData(d => ({ ...d, metaDescription: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/30 outline-none"
                placeholder="Brief description for search engines" />
            </div>
          </div>
          {(Boolean(editData.title) || Boolean(editData.coverImage)) && (
            <div className="mt-2">
              <p className="text-xs font-medium text-slate-500 mb-2">Social Media Preview (WhatsApp, Messenger, etc.):</p>
              <div className="max-w-md border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden bg-white dark:bg-slate-900">
                {Boolean(editData.coverImage) && <img src={editData.coverImage as string} alt="" className="w-full h-32 object-cover" />}
                <div className="p-3">
                  <p className="text-xs text-slate-400 truncate">irfan-portfolio-dun.vercel.app</p>
                  <p className="font-semibold text-sm text-slate-900 dark:text-white truncate">{(editData.metaTitle as string) || (editData.title as string) || 'Untitled Post'}</p>
                  <p className="text-xs text-slate-500 truncate">{(editData.metaDescription as string) || (editData.excerpt as string) || ''}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Publish */}
        <div className="bg-white dark:bg-slate-800/60 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-700/50">
          <div className="flex items-center gap-6 mb-4">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input type="checkbox" checked={!!editData.published} onChange={e => setEditData(d => ({ ...d, published: e.target.checked }))}
                className="w-4 h-4 rounded border-slate-300 text-blue-500 focus:ring-blue-500" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Published</span>
            </label>
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input type="checkbox" checked={!!editData.featured} onChange={e => setEditData(d => ({ ...d, featured: e.target.checked }))}
                className="w-4 h-4 rounded border-slate-300 text-blue-500 focus:ring-blue-500" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Featured</span>
            </label>
          </div>
          <div className="flex gap-3">
            <button onClick={saveBlog}
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg shadow-blue-500/25 flex items-center gap-2">
              <Check className="w-4 h-4" /> {editMode === 'new' ? 'Publish Post' : 'Update Post'}
            </button>
            <button onClick={() => { setEditMode(null); setEditData({}); setBlogBlocks([]); }}
              className="px-6 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">Cancel</button>
          </div>
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
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Blog Posts ({blogs.length})</h2>
          <button onClick={() => { setEditMode('new'); setEditData({ published: false, featured: false }); setBlogBlocks([]); }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg shadow-blue-500/25">
            <Plus className="w-4 h-4" /> New Post
          </button>
        </div>
        <div className="bg-white dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-700/50 overflow-hidden">
          {blogs.length === 0 ? (
            <div className="p-16 text-center">
              <FileText className="w-16 h-16 mx-auto text-slate-200 dark:text-slate-700 mb-4" />
              <p className="text-lg font-semibold text-slate-400">No blog posts yet</p>
              <p className="text-sm text-slate-400 mt-1">Create your first post with the block editor!</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-700/50">
              {blogs.map((blog) => (
                <div key={blog._id as string} className="p-5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700/20 transition-colors group">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    {blog.coverImage && (
                      <img src={blog.coverImage as string} alt="" className="w-16 h-16 rounded-xl object-cover flex-shrink-0 border border-slate-200 dark:border-slate-700" />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className="font-bold text-slate-900 dark:text-white truncate">{blog.title as string}</h3>
                        {blog.featured && <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 font-bold uppercase">Featured</span>}
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${blog.published ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400' : 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400'}`}>
                          {blog.published ? 'Live' : 'Draft'}
                        </span>
                      </div>
                      <p className="text-sm text-slate-500 dark:text-slate-400 truncate">{blog.excerpt as string}</p>
                      <div className="flex items-center gap-4 mt-1.5 text-xs text-slate-400">
                        <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{(blog.views as number) || 0}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{new Date(blog.createdAt as string).toLocaleDateString()}</span>
                        {blog.category && <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded-full">{blog.category as string}</span>}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => { setEditMode('edit'); setEditData(blog); setBlogBlocks((blog.blocks as Block[]) || []); }}
                      className="p-2.5 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-500/10 text-slate-400 hover:text-blue-500 transition-all"><Edit className="w-4 h-4" /></button>
                    <a href={`/blog/${blog.slug}`} target="_blank" rel="noopener noreferrer"
                      className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 transition-all"><ExternalLink className="w-4 h-4" /></a>
                    <button onClick={() => deleteItem('/api/blogs', blog.slug as string, refreshTab)}
                      className="p-2.5 rounded-xl hover:bg-red-50 dark:hover:bg-red-500/10 text-slate-400 hover:text-red-500 transition-all"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  // ===== GENERIC FORM EDITOR =====
  const renderGenericList = (
    title: string, items: any[], endpoint: string,
    fields: { key: string; label: string; type?: string }[], nameKey: string = 'title'
  ) => {
    if (editMode) {
      return (
        <div className="bg-white dark:bg-slate-800/60 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-700/50 space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {editMode === 'new' ? `Add ${title.replace(/s$/, '')}` : `Edit ${title.replace(/s$/, '')}`}
            </h3>
            <button onClick={() => { setEditMode(null); setEditData({}); }} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500"><X className="w-5 h-5" /></button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {fields.map(f => (
              <div key={f.key} className={f.type === 'textarea' ? 'md:col-span-2' : ''}>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">{f.label}</label>
                {f.type === 'textarea' ? (
                  <textarea value={(editData[f.key] as string) || ''} onChange={e => setEditData(d => ({ ...d, [f.key]: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/30 outline-none resize-none h-24" />
                ) : f.type === 'checkbox' ? (
                  <label className="flex items-center gap-2 mt-2 cursor-pointer">
                    <input type="checkbox" checked={!!editData[f.key]} onChange={e => setEditData(d => ({ ...d, [f.key]: e.target.checked }))}
                      className="w-4 h-4 rounded border-slate-300 text-blue-500 focus:ring-blue-500" />
                    <span className="text-sm text-slate-600 dark:text-slate-400">Enable</span>
                  </label>
                ) : f.type === 'array' ? (
                  <input type="text" value={Array.isArray(editData[f.key]) ? (editData[f.key] as string[]).join(', ') : (editData[f.key] as string) || ''}
                    onChange={e => setEditData(d => ({ ...d, [f.key]: e.target.value.split(',').map(t => t.trim()) }))}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/30 outline-none" placeholder="Comma-separated" />
                ) : (
                  <input type={f.type || 'text'} value={(editData[f.key] as string) || ''}
                    onChange={e => setEditData(d => ({ ...d, [f.key]: f.type === 'number' ? Number(e.target.value) : e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/30 outline-none" />
                )}
              </div>
            ))}
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={() => saveItem(endpoint, editData, editMode === 'new', refreshTab)}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg shadow-blue-500/25 flex items-center gap-2">
              <Check className="w-4 h-4" /> {editMode === 'new' ? 'Create' : 'Update'}
            </button>
            <button onClick={() => { setEditMode(null); setEditData({}); }}
              className="px-6 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">Cancel</button>
          </div>
        </div>
      );
    }
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">{title} ({items.length})</h2>
          <button onClick={() => { setEditMode('new'); setEditData({}); }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg shadow-blue-500/25">
            <Plus className="w-4 h-4" /> Add New
          </button>
        </div>
        <div className="bg-white dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-700/50 overflow-hidden">
          {items.length === 0 ? (
            <div className="p-16 text-center"><p className="text-slate-400">No {title.toLowerCase()} yet.</p></div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-700/50">
              {items.map((item) => (
                <div key={(item._id || item.slug) as string} className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700/20 transition-colors group">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-slate-900 dark:text-white truncate">{item[nameKey] as string}</h3>
                    {item.description && <p className="text-sm text-slate-500 dark:text-slate-400 truncate mt-0.5">{String(item.description)}</p>}
                    {item.answer && <p className="text-sm text-slate-500 dark:text-slate-400 truncate mt-0.5">{String(item.answer)}</p>}
                  </div>
                  <div className="flex items-center gap-1 ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => { setEditMode('edit'); setEditData(item); }}
                      className="p-2.5 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-500/10 text-slate-400 hover:text-blue-500 transition-all"><Edit className="w-4 h-4" /></button>
                    <button onClick={() => deleteItem(endpoint, (item.slug || item._id) as string, refreshTab)}
                      className="p-2.5 rounded-xl hover:bg-red-50 dark:hover:bg-red-500/10 text-slate-400 hover:text-red-500 transition-all"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderProjects = () => renderGenericList('Projects', projects, '/api/projects', [
    { key: 'title', label: 'Title' }, { key: 'slug', label: 'Slug' },
    { key: 'description', label: 'Short Description', type: 'textarea' }, { key: 'longDescription', label: 'Long Description', type: 'textarea' },
    { key: 'category', label: 'Category' }, { key: 'stack', label: 'Tech Stack', type: 'array' },
    { key: 'image', label: 'Image URL' }, { key: 'liveUrl', label: 'Live URL' },
    { key: 'githubUrl', label: 'GitHub URL' }, { key: 'order', label: 'Order', type: 'number' },
    { key: 'featured', label: 'Featured', type: 'checkbox' }, { key: 'published', label: 'Published', type: 'checkbox' },
  ]);

  const renderServices = () => renderGenericList('Services', services, '/api/services', [
    { key: 'title', label: 'Title' }, { key: 'slug', label: 'Slug' },
    { key: 'description', label: 'Short Description', type: 'textarea' }, { key: 'longDescription', label: 'Long Description', type: 'textarea' },
    { key: 'icon', label: 'Icon Name' }, { key: 'gradient', label: 'Gradient' },
    { key: 'features', label: 'Features', type: 'array' }, { key: 'price', label: 'Price' },
    { key: 'order', label: 'Order', type: 'number' }, { key: 'featured', label: 'Featured', type: 'checkbox' },
    { key: 'published', label: 'Published', type: 'checkbox' },
  ]);

  const renderFAQs = () => renderGenericList('FAQs', faqs, '/api/faqs', [
    { key: 'question', label: 'Question' }, { key: 'answer', label: 'Answer', type: 'textarea' },
    { key: 'category', label: 'Category' }, { key: 'order', label: 'Order', type: 'number' },
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
            <button onClick={() => { setEditMode(null); setEditData({}); }} className="text-sm text-slate-500 hover:text-slate-700">Cancel</button>
          </div>
          <div className="bg-white dark:bg-slate-800/60 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-700/50 space-y-4">
            {[{ key: 'title', label: 'Title' }, { key: 'imageUrl', label: 'Image URL' }, { key: 'description', label: 'Description', textarea: true }, { key: 'category', label: 'Category' }].map(f => (
              <div key={f.key}>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{f.label}</label>
                {f.textarea ? (
                  <textarea value={String(editData[f.key] || '')} onChange={e => setEditData(d => ({ ...d, [f.key]: e.target.value }))} rows={3}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/30 resize-none" />
                ) : (
                  <input value={String(editData[f.key] || '')} onChange={e => setEditData(d => ({ ...d, [f.key]: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/30" />
                )}
              </div>
            ))}
            {Boolean(editData.imageUrl) && <img src={String(editData.imageUrl)} alt="" className="w-32 h-32 rounded-xl object-cover" />}
            <div className="flex items-center gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Order</label>
                <input type="number" value={String(editData.order || 0)} onChange={e => setEditData(d => ({ ...d, order: Number(e.target.value) }))}
                  className="w-24 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none" />
              </div>
              <label className="flex items-center gap-2 mt-6 cursor-pointer">
                <input type="checkbox" checked={editData.published !== false} onChange={e => setEditData(d => ({ ...d, published: e.target.checked }))} className="rounded" />
                <span className="text-sm text-slate-700 dark:text-slate-300">Published</span>
              </label>
            </div>
            <button onClick={async () => {
              const isNew = editMode === 'gallery-new';
              await fetch(isNew ? '/api/gallery' : `/api/gallery/${editData._id}`, { method: isNew ? 'POST' : 'PUT', headers: authHeaders(), body: JSON.stringify(editData) });
              setEditMode(null); setEditData({}); refreshTab();
            }} className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold shadow-lg flex items-center gap-2">
              <Check className="w-4 h-4" /> {editMode === 'gallery-new' ? 'Add' : 'Save'}
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
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold shadow-lg"><Plus className="w-4 h-4" /> Add Image</button>
        </div>
        {gallery.length === 0 ? (
          <div className="bg-white dark:bg-slate-800/60 rounded-2xl p-16 border text-center"><ImageIcon className="w-16 h-16 mx-auto text-slate-200 dark:text-slate-700 mb-4" /><p className="text-slate-400">No gallery images yet</p></div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {gallery.map((item) => (
              <div key={item._id as string} className="group relative bg-white dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-700/50 overflow-hidden">
                <div className="aspect-square relative">
                  <img src={String(item.imageUrl)} alt={String(item.title)} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                    <button onClick={() => { setEditMode('gallery-edit'); setEditData({ ...item }); }} className="p-2 rounded-lg bg-white/90 text-slate-700 hover:bg-white"><Edit className="w-4 h-4" /></button>
                    <button onClick={() => deleteItem('/api/gallery', item._id as string, refreshTab)} className="p-2 rounded-lg bg-white/90 text-red-500 hover:bg-white"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
                <div className="p-3"><p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{String(item.title)}</p></div>
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
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Messages ({contacts.length})</h2>
        <span className="text-sm px-3 py-1 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-full font-semibold">{contacts.filter(c => !c.read).length} unread</span>
      </div>
      <div className="bg-white dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-700/50 overflow-hidden">
        {contacts.length === 0 ? (
          <div className="p-16 text-center"><Mail className="w-16 h-16 mx-auto text-slate-200 dark:text-slate-700 mb-4" /><p className="text-slate-400">No messages yet</p></div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-700/50">
            {contacts.map((c) => (
              <div key={c._id as string} className={`p-5 hover:bg-slate-50 dark:hover:bg-slate-700/20 transition-colors ${!c.read ? 'bg-blue-50/30 dark:bg-blue-500/5' : ''}`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-slate-900 dark:text-white">{c.name as string}</h3>
                      {!c.read && <span className="w-2 h-2 rounded-full bg-blue-500" />}
                    </div>
                    <p className="text-sm text-blue-500">{c.email as string}</p>
                    {c.subject && <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mt-1">{String(c.subject)}</p>}
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{c.message as string}</p>
                    <p className="text-xs text-slate-400 mt-2">{new Date(c.createdAt as string).toLocaleString()}</p>
                  </div>
                  <div className="flex items-center gap-1 ml-4">
                    {!c.read && (
                      <button onClick={async () => { await fetch(`/api/contact/${c._id}`, { method: 'PUT', headers: authHeaders(), body: JSON.stringify({ read: true }) }); refreshTab(); }}
                        className="p-2 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-500/10 text-slate-400 hover:text-emerald-500" title="Mark read"><Check className="w-4 h-4" /></button>
                    )}
                    <button onClick={() => deleteItem('/api/contact', c._id as string, refreshTab)}
                      className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 text-slate-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  // ===== TESTIMONIALS TAB =====
  const renderTestimonials = () => renderGenericList('Testimonials', testimonials, '/api/testimonials', [
    { key: 'name', label: 'Client Name' }, { key: 'role', label: 'Role/Title' },
    { key: 'company', label: 'Company' }, { key: 'avatar', label: 'Avatar URL' },
    { key: 'content', label: 'Testimonial', type: 'textarea' },
    { key: 'rating', label: 'Rating (1-5)', type: 'number' },
    { key: 'projectUrl', label: 'Project URL' },
    { key: 'featured', label: 'Featured', type: 'checkbox' },
    { key: 'published', label: 'Published', type: 'checkbox' },
    { key: 'order', label: 'Order', type: 'number' },
  ], 'name');

  // ===== MEETINGS TAB =====
  const renderMeetings = () => (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-slate-900 dark:text-white">Meeting Requests ({meetings.length})</h2>
      <div className="bg-white dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-700/50 overflow-hidden">
        {meetings.length === 0 ? (
          <div className="p-16 text-center"><CalendarClock className="w-16 h-16 mx-auto text-slate-200 dark:text-slate-700 mb-4" /><p className="text-slate-400">No meeting requests yet</p></div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-700/50">
            {meetings.map((m) => (
              <div key={m._id as string} className="p-5 hover:bg-slate-50 dark:hover:bg-slate-700/20 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 className="font-bold text-slate-900 dark:text-white">{m.name as string}</h3>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                        m.status === 'confirmed' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400' :
                        m.status === 'completed' ? 'bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400' :
                        m.status === 'cancelled' ? 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400' :
                        'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400'
                      }`}>{m.status as string}</span>
                    </div>
                    <p className="text-sm text-blue-500">{m.email as string}</p>
                    <div className="flex items-center gap-3 mt-1 text-sm text-slate-500">
                      {m.date && <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{new Date(m.date as string).toLocaleDateString()}</span>}
                      {m.time && <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{m.time as string}</span>}
                      {m.projectType && <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-xs">{m.projectType as string}</span>}
                    </div>
                    {m.message && <p className="text-sm text-slate-400 mt-1">{m.message as string}</p>}
                  </div>
                  <div className="flex items-center gap-1 ml-4">
                    {m.status === 'pending' && (
                      <button onClick={async () => { await fetch(`/api/meetings/${m._id}`, { method: 'PUT', headers: authHeaders(), body: JSON.stringify({ status: 'confirmed' }) }); refreshTab(); }}
                        className="p-2 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-500/10 text-slate-400 hover:text-emerald-500" title="Confirm"><Check className="w-4 h-4" /></button>
                    )}
                    <button onClick={() => deleteItem('/api/meetings', m._id as string, refreshTab)}
                      className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 text-slate-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  // ===== QUOTES TAB =====
  const renderQuotes = () => (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-slate-900 dark:text-white">Quote Requests ({quotes.length})</h2>
      <div className="bg-white dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-700/50 overflow-hidden">
        {quotes.length === 0 ? (
          <div className="p-16 text-center"><DollarSign className="w-16 h-16 mx-auto text-slate-200 dark:text-slate-700 mb-4" /><p className="text-slate-400">No quote requests yet</p></div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-700/50">
            {quotes.map((q) => (
              <div key={q._id as string} className="p-5 hover:bg-slate-50 dark:hover:bg-slate-700/20 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 className="font-bold text-slate-900 dark:text-white">{q.name as string}</h3>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                        q.status === 'quoted' ? 'bg-blue-100 text-blue-700' :
                        q.status === 'accepted' ? 'bg-emerald-100 text-emerald-700' :
                        q.status === 'declined' ? 'bg-red-100 text-red-700' :
                        q.status === 'reviewed' ? 'bg-purple-100 text-purple-700' :
                        'bg-amber-100 text-amber-700'
                      }`}>{q.status as string}</span>
                    </div>
                    <p className="text-sm text-blue-500">{q.email as string}</p>
                    <div className="flex items-center gap-3 mt-1 text-sm text-slate-500 flex-wrap">
                      {q.projectType && <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-xs">{q.projectType as string}</span>}
                      {q.budget && <span className="text-xs font-medium text-emerald-600">{q.budget as string}</span>}
                      {q.timeline && <span className="text-xs">{q.timeline as string}</span>}
                    </div>
                    {q.description && <p className="text-sm text-slate-400 mt-1">{q.description as string}</p>}
                    {q.features && (q.features as string[]).length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {(q.features as string[]).map((f, i) => (
                          <span key={i} className="text-[10px] px-2 py-0.5 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-full">{f}</span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-1 ml-4">
                    {q.status === 'new' && (
                      <button onClick={async () => { await fetch(`/api/quote-requests/${q._id}`, { method: 'PUT', headers: authHeaders(), body: JSON.stringify({ status: 'reviewed' }) }); refreshTab(); }}
                        className="p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-500/10 text-slate-400 hover:text-blue-500" title="Mark Reviewed"><Check className="w-4 h-4" /></button>
                    )}
                    <button onClick={() => deleteItem('/api/quote-requests', q._id as string, refreshTab)}
                      className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 text-slate-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  // ===== NEWSLETTER TAB =====
  const renderNewsletter = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Newsletter Subscribers ({newsletters.length})</h2>
        <button onClick={() => {
          const csv = 'Name,Email,Date\n' + newsletters.map(n => `${n.name || ''},${n.email},${new Date((n.subscribedAt || n.createdAt) as string).toLocaleDateString()}`).join('\n');
          const blob = new Blob([csv], { type: 'text/csv' });
          const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'subscribers.csv'; a.click();
        }} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 text-white text-sm font-semibold hover:bg-emerald-600 transition-all">
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>
      <div className="bg-white dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-700/50 overflow-hidden">
        {newsletters.length === 0 ? (
          <div className="p-16 text-center"><Newspaper className="w-16 h-16 mx-auto text-slate-200 dark:text-slate-700 mb-4" /><p className="text-slate-400">No subscribers yet</p></div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-700/50">
            {newsletters.map((n) => (
              <div key={n._id as string} className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700/20 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center"><Mail className="w-5 h-5 text-blue-500" /></div>
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white text-sm">{n.email as string}</p>
                    {n.name && <p className="text-xs text-slate-400">{n.name as string}</p>}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${n.active !== false ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                    {n.active !== false ? 'Active' : 'Inactive'}
                  </span>
                  <span className="text-xs text-slate-400">{new Date((n.subscribedAt || n.createdAt) as string).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  // ===== ANALYTICS TAB =====
  const renderAnalytics = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-slate-900 dark:text-white">Analytics Overview</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Total Page Views', value: dashData?.totalViews || 0, icon: Eye, color: 'text-blue-500' },
          { label: 'Unique Visitors', value: dashData?.uniqueVisitors || 0, icon: Users, color: 'text-purple-500' },
          { label: 'Countries', value: dashData?.topCountries?.length || 0, icon: Globe, color: 'text-emerald-500' },
        ].map(s => (
          <div key={s.label} className="bg-white dark:bg-slate-800/60 rounded-2xl p-6 border text-center">
            <s.icon className={`w-8 h-8 mx-auto mb-2 ${s.color}`} />
            <p className="text-3xl font-bold text-slate-900 dark:text-white">{s.value.toLocaleString()}</p>
            <p className="text-sm text-slate-500">{s.label}</p>
          </div>
        ))}
      </div>
      <div className="bg-white dark:bg-slate-800/60 rounded-2xl p-6 border">
        <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Top Pages</h3>
        <div className="space-y-3">
          {(dashData?.viewsByPage || []).map((p, i) => {
            const max = Math.max(...(dashData?.viewsByPage || []).map(x => x.count), 1);
            return (
              <div key={i} className="flex items-center gap-3">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300 w-40 truncate">{p._id}</span>
                <div className="flex-1 h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full" style={{ width: `${(p.count / max) * 100}%` }} />
                </div>
                <span className="text-xs text-slate-500 w-12 text-right">{p.count}</span>
              </div>
            );
          })}
        </div>
      </div>
      <div className="bg-white dark:bg-slate-800/60 rounded-2xl p-6 border">
        <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Recent Visits</h3>
        <div className="space-y-2 max-h-64 overflow-auto">
          {(dashData?.recentViews as any[] || []).slice(0, 15).map((v: any, i: number) => (
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

  // ===== SETTINGS TAB =====
  const renderSettings = () => {
    const saveSettings = async (updates: any) => {
      const merged = { ...siteSettings, ...updates };
      await fetch('/api/site-settings', { method: 'PUT', headers: authHeaders(), body: JSON.stringify(merged) });
      setSiteSettings(merged);
    };

    return (
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Site Settings</h2>
        <SettingsPanel settings={siteSettings} onSave={saveSettings} />
      </div>
    );
  };

  // ===== MAIN LAYOUT =====
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B1120] flex">
      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-72 bg-white dark:bg-slate-900/95 border-r border-slate-200 dark:border-slate-800 transform transition-transform lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} flex flex-col`}>
        <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-blue-500/30">
              <LayoutDashboard className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="font-bold text-slate-900 dark:text-white text-sm">Admin Panel</p>
              <p className="text-xs text-slate-500">Irfan Portfolio</p>
            </div>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"><X className="w-5 h-5 text-slate-500" /></button>
        </div>
        <nav className="flex-1 overflow-y-auto p-3 space-y-6">
          {tabGroups.map(group => (
            <div key={group.label}>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-600 px-4 mb-2">{group.label}</p>
              <div className="space-y-0.5">
                {group.items.map(tab => {
                  const count = tab.key === 'contacts' ? contacts.filter(c => !c.read).length :
                    tab.key === 'meetings' ? meetings.filter(m => m.status === 'pending').length :
                    tab.key === 'quotes' ? quotes.filter(q => q.status === 'new').length : 0;
                  return (
                    <button key={tab.key} onClick={() => { setActiveTab(tab.key); setEditMode(null); setEditData({}); setSidebarOpen(false); }}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                        activeTab === tab.key
                          ? 'bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-blue-600 dark:text-blue-400 shadow-sm border border-blue-200/50 dark:border-blue-500/20'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white'
                      }`}>
                      <tab.icon className="w-[18px] h-[18px]" />
                      <span className="flex-1 text-left">{tab.label}</span>
                      {count > 0 && <span className="bg-red-500 text-white text-[9px] font-bold min-w-[18px] h-[18px] rounded-full flex items-center justify-center px-1">{count}</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
        <div className="p-3 border-t border-slate-200 dark:border-slate-800">
          <button onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors">
            <LogOut className="w-[18px] h-[18px]" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        <header className="sticky top-0 z-40 bg-white/80 dark:bg-[#0B1120]/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"><Menu className="w-5 h-5 text-slate-600 dark:text-slate-400" /></button>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white capitalize">{activeTab === 'quotes' ? 'Quote Requests' : activeTab}</h2>
          </div>
          <a href="/" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-slate-500 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-all">
            <ExternalLink className="w-4 h-4" /> View Site
          </a>
        </header>
        <main className="flex-1 p-6 overflow-auto">{renderContent()}</main>
      </div>

      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}
    </div>
  );
}

// ===== SETTINGS PANEL (Separate component to use its own state) =====
function SettingsPanel({ settings, onSave }: { settings: any; onSave: (updates: any) => Promise<void> }) {
  const [local, setLocal] = useState<any>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => { setLocal({ ...settings }); }, [settings]);

  const handleSave = async () => {
    setSaving(true);
    await onSave(local);
    setSaving(false);
  };

  return (
    <div className="space-y-6">
      {/* Availability */}
      <div className="bg-white dark:bg-slate-800/60 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-700/50">
        <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-500" /> Availability
        </h3>
        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" checked={local.availableForHire !== false}
            onChange={e => setLocal((s: any) => ({ ...s, availableForHire: e.target.checked }))}
            className="w-5 h-5 rounded border-slate-300 text-emerald-500 focus:ring-emerald-500" />
          <span className="text-slate-700 dark:text-slate-300 font-medium">Available for Hire</span>
        </label>
        <p className="text-sm text-slate-400 mt-2">Shows a green badge on your portfolio when enabled.</p>
      </div>

      {/* Stats Counters */}
      <div className="bg-white dark:bg-slate-800/60 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-700/50 space-y-4">
        <h3 className="font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
          <Zap className="w-5 h-5 text-amber-500" /> Public Stats
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { key: 'completedProjects', label: 'Projects Done', ph: '50+' },
            { key: 'happyClients', label: 'Happy Clients', ph: '30+' },
            { key: 'yearsExperience', label: 'Years Exp.', ph: '6' },
            { key: 'coffeeConsumed', label: 'Coffee Cups', ph: '500+' },
          ].map(f => (
            <div key={f.key}>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{f.label}</label>
              <input type="text" value={String(local[f.key] || '')}
                onChange={e => setLocal((s: any) => ({ ...s, [f.key]: e.target.value }))}
                placeholder={f.ph}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-blue-500/30" />
            </div>
          ))}
        </div>
      </div>

      {/* Social & Contact */}
      <div className="bg-white dark:bg-slate-800/60 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-700/50 space-y-4">
        <h3 className="font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
          <Globe className="w-5 h-5 text-blue-500" /> Social & Contact Links
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { key: 'whatsappNumber', label: 'WhatsApp Number', ph: '+880...' },
            { key: 'calendlyUrl', label: 'Calendly URL', ph: 'https://calendly.com/...' },
            { key: 'fiverrUrl', label: 'Fiverr Profile', ph: 'https://fiverr.com/...' },
            { key: 'upworkUrl', label: 'Upwork Profile', ph: 'https://upwork.com/...' },
          ].map(f => (
            <div key={f.key}>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{f.label}</label>
              <input type="text" value={String(local[f.key] || '')}
                onChange={e => setLocal((s: any) => ({ ...s, [f.key]: e.target.value }))}
                placeholder={f.ph}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-blue-500/30" />
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="bg-white dark:bg-slate-800/60 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-700/50 space-y-4">
        <h3 className="font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
          <Target className="w-5 h-5 text-pink-500" /> Call to Action
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">CTA Heading</label>
            <input type="text" value={String(local.ctaText || '')}
              onChange={e => setLocal((s: any) => ({ ...s, ctaText: e.target.value }))}
              placeholder="Let's Build Something Amazing"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-blue-500/30" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">CTA Button Label</label>
            <input type="text" value={String(local.ctaButton || '')}
              onChange={e => setLocal((s: any) => ({ ...s, ctaButton: e.target.value }))}
              placeholder="Get Free Quote"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-blue-500/30" />
          </div>
        </div>
      </div>

      <button onClick={handleSave} disabled={saving}
        className="px-8 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg shadow-blue-500/25 disabled:opacity-50 flex items-center gap-2">
        {saving ? <RotateCcw className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
        {saving ? 'Saving...' : 'Save Settings'}
      </button>
    </div>
  );
}
