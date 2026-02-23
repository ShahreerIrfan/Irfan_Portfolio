'use client';

interface Block {
  id: string;
  type: string;
  data: Record<string, any>;
}

interface BlockRendererProps {
  blocks: Block[];
}

export default function BlockRenderer({ blocks }: BlockRendererProps) {
  if (!blocks || blocks.length === 0) return null;

  return (
    <div className="block-content space-y-6">
      {blocks.map((block) => (
        <BlockItem key={block.id} block={block} />
      ))}
    </div>
  );
}

function BlockItem({ block }: { block: Block }) {
  const d = block.data;

  switch (block.type) {
    case 'paragraph':
      return (
        <p className="text-lg leading-relaxed text-slate-600 dark:text-slate-300 whitespace-pre-line">
          {d.text as string}
        </p>
      );

    case 'heading': {
      const text = d.text as string;
      const id = text?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const level = d.level as number || 2;
      if (level === 1) return <h1 id={id} className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mt-10 mb-4 scroll-mt-24">{text}</h1>;
      if (level === 3) return <h3 id={id} className="text-xl font-bold text-slate-900 dark:text-white mt-6 mb-3 scroll-mt-24">{text}</h3>;
      return <h2 id={id} className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mt-8 mb-4 scroll-mt-24">{text}</h2>;
    }

    case 'image': {
      const widthClass = d.width === 'small' ? 'max-w-sm' : d.width === 'medium' ? 'max-w-lg' : d.width === 'wide' ? 'max-w-4xl' : 'w-full';
      return (
        <figure className={`${widthClass} mx-auto my-6`}>
          <div className="rounded-xl overflow-hidden shadow-lg">
            <img src={d.url as string} alt={(d.alt as string) || ''} className="w-full h-auto" loading="lazy" />
          </div>
          {d.caption && (
            <figcaption className="text-center text-sm text-slate-500 dark:text-slate-400 mt-3 italic">{d.caption as string}</figcaption>
          )}
        </figure>
      );
    }

    case 'gallery': {
      const images = (d.images as Array<{ url: string; alt: string; caption: string }>) || [];
      const validImages = images.filter(i => i.url);
      if (validImages.length === 0) return null;
      return (
        <div className={`grid gap-4 my-6 ${
          validImages.length === 1 ? 'grid-cols-1' :
          validImages.length === 2 ? 'grid-cols-2' :
          validImages.length === 4 ? 'grid-cols-2' :
          'grid-cols-2 md:grid-cols-3'
        }`}>
          {validImages.map((img, i) => (
            <figure key={i} className="group">
              <div className="rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow">
                <img src={img.url} alt={img.alt || ''} className="w-full h-auto group-hover:scale-105 transition-transform duration-500" loading="lazy" />
              </div>
              {img.caption && (
                <figcaption className="text-xs text-slate-500 dark:text-slate-400 mt-2">{img.caption}</figcaption>
              )}
            </figure>
          ))}
        </div>
      );
    }

    case 'list': {
      const items = ((d.items as string[]) || []).filter(Boolean);
      if (items.length === 0) return null;
      const Tag = d.style === 'ordered' ? 'ol' : 'ul';
      return (
        <Tag className={`my-4 space-y-2 ${
          d.style === 'ordered'
            ? 'list-decimal list-inside'
            : 'list-disc list-inside'
        } text-slate-600 dark:text-slate-300`}>
          {items.map((item, i) => (
            <li key={i} className="text-base leading-relaxed pl-2">{item}</li>
          ))}
        </Tag>
      );
    }

    case 'quote':
      return (
        <blockquote className="relative my-8 pl-6 border-l-4 border-[var(--active-accent)] bg-[var(--active-accent)]/5 rounded-r-xl py-4 pr-6">
          <p className="text-lg italic text-slate-700 dark:text-slate-300 leading-relaxed">{d.text as string}</p>
          {d.attribution && (
            <cite className="block text-sm text-slate-500 dark:text-slate-400 mt-3 not-italic font-medium">— {d.attribution as string}</cite>
          )}
        </blockquote>
      );

    case 'code':
      return (
        <div className="my-6 rounded-xl overflow-hidden shadow-lg">
          <div className="flex items-center justify-between px-4 py-2 bg-slate-800 border-b border-slate-700">
            <span className="text-xs font-medium text-slate-400 capitalize">{(d.language as string) || 'code'}</span>
            <button
              onClick={() => navigator.clipboard.writeText(d.code as string || '')}
              className="text-xs text-slate-400 hover:text-white transition-colors px-2 py-1 rounded hover:bg-slate-700"
            >
              Copy
            </button>
          </div>
          <pre className="bg-slate-900 p-4 overflow-x-auto">
            <code className={`language-${d.language || 'plaintext'} text-sm leading-relaxed text-emerald-400`}>
              {d.code as string}
            </code>
          </pre>
        </div>
      );

    case 'table': {
      const headers = (d.headers as string[]) || [];
      const rows = (d.rows as string[][]) || [];
      return (
        <div className="my-6 overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr>
                {headers.map((h, i) => (
                  <th key={i} className="px-4 py-3 bg-slate-50 dark:bg-slate-800 font-semibold text-slate-900 dark:text-white text-left border-b border-slate-200 dark:border-slate-700">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, ri) => (
                <tr key={ri} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  {row.map((cell, ci) => (
                    <td key={ci} className="px-4 py-3 border-b border-slate-100 dark:border-slate-700/50 text-slate-600 dark:text-slate-300">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    case 'video': {
      const url = d.url as string || '';
      let embedUrl = url;
      if (url.includes('youtube.com/watch')) embedUrl = url.replace('watch?v=', 'embed/');
      else if (url.includes('youtu.be/')) embedUrl = `https://www.youtube.com/embed/${url.split('youtu.be/')[1]}`;
      else if (url.includes('vimeo.com/')) embedUrl = `https://player.vimeo.com/video/${url.split('vimeo.com/')[1]}`;
      return (
        <div className="my-6">
          <div className="aspect-video rounded-xl overflow-hidden shadow-lg">
            <iframe src={embedUrl} className="w-full h-full" frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen title="Embedded video" />
          </div>
          {d.caption && (
            <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-3 italic">{d.caption as string}</p>
          )}
        </div>
      );
    }

    case 'divider':
      return (
        <hr className={`my-8 border-0 h-px ${
          d.style === 'dashed' ? 'border-t-2 border-dashed border-slate-300 dark:border-slate-600' :
          d.style === 'dotted' ? 'border-t-2 border-dotted border-slate-300 dark:border-slate-600' :
          'bg-slate-200 dark:bg-slate-700'
        }`} />
      );

    case 'callout': {
      const typeConfig: Record<string, { bg: string; border: string; text: string; icon: string }> = {
        info: { bg: 'bg-blue-50 dark:bg-blue-500/10', border: 'border-blue-200 dark:border-blue-500/30', text: 'text-blue-800 dark:text-blue-300', icon: 'ℹ️' },
        warning: { bg: 'bg-amber-50 dark:bg-amber-500/10', border: 'border-amber-200 dark:border-amber-500/30', text: 'text-amber-800 dark:text-amber-300', icon: '⚠️' },
        error: { bg: 'bg-red-50 dark:bg-red-500/10', border: 'border-red-200 dark:border-red-500/30', text: 'text-red-800 dark:text-red-300', icon: '🚨' },
        success: { bg: 'bg-emerald-50 dark:bg-emerald-500/10', border: 'border-emerald-200 dark:border-emerald-500/30', text: 'text-emerald-800 dark:text-emerald-300', icon: '✅' },
      };
      const config = typeConfig[(d.type as string) || 'info'] || typeConfig.info;
      return (
        <div className={`rounded-xl border p-5 my-6 ${config.bg} ${config.border}`}>
          <div className="flex gap-3">
            <span className="text-xl flex-shrink-0">{config.icon}</span>
            <div>
              {d.title && <p className={`font-semibold mb-1 ${config.text}`}>{d.title as string}</p>}
              <p className={`${config.text} leading-relaxed`}>{d.text as string}</p>
            </div>
          </div>
        </div>
      );
    }

    case 'button': {
      const styleClass = d.style === 'secondary'
        ? 'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white hover:bg-slate-300 dark:hover:bg-slate-600'
        : d.style === 'outline'
          ? 'border-2 border-[var(--active-accent)] text-[var(--active-accent)] hover:bg-[var(--active-accent)]/10'
          : 'bg-[var(--active-accent)] text-white hover:opacity-90 shadow-lg shadow-[var(--active-accent)]/25';
      return (
        <div className="my-6">
          <a href={(d.url as string) || '#'} target="_blank" rel="noopener noreferrer"
            className={`inline-block px-6 py-3 rounded-xl font-semibold transition-all ${styleClass}`}>
            {(d.text as string) || 'Button'}
          </a>
        </div>
      );
    }

    case 'html':
      return (
        <div
          className="my-6 prose prose-lg dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: (d.code as string) || '' }}
        />
      );

    case 'spacer':
      return <div style={{ height: `${(d.height as number) || 40}px` }} />;

    default:
      return null;
  }
}
