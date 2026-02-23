'use client';

import { useState, useCallback, useRef } from 'react';
import {
  Plus, GripVertical, Trash2, ChevronUp, ChevronDown, Copy,
  Type, Image as ImageIcon, List, Quote, Code, Table, Video,
  Minus, AlertCircle, MousePointer, FileCode, Columns, AlignLeft,
  Heading1, Heading2, Heading3, X, Check, Move
} from 'lucide-react';

export interface Block {
  id: string;
  type: 'paragraph' | 'heading' | 'image' | 'gallery' | 'list' | 'quote' | 'code' | 'table' | 'video' | 'divider' | 'callout' | 'button' | 'html' | 'spacer';
  data: Record<string, any>;
}

interface BlockEditorProps {
  blocks: Block[];
  onChange: (blocks: Block[]) => void;
}

const BLOCK_TYPES = [
  { type: 'paragraph', label: 'Paragraph', icon: AlignLeft, category: 'Text', description: 'Plain text content' },
  { type: 'heading', label: 'Heading', icon: Type, category: 'Text', description: 'H1, H2, or H3 heading' },
  { type: 'image', label: 'Image', icon: ImageIcon, category: 'Media', description: 'Single image with caption' },
  { type: 'gallery', label: 'Gallery', icon: Columns, category: 'Media', description: 'Multiple images grid' },
  { type: 'list', label: 'List', icon: List, category: 'Text', description: 'Ordered or unordered list' },
  { type: 'quote', label: 'Quote', icon: Quote, category: 'Text', description: 'Blockquote with attribution' },
  { type: 'code', label: 'Code', icon: Code, category: 'Text', description: 'Code block with syntax' },
  { type: 'table', label: 'Table', icon: Table, category: 'Layout', description: 'Data table' },
  { type: 'video', label: 'Video', icon: Video, category: 'Media', description: 'YouTube or Vimeo embed' },
  { type: 'divider', label: 'Divider', icon: Minus, category: 'Layout', description: 'Horizontal line separator' },
  { type: 'callout', label: 'Callout', icon: AlertCircle, category: 'Layout', description: 'Info, warning, or tip box' },
  { type: 'button', label: 'Button', icon: MousePointer, category: 'Layout', description: 'Call-to-action button' },
  { type: 'html', label: 'HTML', icon: FileCode, category: 'Advanced', description: 'Custom HTML code' },
  { type: 'spacer', label: 'Spacer', icon: Move, category: 'Layout', description: 'Vertical space' },
] as const;

const generateId = () => `block_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

const getDefaultData = (type: string): Record<string, any> => {
  switch (type) {
    case 'paragraph': return { text: '' };
    case 'heading': return { text: '', level: 2 };
    case 'image': return { url: '', alt: '', caption: '', width: 'full' };
    case 'gallery': return { images: [{ url: '', alt: '', caption: '' }] };
    case 'list': return { style: 'unordered', items: [''] };
    case 'quote': return { text: '', attribution: '' };
    case 'code': return { code: '', language: 'javascript' };
    case 'table': return { headers: ['Column 1', 'Column 2'], rows: [['', '']] };
    case 'video': return { url: '', caption: '' };
    case 'divider': return { style: 'solid' };
    case 'callout': return { type: 'info', title: '', text: '' };
    case 'button': return { text: 'Click Here', url: '', style: 'primary' };
    case 'html': return { code: '' };
    case 'spacer': return { height: 40 };
    default: return {};
  }
};

export default function BlockEditor({ blocks, onChange }: BlockEditorProps) {
  const [showBlockMenu, setShowBlockMenu] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const addBlock = useCallback((type: string, afterIndex: number) => {
    const newBlock: Block = {
      id: generateId(),
      type: type as Block['type'],
      data: getDefaultData(type),
    };
    const newBlocks = [...blocks];
    newBlocks.splice(afterIndex + 1, 0, newBlock);
    onChange(newBlocks);
    setShowBlockMenu(null);
    setSearchTerm('');
  }, [blocks, onChange]);

  const updateBlock = useCallback((index: number, data: Record<string, any>) => {
    const newBlocks = [...blocks];
    newBlocks[index] = { ...newBlocks[index], data: { ...newBlocks[index].data, ...data } };
    onChange(newBlocks);
  }, [blocks, onChange]);

  const removeBlock = useCallback((index: number) => {
    onChange(blocks.filter((_, i) => i !== index));
  }, [blocks, onChange]);

  const moveBlock = useCallback((from: number, to: number) => {
    if (to < 0 || to >= blocks.length) return;
    const newBlocks = [...blocks];
    const [moved] = newBlocks.splice(from, 1);
    newBlocks.splice(to, 0, moved);
    onChange(newBlocks);
  }, [blocks, onChange]);

  const duplicateBlock = useCallback((index: number) => {
    const newBlock = { ...blocks[index], id: generateId() };
    const newBlocks = [...blocks];
    newBlocks.splice(index + 1, 0, newBlock);
    onChange(newBlocks);
  }, [blocks, onChange]);

  const handleDragStart = (index: number) => setDragIndex(index);
  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverIndex(index);
  };
  const handleDrop = (index: number) => {
    if (dragIndex !== null && dragIndex !== index) moveBlock(dragIndex, index);
    setDragIndex(null);
    setDragOverIndex(null);
  };

  const filteredBlockTypes = BLOCK_TYPES.filter(bt =>
    bt.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bt.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bt.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const categories = Array.from(new Set(filteredBlockTypes.map(bt => bt.category)));

  // ===== Block Inserter Menu =====
  const renderBlockMenu = (afterIndex: number) => (
    <div className="absolute left-0 right-0 z-50 mt-2 mx-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xl shadow-slate-200/50 dark:shadow-slate-900/50 overflow-hidden max-h-[400px]">
        <div className="p-3 border-b border-slate-100 dark:border-slate-700 sticky top-0 bg-white dark:bg-slate-800 z-10">
          <div className="relative">
            <input
              ref={searchRef}
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search blocks..."
              className="w-full px-4 py-2.5 pl-9 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500/30 outline-none"
              autoFocus
            />
            <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </div>
        </div>
        <div className="p-2 overflow-y-auto max-h-[320px]">
          {categories.map(cat => (
            <div key={cat}>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-3 py-1.5 mt-1">{cat}</p>
              <div className="grid grid-cols-3 gap-1">
                {filteredBlockTypes.filter(bt => bt.category === cat).map(bt => (
                  <button
                    key={bt.type}
                    onClick={() => addBlock(bt.type, afterIndex)}
                    className="flex flex-col items-center gap-1.5 p-3 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-500/10 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all group"
                  >
                    <bt.icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    <span className="text-[11px] font-medium">{bt.label}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
          {filteredBlockTypes.length === 0 && (
            <p className="text-sm text-slate-400 text-center py-6">No blocks match &ldquo;{searchTerm}&rdquo;</p>
          )}
        </div>
      </div>
    </div>
  );

  // ===== Individual Block Renderers =====
  const renderBlockContent = (block: Block, index: number) => {
    const data = block.data;

    switch (block.type) {
      case 'paragraph':
        return (
          <textarea
            value={(data.text as string) || ''}
            onChange={e => updateBlock(index, { text: e.target.value })}
            placeholder="Type your paragraph text here..."
            className="w-full min-h-[60px] bg-transparent text-slate-800 dark:text-slate-200 text-base leading-relaxed resize-none outline-none placeholder-slate-400"
            rows={Math.max(2, ((data.text as string) || '').split('\n').length)}
          />
        );

      case 'heading':
        return (
          <div className="space-y-2">
            <div className="flex gap-1">
              {[1, 2, 3].map(level => (
                <button key={level} onClick={() => updateBlock(index, { level })}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    (data.level || 2) === level
                      ? 'bg-blue-500 text-white'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600'
                  }`}>
                  H{level}
                </button>
              ))}
            </div>
            <input
              type="text"
              value={(data.text as string) || ''}
              onChange={e => updateBlock(index, { text: e.target.value })}
              placeholder="Heading text..."
              className={`w-full bg-transparent text-slate-900 dark:text-white font-bold outline-none placeholder-slate-400 ${
                data.level === 1 ? 'text-3xl' : data.level === 3 ? 'text-lg' : 'text-2xl'
              }`}
            />
          </div>
        );

      case 'image':
        return (
          <div className="space-y-3">
            <input
              type="text" value={(data.url as string) || ''} onChange={e => updateBlock(index, { url: e.target.value })}
              placeholder="Image URL (https://...)" className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/30"
            />
            {data.url && (
              <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
                <img src={data.url as string} alt={(data.alt as string) || ''} className="max-h-64 w-auto mx-auto" />
              </div>
            )}
            <div className="grid grid-cols-2 gap-2">
              <input type="text" value={(data.alt as string) || ''} onChange={e => updateBlock(index, { alt: e.target.value })}
                placeholder="Alt text" className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-white outline-none" />
              <input type="text" value={(data.caption as string) || ''} onChange={e => updateBlock(index, { caption: e.target.value })}
                placeholder="Caption (optional)" className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-white outline-none" />
            </div>
            <div className="flex gap-1">
              {['full', 'wide', 'medium', 'small'].map(w => (
                <button key={w} onClick={() => updateBlock(index, { width: w })}
                  className={`px-3 py-1 rounded-lg text-xs capitalize transition-all ${(data.width || 'full') === w ? 'bg-blue-500 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400'}`}>{w}</button>
              ))}
            </div>
          </div>
        );

      case 'gallery':
        const images = (data.images as Array<{ url: string; alt: string; caption: string }>) || [{ url: '', alt: '', caption: '' }];
        return (
          <div className="space-y-3">
            {images.map((img, i) => (
              <div key={i} className="flex gap-2 items-start p-2 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                {img.url && <img src={img.url} alt={img.alt} className="w-16 h-16 object-cover rounded-lg flex-shrink-0" />}
                <div className="flex-1 space-y-1">
                  <input type="text" value={img.url} onChange={e => { const newImages = [...images]; newImages[i] = { ...newImages[i], url: e.target.value }; updateBlock(index, { images: newImages }); }}
                    placeholder="Image URL" className="w-full px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white outline-none" />
                  <input type="text" value={img.caption} onChange={e => { const newImages = [...images]; newImages[i] = { ...newImages[i], caption: e.target.value }; updateBlock(index, { images: newImages }); }}
                    placeholder="Caption" className="w-full px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white outline-none" />
                </div>
                <button onClick={() => { const newImages = images.filter((_, j) => j !== i); updateBlock(index, { images: newImages.length ? newImages : [{ url: '', alt: '', caption: '' }] }); }}
                  className="p-1 text-red-400 hover:text-red-600"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            ))}
            <button onClick={() => updateBlock(index, { images: [...images, { url: '', alt: '', caption: '' }] })}
              className="text-xs text-blue-500 hover:text-blue-600 font-medium flex items-center gap-1"><Plus className="w-3.5 h-3.5" /> Add Image</button>
          </div>
        );

      case 'list':
        const items = (data.items as string[]) || [''];
        return (
          <div className="space-y-2">
            <div className="flex gap-1">
              <button onClick={() => updateBlock(index, { style: 'unordered' })}
                className={`px-3 py-1 rounded-lg text-xs transition-all ${data.style !== 'ordered' ? 'bg-blue-500 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400'}`}>• Bullet</button>
              <button onClick={() => updateBlock(index, { style: 'ordered' })}
                className={`px-3 py-1 rounded-lg text-xs transition-all ${data.style === 'ordered' ? 'bg-blue-500 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400'}`}>1. Numbered</button>
            </div>
            {items.map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="text-sm text-slate-400 w-6 text-right flex-shrink-0">
                  {data.style === 'ordered' ? `${i + 1}.` : '•'}
                </span>
                <input type="text" value={item} onChange={e => { const newItems = [...items]; newItems[i] = e.target.value; updateBlock(index, { items: newItems }); }}
                  onKeyDown={e => {
                    if (e.key === 'Enter') { const newItems = [...items]; newItems.splice(i + 1, 0, ''); updateBlock(index, { items: newItems }); }
                    if (e.key === 'Backspace' && !item && items.length > 1) { updateBlock(index, { items: items.filter((_, j) => j !== i) }); }
                  }}
                  placeholder="List item..."
                  className="flex-1 px-2 py-1.5 bg-transparent text-sm text-slate-800 dark:text-slate-200 outline-none border-b border-transparent focus:border-blue-500/30" />
                <button onClick={() => updateBlock(index, { items: items.filter((_, j) => j !== i) })}
                  className="p-1 text-slate-300 hover:text-red-400 opacity-0 group-hover:opacity-100"><Trash2 className="w-3 h-3" /></button>
              </div>
            ))}
            <button onClick={() => updateBlock(index, { items: [...items, ''] })}
              className="text-xs text-blue-500 hover:text-blue-600 font-medium flex items-center gap-1 ml-8"><Plus className="w-3.5 h-3.5" /> Add Item</button>
          </div>
        );

      case 'quote':
        return (
          <div className="border-l-4 border-blue-500 pl-4 space-y-2">
            <textarea value={(data.text as string) || ''} onChange={e => updateBlock(index, { text: e.target.value })}
              placeholder="Quote text..." rows={3}
              className="w-full bg-transparent text-lg italic text-slate-700 dark:text-slate-300 resize-none outline-none placeholder-slate-400" />
            <input type="text" value={(data.attribution as string) || ''} onChange={e => updateBlock(index, { attribution: e.target.value })}
              placeholder="— Attribution" className="w-full bg-transparent text-sm text-slate-500 outline-none placeholder-slate-400" />
          </div>
        );

      case 'code':
        return (
          <div className="space-y-2">
            <select value={(data.language as string) || 'javascript'} onChange={e => updateBlock(index, { language: e.target.value })}
              className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-700 dark:text-slate-300 outline-none">
              {['javascript', 'typescript', 'python', 'html', 'css', 'json', 'bash', 'sql', 'php', 'java', 'c', 'cpp', 'csharp', 'go', 'rust', 'ruby', 'swift', 'kotlin', 'plaintext'].map(lang => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
            </select>
            <textarea value={(data.code as string) || ''} onChange={e => updateBlock(index, { code: e.target.value })}
              placeholder="Paste your code here..." rows={8}
              className="w-full px-4 py-3 bg-slate-900 dark:bg-slate-950 text-emerald-400 font-mono text-sm rounded-xl resize-none outline-none" />
          </div>
        );

      case 'table':
        const headers = (data.headers as string[]) || ['Column 1', 'Column 2'];
        const rows = (data.rows as string[][]) || [['', '']];
        return (
          <div className="space-y-2 overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr>
                  {headers.map((h, i) => (
                    <th key={i} className="border border-slate-200 dark:border-slate-700 p-0">
                      <input type="text" value={h} onChange={e => { const nh = [...headers]; nh[i] = e.target.value; updateBlock(index, { headers: nh }); }}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold outline-none text-xs" />
                    </th>
                  ))}
                  <th className="w-8 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
                    <button onClick={() => { updateBlock(index, { headers: [...headers, `Col ${headers.length + 1}`], rows: rows.map(r => [...r, '']) }); }}
                      className="p-1 text-slate-400 hover:text-blue-500"><Plus className="w-3 h-3" /></button>
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, ri) => (
                  <tr key={ri}>
                    {row.map((cell, ci) => (
                      <td key={ci} className="border border-slate-200 dark:border-slate-700 p-0">
                        <input type="text" value={cell} onChange={e => { const nr = rows.map(r => [...r]); nr[ri][ci] = e.target.value; updateBlock(index, { rows: nr }); }}
                          className="w-full px-3 py-2 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 outline-none text-xs" />
                      </td>
                    ))}
                    <td className="w-8 border border-slate-200 dark:border-slate-700">
                      <button onClick={() => updateBlock(index, { rows: rows.filter((_, j) => j !== ri) })}
                        className="p-1 text-slate-400 hover:text-red-400"><Trash2 className="w-3 h-3" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button onClick={() => updateBlock(index, { rows: [...rows, Array(headers.length).fill('')] })}
              className="text-xs text-blue-500 hover:text-blue-600 font-medium flex items-center gap-1"><Plus className="w-3.5 h-3.5" /> Add Row</button>
          </div>
        );

      case 'video':
        return (
          <div className="space-y-3">
            <input type="text" value={(data.url as string) || ''} onChange={e => updateBlock(index, { url: e.target.value })}
              placeholder="YouTube or Vimeo URL" className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/30" />
            {data.url && (
              <div className="aspect-video bg-slate-100 dark:bg-slate-800 rounded-xl overflow-hidden flex items-center justify-center">
                <Video className="w-12 h-12 text-slate-400" />
                <span className="text-sm text-slate-400 ml-2">Video preview: {data.url as string}</span>
              </div>
            )}
            <input type="text" value={(data.caption as string) || ''} onChange={e => updateBlock(index, { caption: e.target.value })}
              placeholder="Video caption (optional)" className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-white outline-none" />
          </div>
        );

      case 'divider':
        return (
          <div className="flex gap-2 items-center">
            <hr className={`flex-1 border-0 h-px ${
              data.style === 'dashed' ? 'border-t-2 border-dashed border-slate-300 dark:border-slate-600' :
              data.style === 'dotted' ? 'border-t-2 border-dotted border-slate-300 dark:border-slate-600' :
              'bg-slate-200 dark:bg-slate-700'
            }`} />
            <div className="flex gap-1">
              {['solid', 'dashed', 'dotted'].map(s => (
                <button key={s} onClick={() => updateBlock(index, { style: s })}
                  className={`px-2 py-1 rounded text-[10px] capitalize ${(data.style || 'solid') === s ? 'bg-blue-500 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-500'}`}>{s}</button>
              ))}
            </div>
          </div>
        );

      case 'callout':
        return (
          <div className={`rounded-xl p-4 border ${
            data.type === 'warning' ? 'bg-amber-50 dark:bg-amber-500/5 border-amber-200 dark:border-amber-500/20' :
            data.type === 'error' ? 'bg-red-50 dark:bg-red-500/5 border-red-200 dark:border-red-500/20' :
            data.type === 'success' ? 'bg-emerald-50 dark:bg-emerald-500/5 border-emerald-200 dark:border-emerald-500/20' :
            'bg-blue-50 dark:bg-blue-500/5 border-blue-200 dark:border-blue-500/20'
          }`}>
            <div className="flex gap-1 mb-2">
              {['info', 'warning', 'error', 'success'].map(t => (
                <button key={t} onClick={() => updateBlock(index, { type: t })}
                  className={`px-2 py-1 rounded text-[10px] capitalize ${(data.type || 'info') === t ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900' : 'bg-white/50 dark:bg-slate-800/50 text-slate-500'}`}>{t}</button>
              ))}
            </div>
            <input type="text" value={(data.title as string) || ''} onChange={e => updateBlock(index, { title: e.target.value })}
              placeholder="Callout title (optional)" className="w-full bg-transparent font-semibold text-sm text-slate-900 dark:text-white outline-none mb-1 placeholder-slate-400" />
            <textarea value={(data.text as string) || ''} onChange={e => updateBlock(index, { text: e.target.value })}
              placeholder="Callout content..." rows={2}
              className="w-full bg-transparent text-sm text-slate-700 dark:text-slate-300 resize-none outline-none placeholder-slate-400" />
          </div>
        );

      case 'button':
        return (
          <div className="space-y-2">
            <div className="flex gap-2">
              <input type="text" value={(data.text as string) || ''} onChange={e => updateBlock(index, { text: e.target.value })}
                placeholder="Button text" className="flex-1 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-white outline-none" />
              <input type="text" value={(data.url as string) || ''} onChange={e => updateBlock(index, { url: e.target.value })}
                placeholder="URL" className="flex-1 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-white outline-none" />
            </div>
            <div className="flex gap-1">
              {['primary', 'secondary', 'outline'].map(s => (
                <button key={s} onClick={() => updateBlock(index, { style: s })}
                  className={`px-3 py-1 rounded-lg text-xs capitalize ${(data.style || 'primary') === s ? 'bg-blue-500 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400'}`}>{s}</button>
              ))}
            </div>
            <div className="mt-2">
              <span className={`inline-block px-6 py-2.5 rounded-xl text-sm font-semibold ${
                data.style === 'secondary' ? 'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white' :
                data.style === 'outline' ? 'border-2 border-blue-500 text-blue-500' :
                'bg-blue-500 text-white'
              }`}>{(data.text as string) || 'Button'}</span>
            </div>
          </div>
        );

      case 'html':
        return (
          <div className="space-y-2">
            <textarea value={(data.code as string) || ''} onChange={e => updateBlock(index, { code: e.target.value })}
              placeholder="<div>Custom HTML code...</div>" rows={6}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-mono text-sm rounded-xl border border-slate-200 dark:border-slate-700 resize-none outline-none" />
            {data.code && (
              <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700">
                <p className="text-[10px] font-bold uppercase text-slate-400 mb-1">Preview</p>
                <div dangerouslySetInnerHTML={{ __html: (data.code as string) || '' }} className="prose prose-sm dark:prose-invert max-w-none" />
              </div>
            )}
          </div>
        );

      case 'spacer':
        return (
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400">Height:</span>
            <input type="range" min="10" max="200" value={(data.height as number) || 40}
              onChange={e => updateBlock(index, { height: Number(e.target.value) })}
              className="flex-1 accent-blue-500" />
            <span className="text-xs text-slate-500 font-medium w-10">{data.height || 40}px</span>
          </div>
        );

      default:
        return <p className="text-sm text-slate-400">Unknown block type: {block.type}</p>;
    }
  };

  const getBlockIcon = (type: string) => {
    const bt = BLOCK_TYPES.find(b => b.type === type);
    return bt ? bt.icon : AlignLeft;
  };

  return (
    <div className="space-y-1">
      {/* Empty state */}
      {blocks.length === 0 && (
        <div className="relative">
          <div className="text-center py-16 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl">
            <Type className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600 mb-3" />
            <p className="text-slate-500 dark:text-slate-400 mb-4">Start building your post</p>
            <button
              onClick={() => { setShowBlockMenu(-1); setTimeout(() => searchRef.current?.focus(), 100); }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg shadow-blue-500/25"
            >
              <Plus className="w-4 h-4" /> Add First Block
            </button>
          </div>
          {showBlockMenu === -1 && renderBlockMenu(-1)}
        </div>
      )}

      {/* Blocks */}
      {blocks.map((block, index) => {
        const BlockIcon = getBlockIcon(block.type);
        return (
          <div key={block.id} className="relative group">
            {/* Block */}
            <div
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={e => handleDragOver(e, index)}
              onDrop={() => handleDrop(index)}
              onDragEnd={() => { setDragIndex(null); setDragOverIndex(null); }}
              className={`relative bg-white dark:bg-slate-800/50 rounded-xl border transition-all ${
                dragOverIndex === index ? 'border-blue-500 ring-2 ring-blue-500/20' :
                'border-slate-200 dark:border-slate-700/50 hover:border-blue-300 dark:hover:border-blue-500/30'
              } ${dragIndex === index ? 'opacity-50' : ''}`}
            >
              {/* Block toolbar */}
              <div className="flex items-center gap-1 px-3 py-2 border-b border-slate-100 dark:border-slate-700/50 opacity-60 group-hover:opacity-100 transition-opacity">
                <div className="cursor-grab active:cursor-grabbing p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                  <GripVertical className="w-4 h-4" />
                </div>
                <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <BlockIcon className="w-3.5 h-3.5 text-blue-500" />
                  <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 capitalize">{block.type}</span>
                </div>
                <div className="flex-1" />
                <button onClick={() => moveBlock(index, index - 1)} disabled={index === 0}
                  className="p-1 text-slate-400 hover:text-slate-600 disabled:opacity-30"><ChevronUp className="w-3.5 h-3.5" /></button>
                <button onClick={() => moveBlock(index, index + 1)} disabled={index === blocks.length - 1}
                  className="p-1 text-slate-400 hover:text-slate-600 disabled:opacity-30"><ChevronDown className="w-3.5 h-3.5" /></button>
                <button onClick={() => duplicateBlock(index)}
                  className="p-1 text-slate-400 hover:text-blue-500"><Copy className="w-3.5 h-3.5" /></button>
                <button onClick={() => removeBlock(index)}
                  className="p-1 text-slate-400 hover:text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
              {/* Block content */}
              <div className="p-4">
                {renderBlockContent(block, index)}
              </div>
            </div>

            {/* Add block between */}
            <div className="relative flex items-center justify-center py-1 group/add">
              <div className="absolute inset-x-4 h-px bg-slate-200 dark:bg-slate-700/50 opacity-0 group-hover/add:opacity-100 transition-opacity" />
              <button
                onClick={() => { setShowBlockMenu(showBlockMenu === index ? null : index); setSearchTerm(''); setTimeout(() => searchRef.current?.focus(), 100); }}
                className="relative z-10 p-1 rounded-full bg-blue-500 text-white shadow-lg shadow-blue-500/25 opacity-0 group-hover/add:opacity-100 hover:scale-110 transition-all"
              >
                {showBlockMenu === index ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* Block menu popup */}
            {showBlockMenu === index && renderBlockMenu(index)}
          </div>
        );
      })}
    </div>
  );
}

// Helper function to convert blocks to HTML for backward compatibility
export function blocksToHtml(blocks: Block[]): string {
  return blocks.map(block => {
    const d = block.data;
    switch (block.type) {
      case 'paragraph': return `<p>${(d.text as string || '').replace(/\n/g, '<br/>')}</p>`;
      case 'heading': return `<h${d.level || 2}>${d.text || ''}</h${d.level || 2}>`;
      case 'image': {
        const widthClass = d.width === 'small' ? 'max-w-sm' : d.width === 'medium' ? 'max-w-lg' : d.width === 'wide' ? 'max-w-4xl' : 'w-full';
        return `<figure class="${widthClass} mx-auto my-6"><img src="${d.url}" alt="${d.alt || ''}" class="w-full rounded-xl" />${d.caption ? `<figcaption class="text-center text-sm text-gray-500 mt-2">${d.caption}</figcaption>` : ''}</figure>`;
      }
      case 'gallery': {
        const imgs = (d.images as Array<{ url: string; alt: string; caption: string }>) || [];
        return `<div class="grid grid-cols-2 md:grid-cols-3 gap-4 my-6">${imgs.filter(i => i.url).map(i => `<figure><img src="${i.url}" alt="${i.alt || ''}" class="w-full rounded-xl" />${i.caption ? `<figcaption class="text-xs text-gray-500 mt-1">${i.caption}</figcaption>` : ''}</figure>`).join('')}</div>`;
      }
      case 'list': {
        const tag = d.style === 'ordered' ? 'ol' : 'ul';
        const items = (d.items as string[]) || [];
        return `<${tag}>${items.filter(Boolean).map(i => `<li>${i}</li>`).join('')}</${tag}>`;
      }
      case 'quote': return `<blockquote><p>${d.text || ''}</p>${d.attribution ? `<cite>— ${d.attribution}</cite>` : ''}</blockquote>`;
      case 'code': return `<pre><code class="language-${d.language || 'plaintext'}">${(d.code as string || '').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code></pre>`;
      case 'table': {
        const hs = (d.headers as string[]) || [];
        const rs = (d.rows as string[][]) || [];
        return `<table class="w-full border-collapse my-6"><thead><tr>${hs.map(h => `<th class="border border-gray-300 px-4 py-2 bg-gray-50 font-semibold">${h}</th>`).join('')}</tr></thead><tbody>${rs.map(r => `<tr>${r.map(c => `<td class="border border-gray-300 px-4 py-2">${c}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
      }
      case 'video': {
        const url = d.url as string || '';
        let embedUrl = url;
        if (url.includes('youtube.com/watch')) embedUrl = url.replace('watch?v=', 'embed/');
        else if (url.includes('youtu.be/')) embedUrl = `https://www.youtube.com/embed/${url.split('youtu.be/')[1]}`;
        else if (url.includes('vimeo.com/')) embedUrl = `https://player.vimeo.com/video/${url.split('vimeo.com/')[1]}`;
        return `<div class="aspect-video my-6 rounded-xl overflow-hidden"><iframe src="${embedUrl}" class="w-full h-full" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>${d.caption ? `<p class="text-center text-sm text-gray-500 mt-2">${d.caption}</p>` : ''}`;
      }
      case 'divider': return `<hr class="my-8" />`;
      case 'callout': {
        const colors: Record<string, string> = { info: 'bg-blue-50 border-blue-200 text-blue-800', warning: 'bg-amber-50 border-amber-200 text-amber-800', error: 'bg-red-50 border-red-200 text-red-800', success: 'bg-emerald-50 border-emerald-200 text-emerald-800' };
        const c = colors[(d.type as string) || 'info'] || colors.info;
        return `<div class="rounded-xl border p-4 my-6 ${c}">${d.title ? `<p class="font-semibold mb-1">${d.title}</p>` : ''}<p>${d.text || ''}</p></div>`;
      }
      case 'button': {
        const styles: Record<string, string> = { primary: 'bg-blue-500 text-white', secondary: 'bg-gray-200 text-gray-900', outline: 'border-2 border-blue-500 text-blue-500' };
        const s = styles[(d.style as string) || 'primary'] || styles.primary;
        return `<div class="my-6"><a href="${d.url || '#'}" class="inline-block px-6 py-3 rounded-xl font-semibold ${s} hover:opacity-90 transition-opacity">${d.text || 'Button'}</a></div>`;
      }
      case 'html': return d.code as string || '';
      case 'spacer': return `<div style="height: ${d.height || 40}px"></div>`;
      default: return '';
    }
  }).join('\n');
}

// Helper to get plain text from blocks for read time calculation
export function blocksToPlainText(blocks: Block[]): string {
  return blocks.map(block => {
    const d = block.data;
    switch (block.type) {
      case 'paragraph': case 'heading': return d.text as string || '';
      case 'quote': return d.text as string || '';
      case 'list': return ((d.items as string[]) || []).join(' ');
      case 'callout': return `${d.title || ''} ${d.text || ''}`;
      case 'code': return d.code as string || '';
      default: return '';
    }
  }).join(' ');
}
