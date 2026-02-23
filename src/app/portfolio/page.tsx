'use client';

import { useState, useEffect } from 'react';
import { ExternalLink, Github, Search, FolderOpen, Star, ArrowUpRight, Layers, Code2 } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import profile from '@/data/profile';

interface Project {
  _id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  stack: string[];
  image: string;
  liveUrl: string;
  githubUrl: string;
  featured: boolean;
}

export default function PortfolioPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch('/api/projects');
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setProjects(data);
        } else {
          setProjects(profile.projects.map(p => ({
            _id: p.id,
            title: p.title,
            slug: p.id,
            description: p.description,
            category: p.category,
            stack: p.stack,
            image: p.image || '',
            liveUrl: p.links.live || '',
            githubUrl: p.links.github || '',
            featured: p.featured,
          })));
        }
      } catch {
        setProjects(profile.projects.map(p => ({
          _id: p.id,
          title: p.title,
          slug: p.id,
          description: p.description,
          category: p.category,
          stack: p.stack,
          image: p.image || '',
          liveUrl: p.links.live || '',
          githubUrl: p.links.github || '',
          featured: p.featured,
        })));
      }
      setLoading(false);
    };
    fetchProjects();
    fetch('/api/analytics', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ page: '/portfolio', sessionId: localStorage.getItem('session_id') || '' }) });
  }, []);

  const categories = ['All', ...Array.from(new Set(projects.map(p => p.category).filter(Boolean)))];
  const filtered = projects.filter(p => {
    const matchCat = activeCategory === 'All' || p.category === activeCategory;
    const matchSearch = !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <>
      <Navbar onCommandPalette={() => {}} />
      <main className="min-h-screen pt-20">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-blue-50/40 to-teal-50/30 dark:from-[#0A0F1E] dark:via-[#0F1A35] dark:to-[#0A1628]" />
            <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full opacity-[0.06] dark:opacity-[0.10]"
              style={{ background: 'linear-gradient(135deg, #7C3AED, var(--active-accent))' }} />
          </div>
          <div className="section-container text-center pb-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--active-accent)]/10 text-[var(--active-accent)] text-sm font-medium mb-4">
              <FolderOpen className="w-4 h-4" />
              My Work
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4">
              <span className="text-slate-900 dark:text-white">My </span>
              <span className="bg-gradient-to-r from-[var(--active-accent)] to-purple-500 bg-clip-text text-transparent">Portfolio</span>
            </h1>
            <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto mb-8">
              A collection of projects I&apos;ve built — from MVPs to production-grade applications.
            </p>

            {/* Search */}
            <div className="relative max-w-xl mx-auto">
              <div className="glass-card p-2 flex items-center gap-2 shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50">
                <Search className="w-5 h-5 text-slate-400 ml-3" />
                <input
                  type="text" value={search} onChange={e => setSearch(e.target.value)}
                  placeholder="Search projects..."
                  className="flex-1 bg-transparent py-2.5 px-2 text-sm text-slate-900 dark:text-white placeholder-slate-400 outline-none"
                />
              </div>
            </div>

            {/* Category Filter */}
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

        {/* Project Count */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-4">
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <Layers className="w-4 h-4" />
            <span>{filtered.length} project{filtered.length !== 1 ? 's' : ''}</span>
          </div>
        </div>

        {/* Projects Grid */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="glass-card rounded-2xl overflow-hidden animate-pulse">
                  <div className="h-52 bg-slate-200 dark:bg-slate-700" />
                  <div className="p-5">
                    <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-2" />
                    <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-[var(--active-accent)]/10 flex items-center justify-center">
                <FolderOpen className="w-10 h-10 text-[var(--active-accent)]/50" />
              </div>
              <p className="text-lg font-semibold text-slate-500">{search ? 'No projects match your search' : 'No projects yet.'}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map(project => (
                <div key={project._id} className="group glass-card-hover overflow-hidden rounded-2xl flex flex-col">
                  {/* Image */}
                  <div className="relative h-52 overflow-hidden">
                    {project.image ? (
                      <img src={project.image} alt={project.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[var(--active-accent)]/5 to-purple-500/10 flex items-center justify-center">
                        <Code2 className="w-12 h-12 text-[var(--active-accent)]/30" />
                      </div>
                    )}
                    {/* Overlay with actions */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-end p-5">
                      <div className="flex gap-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                        {project.liveUrl && (
                          <a href={project.liveUrl} target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white text-slate-900 text-xs font-semibold hover:bg-[var(--active-accent)] hover:text-white transition-colors">
                            <ExternalLink className="w-3.5 h-3.5" /> Live Demo
                          </a>
                        )}
                        {project.githubUrl && (
                          <a href={project.githubUrl} target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white/20 backdrop-blur-sm text-white text-xs font-semibold hover:bg-white/30 transition-colors">
                            <Github className="w-3.5 h-3.5" /> Code
                          </a>
                        )}
                      </div>
                    </div>
                    {/* Featured badge */}
                    {project.featured && (
                      <span className="absolute top-3 right-3 flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-full bg-amber-400 text-amber-900 shadow-lg">
                        <Star className="w-3 h-3 fill-amber-900" /> Featured
                      </span>
                    )}
                    {/* Category */}
                    <span className="absolute top-3 left-3 text-xs font-semibold px-3 py-1 rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm text-[var(--active-accent)]">{project.category}</span>
                  </div>

                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-[var(--active-accent)] transition-colors">{project.title}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5 line-clamp-2 flex-1">{project.description}</p>

                    {/* Tech Stack */}
                    <div className="flex flex-wrap gap-1.5 mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/50">
                      {project.stack.slice(0, 4).map(tech => (
                        <span key={tech} className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-[var(--active-accent)]/5 text-[var(--active-accent)] border border-[var(--active-accent)]/10">{tech}</span>
                      ))}
                      {project.stack.length > 4 && (
                        <span className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400">+{project.stack.length - 4}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
