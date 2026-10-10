'use client';
import { useState } from 'react';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { toBlobURL } from '@ffmpeg/util';
type Mode='avif-to-png'|'svg-to-ico'|'webp-to-gif'|'heic-to-pdf'|'markdown-to-pdf'|'xml-to-csv';
const config:Record<Mode,{ext:string;accept:string;output:string}>={
'avif-to-png':{ext:'AVIF',accept:'.avif,image/avif',output:'png'},
'svg-to-ico':{ext:'SVG',accept:'.svg,image/svg+xml',output:'ico'},
'webp-to-gif':{ext:'WebP',accept:'.webp,image/webp',output:'gif'},
'heic-to-pdf':{ext:'HEIC',accept:'.heic,.heif,image/heic,image/heif',output:'pdf'},
'markdown-to-pdf':{ext:'Markdown',accept:'.md,.markdown,.txt,text/plain',output:'pdf'},
'xml-to-csv':{ext:'XML',accept:'.xml,application/xml,text/xml',output:'csv'}};
function csvField(s:string){return /[",\r\n]/.test(s)?'"'+s.replace(/"/g,'""')+'"':s;}
function xmlCsv(s:string){
 const xml=new DOMParser().parseFromString(s,'application/xml');
 if(xml.querySelector('parsererror'))throw Error('Invalid XML input');
 const els=Array.from(xml.documentElement.children);
 if(!els.length)throw Error('XML must contain record elements.');
 const group=new Map<string,Element[]>();
 els.forEach(x=>group.set(x.tagName,[...(group.get(x.tagName)||[]),x]));
 const records=Array.from(group.values()).sort((a,b)=>b.length-a.length)[0];
 const fields=new Set<string>();
 const data=records.map(r=>{const row:Record<string,string>={};for(const child of Array.from(r.children)){if(child.children.length)throw Error('Nested records cannot be flattened safely.');if(child.tagName in row)throw Error('Duplicate field '+child.tagName);fields.add(child.tagName);row[child.tagName]=child.textContent||'';}return row;});
 const cols=Array.from(fields);if(!cols.length)throw Error('No XML fields found.');
 return [cols.map(csvField).join(','),...data.map(r=>cols.map(k=>csvField(r[k]||'')).join(','))].join('\r\n')+'\r\n';
}
async function renderImage(file:File,mode:Mode):Promise<Blob>{
 let source:Blob=file;
 if(mode==='heic-to-pdf'){
  const heic=(await import('heic2any')).default;
  const converted=await heic({blob:file,toType:'image/png'});
  source=Array.isArray(converted)?converted[0]:converted;
 }
 const url=URL.createObjectURL(source);
 try{
  const img=new Image();img.src=url;await img.decode();
  if(img.naturalWidth*img.naturalHeight>25000000)throw Error('Maximum 25 megapixels.');
  const icon=mode==='svg-to-ico',width=icon?64:img.naturalWidth,height=icon?64:img.naturalHeight;
  const c=document.createElement('canvas');c.width=width;c.height=height;
  const ctx=c.getContext('2d');if(!ctx)throw Error('Canvas unavailable.');
  if(icon){const k=Math.min(width/img.naturalWidth,height/img.naturalHeight),w=img.naturalWidth*k,h=img.naturalHeight*k;ctx.drawImage(img,(width-w)/2,(height-h)/2,w,h);}
  else ctx.drawImage(img,0,0);
  const png=await new Promise<Blob>((yes,no)=>c.toBlob(b=>b?yes(b):no(Error('PNG conversion failed.')),'image/png'));
  if(icon){
   const bytes=new Uint8Array(await png.arrayBuffer()),header=new Uint8Array(22),v=new DataView(header.buffer);
   v.setUint16(2,1,true);header[6]=64;header[7]=64;v.setUint16(10,1,true);v.setUint16(12,32,true);v.setUint32(14,bytes.length,true);v.setUint32(18,22,true);
   return new Blob([header,bytes],{type:'image/x-icon'});
  }
  if(mode==='heic-to-pdf'){
   const pdf=await PDFDocument.create(),embedded=await pdf.embedPng(await png.arrayBuffer());
   const page=pdf.addPage([embedded.width,embedded.height]);page.drawImage(embedded,{x:0,y:0,width:embedded.width,height:embedded.height});
   return new Blob([new Uint8Array(await pdf.save())],{type:'application/pdf'});
  }
  return png;
 }finally{URL.revokeObjectURL(url);}
}
async function gif(file:File):Promise<Blob>{
 const {FFmpeg}=await import('@ffmpeg/ffmpeg');const engine=new FFmpeg();
 const base='https://unpkg.com/@ffmpeg/core@0.12.10/dist/umd';
 await engine.load({coreURL:await toBlobURL(base+'/ffmpeg-core.js','text/javascript'),wasmURL:await toBlobURL(base+'/ffmpeg-core.wasm','application/wasm')});
 try{
  await engine.writeFile('input.webp',new Uint8Array(await file.arrayBuffer()));
  const result=await engine.exec(['-i','input.webp','-vf','fps=12,scale=480:-1:flags=lanczos','-loop','0','output.gif']);
  if(result!==0)throw Error('GIF encoding failed or this WebP animation is unsupported.');
  const bytes=await engine.readFile('output.gif');if(typeof bytes==='string')throw Error('Unexpected GIF output.');
  return new Blob([new Uint8Array(bytes)],{type:'image/gif'});
 }finally{engine.terminate();}
}
async function markdown(input:string):Promise<Blob>{
 const pdf=await PDFDocument.create(),regular=await pdf.embedFont(StandardFonts.Helvetica),bold=await pdf.embedFont(StandardFonts.HelveticaBold);
 let page=pdf.addPage([595,842]),y=790;
 for(const raw of input.split(/\r?\n/)){
  const heading=/^#{1,5}\s/.test(raw),size=heading?16:11;
  let remaining=raw.replace(/^#{1,5}\s/,'').replace(/\*\*|__/g,'').replace(/[^\x20-\x7e\u00a0-\u00ff]/g,'?');
  if(!remaining){y-=10;continue;}
  while(remaining.length){
   let part=remaining.slice(0,heading?52:84);
   if(remaining.length>part.length){const j=part.lastIndexOf(' ');if(j>25)part=part.slice(0,j);}
   if(y<55){page=pdf.addPage([595,842]);y=790;}
   page.drawText(part,{x:40,y,size,font:heading?bold:regular,color:rgb(0.1,0.15,0.25)});y-=size*1.6;
   remaining=remaining.slice(part.length).trimStart();
  }
 }
 return new Blob([new Uint8Array(await pdf.save())],{type:'application/pdf'});
}
export default function NewConverter({mode}:{mode:Mode}){
 const info=config[mode];const [file,setFile]=useState<File|null>(null),[text,setText]=useState(''),[busy,setBusy]=useState(false),[error,setError]=useState('');
 const typed=mode==='markdown-to-pdf'||mode==='xml-to-csv';
 async function convert(){
  setBusy(true);setError('');
  try{
   if(file&&file.size>15000000)throw Error('File must be smaller than 15 MB.');
   let out:Blob;
   if(mode==='webp-to-gif'){if(!file)throw Error('Select a file.');out=await gif(file);}
   else if(mode==='markdown-to-pdf')out=await markdown(text||await file!.text());
   else if(mode==='xml-to-csv')out=new Blob([xmlCsv(text||await file!.text())],{type:'text/csv;charset=utf-8'});
   else {if(!file)throw Error('Select a file.');out=await renderImage(file,mode);}
   const url=URL.createObjectURL(out),a=document.createElement('a');a.href=url;a.download=(file?.name.replace(/\.[^.]+$/,'')||'converted')+'.'+info.output;a.click();setTimeout(()=>URL.revokeObjectURL(url),1500);
  }catch(e){setError(e instanceof Error?e.message:'Conversion failed.');}finally{setBusy(false);}
 }
 return <section className="space-y-5 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 sm:p-8">
  <label className="inline-flex cursor-pointer rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 focus-within:ring-2 focus-within:ring-blue-400">
   <input type="file" className="sr-only" accept={info.accept} onChange={e=>{setFile(e.target.files?.[0]||null);setText('');setError('');}}/>Upload {info.ext} File
  </label>
  <p aria-live="polite" className="break-all text-sm text-[var(--muted-foreground)]">{file?'Selected: '+file.name:'No file selected (15 MB maximum)'}</p>
  {typed&&<><label htmlFor="paste-content" className="block font-semibold">Or paste your {info.ext} content</label><textarea id="paste-content" value={text} onChange={e=>setText(e.target.value)} rows={8} className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] p-3 font-mono text-sm"/></>}
  {mode==='markdown-to-pdf'&&<p className="text-sm text-[var(--muted-foreground)]">Basic headings and text only; complex tables and images are not supported in this lightweight export.</p>}
  {mode==='xml-to-csv'&&<p className="text-sm text-[var(--muted-foreground)]">Supports flat repeated XML records. Nested objects require a separate mapping process.</p>}
  {mode==='webp-to-gif'&&<p className="text-sm text-[var(--muted-foreground)]">Preserves multiple frames where supported. GIF conversion loads a browser-based encoder on first use and may take time.</p>}
  {error&&<p role="alert" className="text-red-600">{error}</p>}
  <button type="button" disabled={busy||(!file&&!text.trim())||(!!file&&file.size>15000000)} onClick={convert} className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white disabled:opacity-50">{busy?'Converting…':'Download '+info.output.toUpperCase()}</button>
  <p className="text-xs text-[var(--muted-foreground)]">Your file is processed in your browser, not uploaded to Navorika.</p>
 </section>;
}