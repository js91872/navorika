'use client';
import { useMemo, useState } from 'react';
import JSZip from 'jszip';

type Format = 'code128' | 'code39' | 'ean13' | 'upca';
const CODE128 = ['212222','222122','222221','121223','121322','131222','122213','122312','132212','221213','221312','231212','112232','122132','122231','113222','123122','123221','223211','221132','221231','213212','223112','312131','311222','321122','321221','312212','322112','322211','212123','212321','232121','111323','131123','131321','112313','132113','132311','211313','231113','231311','112133','112331','132131','113123','113321','133121','313121','211331','231131','213113','213311','213131','311123','311321','331121','312113','312311','332111','314111','221411','431111','111224','111422','121124','121421','141122','141221','112214','112412','122114','122411','142112','142211','241211','221114','413111','241112','134111','111242','121142','121241','114212','124112','124211','411212','421112','421211','212141','214121','412121','111143','111341','131141','114113','114311','411113','411311','113141','114131','311141','411131','211412','211214','211232','2331112'];
const L = ['0001101','0011001','0010011','0111101','0100011','0110001','0101111','0111011','0110111','0001011'];
const G = ['0100111','0110011','0011011','0100001','0011101','0111001','0000101','0010001','0001001','0010111'];
const R = ['1110010','1100110','1101100','1000010','1011100','1001110','1010000','1000100','1001000','1110100'];
const PARITY = ['LLLLLL','LLGLGG','LLGGLG','LLGGGL','LGLLGG','LGGLLG','LGGGLL','LGLGLG','LGLGGL','LGGLGL'];
function checksum(digits: string) { let sum=0; for(let i=digits.length-1,weight=3;i>=0;i--,weight=weight===3?1:3) sum+=Number(digits[i])*weight; return String((10-sum%10)%10); }
function encode(value:string, format:Format):{bits:string;display:string} {
 if(format==='code128') {
  if(!value || value.length>120 || [...value].some(c=>c.charCodeAt(0)<32||c.charCodeAt(0)>126)) throw Error('Code 128 accepts 1–120 printable ASCII characters.');
  const symbols=[104,...[...value].map(c=>c.charCodeAt(0)-32)];let sum=104;
  symbols.slice(1).forEach((v,i)=>sum+=v*(i+1));
  symbols.push(sum%103,106);
  return {bits:symbols.map(n=>{const widths=CODE128[n];if(!widths)throw Error('Invalid Code 128 symbol.');return [...widths].map((w,i)=>(i%2===0?'1':'0').repeat(Number(w))).join('');}).join(''),display:value};
 }
 if(format==='code39') {
  if(!value || value.length>80 || !/^[0-9A-Z .\-$\/+%]+$/.test(value)) throw Error('Code 39 accepts uppercase A–Z, digits, spaces and - . $ / + %. (Maximum 80 characters.)');
  const chars='0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ-. $/+%*';
  const patterns=['nnnwwnwnn','wnnwnnnnw','nnwwnnnnw','wnwwnnnnn','nnnwwnnnw','wnnwwnnnn','nnwwwnnnn','nnnwnnwnw','wnnwnnwnn','nnwwnnwnn','wnnnnwnnw','nnwnnwnnw','wnwnnwnnn','nnnnwwnnw','wnnnwwnnn','nnwnwwnnn','nnnnnwwnw','wnnnnwwnn','nnwnnwwnn','nnnnwwwnn','wnnnnnnww','nnwnnnnww','wnwnnnnwn','nnnnwnnww','wnnnwnnwn','nnwnwnnwn','nnnnnnwww','wnnnnnwwn','nnwnnnwwn','nnnnwnwwn','wwnnnnnnw','nwwnnnnnw','wwwnnnnnn','nwnnwnnnw','wwnnwnnnn','nwwnwnnnn','nwnnnnwnw','nwnnwnwnn','nwnwnwnnn','nnnwnwnwn','nnnwnwnwn','nnnwnwnwn','nnnwnwnwn','nnnwnwnwn'];
  // Code 39 special characters use their standard patterns.
  const special:Record<string,string>={'-':'nwnnnnwnw','.':'wwnnnnnnw',' ':'nwwnnnnnw','$':'nwnwnwnnn','/':'nwnwnnnwn','+':'nwnnnwnwn','%':'nnnwnwnwn','*':'nwnnwnwnn'};
  const table:Record<string,string>={};
  '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').forEach((c,i)=>table[c]=patterns[i]);
  Object.assign(table,special);
  const bits=('*'+value+'*').split('').map(c=>[...table[c]].map((p,i)=>(i%2===0?'1':'0').repeat(p==='w'?3:1)).join('')).join('0');
  return {bits,display:value};
 }
 if(!/^\d+$/.test(value))throw Error('Enter digits only for retail barcodes.');
 if(format==='ean13') {
  if(value.length!==12&&value.length!==13)throw Error('EAN-13 needs 12 digits (or 13 including the check digit).');
  const full=value.length===12?value+checksum(value):value;
  if(checksum(full.slice(0,12))!==full[12])throw Error('Invalid EAN-13 check digit.');
  const bits='101'+[...full.slice(1,7)].map((c,i)=>(PARITY[Number(full[0])][i]==='L'?L:G)[Number(c)]).join('')+'01010'+[...full.slice(7)].map(c=>R[Number(c)]).join('')+'101';
  return {bits,display:full};
 }
 if(value.length!==11&&value.length!==12)throw Error('UPC-A needs 11 digits (or 12 including the check digit).');
 const full=value.length===11?value+checksum(value):value;
 if(checksum(full.slice(0,11))!==full[11])throw Error('Invalid UPC-A check digit.');
 return {bits:'101'+[...full.slice(0,6)].map(c=>L[Number(c)]).join('')+'01010'+[...full.slice(6)].map(c=>R[Number(c)]).join('')+'101',display:full};
}
function svgFor(value:string,format:Format,caption=true) {
 const {bits,display}=encode(value,format),unit=2,height=110,margin=20,w=bits.length*unit+margin*2;
 const rects=[...bits].map((b,i)=>b==='1'?'<rect x="'+(margin+i*unit)+'" y="12" width="'+unit+'" height="82"/>':'').join('');
 const label=caption?'<text x="'+w/2+'" y="109" text-anchor="middle" font-family="Arial,sans-serif" font-size="13">'+display.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')+'</text>':'';
 return '<svg xmlns="http://www.w3.org/2000/svg" width="'+w+'" height="'+height+'" viewBox="0 0 '+w+' '+height+'"><rect width="100%" height="100%" fill="white"/><g fill="black">'+rects+'</g>'+label+'</svg>';
}
function save(blob:Blob,name:string) {const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
function parseCSV(source:string) {
 const rows:string[][]=[];let row:string[]=[],cell='',quoted=false;
 for(let i=0;i<source.length;i++){const c=source[i];if(c==='"'){if(quoted&&source[i+1]==='"'){cell+='"';i++;}else quoted=!quoted;}else if(c===','&&!quoted){row.push(cell);cell='';}else if((c==='\n'||c==='\r')&&!quoted){if(c==='\r'&&source[i+1]==='\n')i++;row.push(cell);if(row.some(x=>x.trim()))rows.push(row);row=[];cell='';}else cell+=c;}
 if(quoted)throw Error('CSV contains an unclosed quoted field.');
 row.push(cell);if(row.some(x=>x.trim()))rows.push(row);
 return rows;
}
export default function BarcodeStudio() {
 const [format,setFormat]=useState<Format>('code128'),[value,setValue]=useState('NAVORIKA-001'),[bulk,setBulk]=useState(''),[error,setError]=useState(''),[busy,setBusy]=useState(false);
 const [showText,setShowText]=useState(true);
 const preview=useMemo(()=>{try{return {svg:svgFor(value,format,showText),error:''};}catch(e){return {svg:'',error:(e as Error).message};}},[value,format,showText]);
 const downloadSVG=()=>{if(preview.svg)save(new Blob([preview.svg],{type:'image/svg+xml'}),'navorika-barcode.svg');};
 const downloadPNG=()=>{if(!preview.svg)return;const img=new Image(),url=URL.createObjectURL(new Blob([preview.svg],{type:'image/svg+xml'}));img.onload=()=>{const canvas=document.createElement('canvas');canvas.width=img.width*2;canvas.height=img.height*2;const ctx=canvas.getContext('2d');if(ctx){ctx.scale(2,2);ctx.drawImage(img,0,0);canvas.toBlob(b=>{if(b)save(b,'navorika-barcode.png');},'image/png');}URL.revokeObjectURL(url);};img.onerror=()=>{setError('Could not export PNG.');URL.revokeObjectURL(url);};img.src=url;};
 const batch=async()=>{setError('');setBusy(true);try{
  const rows=parseCSV(bulk);if(!rows.length)throw Error('Paste CSV rows or upload a CSV file first.');
  if(rows.length>1000)throw Error('Maximum 1,000 rows per batch to protect browser performance.');
  const zip=new JSZip(),manifest=['row,value,status'];
  let valid=0;rows.forEach((r,i)=>{const v=(r[0]||'').trim();if(i===0&&/^(barcode|code|sku|value)$/i.test(v))return;try{zip.file('barcode-'+String(i+1).padStart(4,'0')+'.svg',svgFor(v,format,showText));manifest.push((i+1)+',"'+v.replace(/"/g,'""')+'",ok');valid++;}catch(e){manifest.push((i+1)+',"'+v.replace(/"/g,'""')+'","'+(e as Error).message.replace(/"/g,'""')+'"');}});
  if(!valid)throw Error('No valid barcodes found. Check the selected format and input values.');
  zip.file('results.csv',manifest.join('\n'));save(await zip.generateAsync({type:'blob'}),'navorika-barcodes.zip');
 }catch(e){setError((e as Error).message);}finally{setBusy(false);}};
 const field='w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-[var(--foreground)]';
 return <div className="space-y-7">
  <div className="grid gap-6 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 md:grid-cols-2 md:p-7">
   <div className="space-y-4">
    <div><label htmlFor="barcode-format" className="mb-2 block font-semibold">Barcode format</label><select id="barcode-format" className={field} value={format} onChange={e=>{const f=e.target.value as Format;setFormat(f);setValue(f==='ean13'?'590123412345':f==='upca'?'03600029145':f==='code39'?'NAVORIKA-001':'NAVORIKA-001');}}><option value="code128">Code 128</option><option value="code39">Code 39</option><option value="ean13">EAN-13</option><option value="upca">UPC-A</option></select></div>
    <div><label htmlFor="barcode-value" className="mb-2 block font-semibold">Barcode data</label><input id="barcode-value" className={field} value={value} maxLength={120} onChange={e=>setValue(e.target.value)} placeholder="Enter barcode value"/></div>
    <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={showText} onChange={e=>setShowText(e.target.checked)}/> Show readable text</label>
    <p className="text-sm text-[var(--muted-foreground)]">Generated entirely in your browser. Retail identifiers must be obtained from an authorized issuer such as GS1; this tool does not issue GTINs.</p>
   </div>
   <div className="flex min-h-56 flex-col items-center justify-center gap-4 rounded-xl border border-[var(--border)] bg-white p-4">
    {preview.svg?<img src={'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(preview.svg)} alt="Live barcode preview" className="max-h-40 max-w-full"/>:<p role="alert" className="text-sm text-red-700">{preview.error}</p>}
    <div className="flex flex-wrap justify-center gap-2"><button disabled={!preview.svg} onClick={downloadSVG} className="rounded-lg bg-red-600 px-4 py-2 font-semibold text-white disabled:opacity-40">Download SVG</button><button disabled={!preview.svg} onClick={downloadPNG} className="rounded-lg border border-red-600 px-4 py-2 font-semibold text-red-700 disabled:opacity-40">Download PNG</button></div>
   </div>
  </div>
  <section className="space-y-4 rounded-2xl border border-[var(--border)] p-5 md:p-7">
   <h2 className="text-2xl font-bold">Bulk barcode generator — free</h2>
   <p className="text-sm text-[var(--muted-foreground)]">Upload a CSV file or paste one barcode value per line. The first CSV column is used; an optional header named barcode, code, SKU or value is skipped. Export up to 1,000 barcodes as SVG files in a ZIP, with a results report. No upload to our server.</p>
   <input aria-label="Upload barcode CSV" type="file" accept=".csv,text/csv,text/plain" onChange={async e=>{const f=e.target.files?.[0];if(!f)return;if(f.size>1024*1024){setError('CSV must be smaller than 1 MB.');return;}setBulk(await f.text());setError('');}}/>
   <label htmlFor="bulk-values" className="block font-semibold">CSV or barcode list</label>
   <textarea id="bulk-values" rows={6} className={field} value={bulk} onChange={e=>setBulk(e.target.value)} placeholder={'barcode\nITEM-001\nITEM-002\nITEM-003'}/>
   {error&&<p role="alert" className="text-sm font-semibold text-red-700">{error}</p>}
   <button disabled={busy||!bulk.trim()} onClick={batch} className="rounded-xl bg-red-600 px-6 py-3 font-bold text-white disabled:opacity-40">{busy?'Preparing ZIP…':'Generate & download ZIP'}</button>
  </section>
 </div>;
}
