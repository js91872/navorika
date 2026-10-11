'use client';

import { useMemo, useState } from 'react';
import { Check, Copy, RotateCcw, Plus, Minus, Layout, Sliders } from 'lucide-react';
import { generateFlexboxCss, type FlexDirection, type JustifyContent, type AlignItems, type FlexWrap } from '@/lib/calculations/flexbox';

type Item = { id: number; grow: number; shrink: number; basis: string; order: number; self: string };
type Output = 'css' | 'html' | 'tailwind' | 'scss';
type Preset = 'default' | 'center' | 'nav' | 'cards' | 'stack';
const makeItem = (id: number): Item => ({ id, grow: 0, shrink: 1, basis: 'auto', order: 0, self: 'auto' });
const opts = {
  direction: ['row', 'row-reverse', 'column', 'column-reverse'],
  justify: ['flex-start', 'flex-end', 'center', 'space-between', 'space-around', 'space-evenly'],
  align: ['stretch', 'flex-start', 'flex-end', 'center', 'baseline'],
  wrap: ['nowrap', 'wrap', 'wrap-reverse'],
  content: ['normal', 'stretch', 'flex-start', 'flex-end', 'center', 'space-between', 'space-around', 'space-evenly'],
  self: ['auto', 'stretch', 'flex-start', 'flex-end', 'center', 'baseline'],
};
const field = 'mt-1 w-full min-w-0 rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--foreground)]';
const button = 'rounded-lg border border-[var(--border)] px-3 py-2 text-sm font-medium hover:bg-[var(--muted)] disabled:opacity-40';
const safeBasis = (value: string) => /^(auto|content|0|[0-9]{1,4}(?:\.[0-9]{1,2})?(px|%|rem|em|vw))$/.test(value.trim()) ? value.trim() : 'auto';
const tailwindJustify: Record<string,string> = { 'flex-start':'justify-start','flex-end':'justify-end',center:'justify-center','space-between':'justify-between','space-around':'justify-around','space-evenly':'justify-evenly' };
const tailwindAlign: Record<string,string> = {stretch:'items-stretch','flex-start':'items-start','flex-end':'items-end',center:'items-center',baseline:'items-baseline'};
const tailwindContent: Record<string,string> = {normal:'content-normal',stretch:'content-stretch','flex-start':'content-start','flex-end':'content-end',center:'content-center','space-between':'content-between','space-around':'content-around','space-evenly':'content-evenly'};
const tailwindSelf: Record<string,string> = {auto:'self-auto',stretch:'self-stretch','flex-start':'self-start','flex-end':'self-end',center:'self-center',baseline:'self-baseline'};

export default function CssFlexboxGenerator() {
  const [direction, setDirection] = useState<FlexDirection>('row');
  const [justify, setJustify] = useState<JustifyContent>('flex-start');
  const [align, setAlign] = useState<AlignItems>('stretch');
  const [wrap, setWrap] = useState<FlexWrap>('nowrap');
  const [alignContent, setAlignContent] = useState('normal');
  const [rowGap, setRowGap] = useState(16);
  const [columnGap, setColumnGap] = useState(16);
  const [padding, setPadding] = useState(16);
  const [items, setItems] = useState<Item[]>(Array.from({ length: 5 }, (_, i) => makeItem(i + 1)));
  const [selected, setSelected] = useState(1);
  const [device, setDevice] = useState<'desktop'|'tablet'|'mobile'>('desktop');
  const [output, setOutput] = useState<Output>('css');
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  const [preset, setPreset] = useState<Preset>('default');
  const base = useMemo(() => generateFlexboxCss({ flexDirection: direction, justifyContent: justify, alignItems: align, flexWrap: wrap, gap: 0 }), [direction, justify, align, wrap]);
  const active = items.find(i => i.id === selected) ?? items[0];
  const updateItem = (patch: Partial<Item>) => setItems(previous => previous.map(item => item.id === selected ? { ...item, ...patch } : item));
  const addItem = () => {
    if (items.length >= 12) return;
    const id = Math.max(0, ...items.map(item => item.id)) + 1;
    setItems(previous => [...previous, makeItem(id)]); setSelected(id);
  };
  const removeItem = () => {
    if (items.length <= 1) return;
    const next = items.filter(item => item.id !== selected);
    setItems(next); setSelected(next[0].id);
  };
  const applyPreset = (value: Preset) => {
    setPreset(value);
    setAlignContent('normal'); setRowGap(16); setColumnGap(16); setPadding(16);
    const count = value === 'center' ? 1 : value === 'nav' ? 3 : value === 'cards' ? 6 : value === 'stack' ? 4 : 5;
    setItems(Array.from({ length: count }, (_, i) => makeItem(i + 1))); setSelected(1);
    setDirection(value === 'stack' ? 'column' : 'row');
    setJustify(value === 'center' ? 'center' : value === 'nav' ? 'space-between' : 'flex-start');
    setAlign(value === 'center' || value === 'nav' ? 'center' : 'stretch');
    setWrap(value === 'cards' ? 'wrap' : 'nowrap');
    if (value === 'cards') setItems(Array.from({ length: 6 }, (_, i) => ({ ...makeItem(i + 1), basis: '120px', grow: 1 })));
  };
  const rules = [
    '  display: flex;',
    '  flex-direction: ' + direction + ';',
    '  justify-content: ' + justify + ';',
    '  align-items: ' + align + ';',
    '  flex-wrap: ' + wrap + ';',
    '  align-content: ' + alignContent + ';',
    '  row-gap: ' + rowGap + 'px;',
    '  column-gap: ' + columnGap + 'px;',
    '  padding: ' + padding + 'px;',
  ];
  const childRules = items.map(item => '.flex-item-' + item.id + ' {\n  flex-grow: ' + item.grow + ';\n  flex-shrink: ' + item.shrink + ';\n  flex-basis: ' + safeBasis(item.basis) + ';\n  order: ' + item.order + ';\n  align-self: ' + item.self + ';\n}');
  const css = '.flex-container {\n' + rules.join('\n') + '\n}\n\n' + childRules.join('\n\n');
  const html = '<div class="flex-container">\n' + items.map(i => '  <div class="flex-item-' + i.id + '">Item ' + i.id + '</div>').join('\n') + '\n</div>';
  const tailwindClasses = ['flex', ({row:'flex-row','row-reverse':'flex-row-reverse',column:'flex-col','column-reverse':'flex-col-reverse'} as Record<string,string>)[direction], tailwindJustify[justify], tailwindAlign[align], ({nowrap:'flex-nowrap',wrap:'flex-wrap','wrap-reverse':'flex-wrap-reverse'} as Record<string,string>)[wrap], tailwindContent[alignContent], 'gap-x-[' + columnGap + 'px]', 'gap-y-[' + rowGap + 'px]', 'p-[' + padding + 'px]'].join(' ');
  const tailwind = '<div class="' + tailwindClasses + '">\n' + items.map(i => '  <div class="grow-[' + i.grow + '] shrink-[' + i.shrink + '] basis-[' + safeBasis(i.basis) + '] order-[' + i.order + '] ' + tailwindSelf[i.self] + '">Item ' + i.id + '</div>').join('\n') + '\n</div>';
  const scss = '.flex-container {\n' + rules.join('\n') + '\n' + items.map(i => '  .flex-item-' + i.id + ' { flex-grow: ' + i.grow + '; flex-shrink: ' + i.shrink + '; flex-basis: ' + safeBasis(i.basis) + '; order: ' + i.order + '; align-self: ' + i.self + '; }').join('\n') + '\n}';
  const code = output === 'html' ? html : output === 'tailwind' ? tailwind : output === 'scss' ? scss : css;
  async function copyCode() {
    try { await navigator.clipboard.writeText(code); setCopied(true); setCopyError(false); window.setTimeout(() => setCopied(false), 1600); }
    catch { setCopyError(true); }
  }
  const selection = (title: string, value: string, update: (s:string)=>void, values: string[]) => (
    <label className="block min-w-0 text-sm font-medium">{title}
      <select aria-label={title} className={field} value={value} onChange={e => { update(e.target.value); setPreset('default'); }}>
        {values.map(v => <option key={v} value={v}>{v}</option>)}
      </select>
    </label>
  );
  const numeric = (title: string, value: number, update: (n:number)=>void, max=80) => (
    <label className="block text-sm font-medium">{title} <span className="text-[var(--muted-foreground)]">{value}px</span>
      <input className="mt-2 w-full accent-indigo-600" aria-label={title} type="range" min="0" max={max} value={value} onChange={e => update(Number(e.target.value))}/>
    </label>
  );
  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 sm:p-6">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2"><h2 className="text-xl font-bold">Start with a Flexbox layout</h2><button className={button} onClick={() => applyPreset('default')}><RotateCcw className="mr-1 inline size-4"/> Reset</button></div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">{([['default','Blank layout'],['center','Center a div'],['nav','Navigation bar'],['cards','Responsive cards'],['stack','Vertical stack']] as [Preset,string][]).map(([key,label]) => <button key={key} type="button" onClick={() => applyPreset(key)} aria-pressed={preset===key} className={button + (preset===key ? ' border-indigo-500 bg-indigo-500/10 text-indigo-600' : '')}>{label}</button>)}</div>
      </section>
      <div className="grid min-w-0 gap-6 xl:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
        <section className="min-w-0 space-y-5 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 sm:p-6">
          <h2 className="flex items-center gap-2 text-xl font-bold"><Sliders className="size-5 text-indigo-600"/> Flex container controls</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {selection('Flex direction', direction, s=>setDirection(s as FlexDirection), opts.direction)}
            {selection('Justify content', justify, s=>setJustify(s as JustifyContent), opts.justify)}
            {selection('Align items', align, s=>setAlign(s as AlignItems), opts.align)}
            {selection('Flex wrap', wrap, s=>setWrap(s as FlexWrap), opts.wrap)}
            {selection('Align content', alignContent, setAlignContent, opts.content)}
          </div>
          {wrap === 'nowrap' && <p role="status" className="rounded-lg bg-amber-500/10 p-3 text-sm text-amber-700 dark:text-amber-300">Tip: align-content only affects layouts with multiple flex lines. Choose flex-wrap: wrap and allow items to form multiple lines to see its effect.</p>}
          <div className="grid gap-4 sm:grid-cols-2">
            {numeric('Row gap',rowGap,setRowGap)}
            {numeric('Column gap',columnGap,setColumnGap)}
            {numeric('Container padding',padding,setPadding)}
          </div>
          <div className="border-t border-[var(--border)] pt-4">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2"><h3 className="font-semibold">Individual flex item controls</h3><div className="flex gap-2"><button className={button} onClick={removeItem} disabled={items.length<=1} aria-label="Remove selected item"><Minus className="size-4"/></button><button className={button} onClick={addItem} disabled={items.length>=12} aria-label="Add flex item"><Plus className="size-4"/></button></div></div>
            <div className="mb-4 flex flex-wrap gap-2">{items.map(i => <button key={i.id} type="button" onClick={()=>setSelected(i.id)} aria-pressed={selected===i.id} className={button + (selected===i.id ? ' border-indigo-500 bg-indigo-500/10 text-indigo-600' : '')}>Item {i.id}</button>)}</div>
            {active && <div className="grid gap-3 sm:grid-cols-2">
              <label className="text-sm font-medium">Flex grow<input className={field} type="number" min="0" max="12" value={active.grow} onChange={e=>updateItem({grow:Math.max(0,Math.min(12,Number(e.target.value)||0))})}/></label>
              <label className="text-sm font-medium">Flex shrink<input className={field} type="number" min="0" max="12" value={active.shrink} onChange={e=>updateItem({shrink:Math.max(0,Math.min(12,Number(e.target.value)||0))})}/></label>
              <label className="text-sm font-medium">Flex basis <span className="text-xs text-[var(--muted-foreground)]">(auto, px, %, rem)</span><input className={field} value={active.basis} onChange={e=>updateItem({basis:e.target.value})} onBlur={()=>updateItem({basis:safeBasis(active.basis)})}/></label>
              <label className="text-sm font-medium">Order<input className={field} type="number" min="-12" max="12" value={active.order} onChange={e=>updateItem({order:Math.max(-12,Math.min(12,Number(e.target.value)||0))})}/></label>
              {selection('Align self',active.self,s=>updateItem({self:s}),opts.self)}
            </div>}
          </div>
        </section>
        <div className="min-w-0 space-y-6">
          <section className="min-w-0 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 sm:p-6">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3"><h2 className="flex items-center gap-2 text-xl font-bold"><Layout className="size-5 text-indigo-600"/> Live Flexbox preview</h2><div className="flex flex-wrap gap-1">{(['desktop','tablet','mobile'] as const).map(v=><button key={v} type="button" onClick={()=>setDevice(v)} aria-pressed={device===v} className={button + (device===v?' border-indigo-500 bg-indigo-500/10':'')}>{v}</button>)}</div></div>
            <p className="mb-3 text-xs text-[var(--muted-foreground)]">Preview width changes to simulate available space; settings remain the same. Click any item to edit its properties.</p>
            <div className="overflow-x-auto rounded-xl bg-slate-100 p-3 dark:bg-slate-900">
              <div className="mx-auto transition-[width] duration-200" style={{width:device==='desktop'?'100%':device==='tablet'?'75%':'min(100%, 320px)'}}>
                <div className="min-h-[300px] rounded-lg border-2 border-dashed border-indigo-400/40 bg-white dark:bg-slate-950" style={{...base.cssDeclarations, display:'flex', flexDirection:direction, justifyContent:justify, alignItems:align, flexWrap:wrap, alignContent:alignContent as React.CSSProperties['alignContent'], rowGap:rowGap+'px', columnGap:columnGap+'px', padding:padding+'px'}}>
                  {items.map(item=><button key={item.id} type="button" onClick={()=>setSelected(item.id)} aria-label={'Edit item '+item.id} className={'min-w-0 rounded-lg border p-2 text-xs font-semibold text-white shadow-sm ' + (item.id===selected?'border-yellow-300 ring-2 ring-yellow-300':'border-indigo-300')} style={{flexGrow:item.grow,flexShrink:item.shrink,flexBasis:safeBasis(item.basis),order:item.order,alignSelf:item.self as React.CSSProperties['alignSelf'],backgroundColor:item.id===selected?'#4338ca':'#6366f1',minHeight:'48px'}}>Item {item.id}</button>)}
                </div>
              </div>
            </div>
          </section>
          <section className="min-w-0 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 sm:p-6">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2"><h2 className="text-xl font-bold">Copy your layout code</h2><button type="button" onClick={copyCode} className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700">{copied?<Check className="size-4"/>:<Copy className="size-4"/>}{copied?'Copied':'Copy code'}</button></div>
            <div className="mb-3 flex flex-wrap gap-2">{(['css','html','tailwind','scss'] as Output[]).map(v=><button type="button" key={v} onClick={()=>setOutput(v)} aria-pressed={output===v} className={button+(output===v?' border-indigo-500 bg-indigo-500/10':'')}>{v==='tailwind'?'Tailwind':v.toUpperCase()}</button>)}</div>
            {copyError && <p role="alert" className="mb-2 text-sm text-red-600">Copy was blocked by your browser. Select and copy the text below manually.</p>}
            {output==='tailwind' && <p className="mb-2 text-xs text-[var(--muted-foreground)]">Uses Tailwind arbitrary-value utilities. Ensure these classes are included in files scanned by Tailwind at build time.</p>}
            <pre className="max-h-[430px] overflow-auto rounded-xl bg-slate-950 p-4 text-xs leading-relaxed text-indigo-200"><code>{code}</code></pre>
            <p className="mt-3 text-xs text-[var(--muted-foreground)]">For a working CSS example, copy both the HTML tab and CSS tab. The responsive preview changes viewport width only and does not automatically add media queries.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
