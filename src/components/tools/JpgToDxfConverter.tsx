'use client';
import {useEffect,useRef,useState} from 'react';

type Point=[number,number];
type Trace={paths:Point[][],width:number,height:number};
function simplify(points:Point[],tolerance:number):Point[]{
  if(points.length<5||tolerance<=0)return points;
  const closed=points[0][0]===points[points.length-1][0]&&points[0][1]===points[points.length-1][1];
  const arr=closed?points.slice(0,-1):points;
  const output:Point[]=[];
  for(let i=0;i<arr.length;i++){
    const a=arr[(i+arr.length-1)%arr.length], b=arr[i],c=arr[(i+1)%arr.length];
    const cross=Math.abs((b[0]-a[0])*(c[1]-b[1])-(b[1]-a[1])*(c[0]-b[0]));
    if(cross>0.00001)output.push(b);
  }
  if(output.length<3)return points;
  const reduced:Point[]=[output[0]];
  for(let i=1;i<output.length;i++){
    const p=output[i],prev=reduced[reduced.length-1];
    if(Math.hypot(p[0]-prev[0],p[1]-prev[1])>=tolerance)reduced.push(p);
  }
  return reduced.length>=3?[...reduced,reduced[0]]:points;
}
function trace(data:Uint8ClampedArray,width:number,height:number,threshold:number,invert:boolean,minArea:number,smoothing:number):Trace{
  const mask=new Uint8Array(width*height);
  for(let i=0;i<mask.length;i++){
    const j=i*4;
    const gray=(data[j]*0.2126+data[j+1]*0.7152+data[j+2]*0.0722)*data[j+3]/255+255*(1-data[j+3]/255);
    mask[i]=(invert?gray>threshold:gray<threshold)?1:0;
  }
  const edges=new Map<string,Point[]>();
  function key(x:number,y:number){return x+','+y}
  function edge(x:number,y:number,nx:number,ny:number){const k=key(x,y);const list=edges.get(k)||[];list.push([nx,ny]);edges.set(k,list)}
  const inside=(x:number,y:number)=>x>=0&&y>=0&&x<width&&y<height&&mask[y*width+x]===1;
  for(let y=0;y<height;y++)for(let x=0;x<width;x++)if(inside(x,y)){
    if(!inside(x,y-1))edge(x,y,x+1,y);
    if(!inside(x+1,y))edge(x+1,y,x+1,y+1);
    if(!inside(x,y+1))edge(x+1,y+1,x,y+1);
    if(!inside(x-1,y))edge(x,y+1,x,y);
  }
  const paths:Point[][]=[];let inspected=0;
  while(edges.size){
    const first=edges.keys().next().value as string;
    const start=first.split(',').map(Number) as Point;
    const points:Point[]=[start];let current=start;let steps=0;
    while(steps++<width*height*4+4){
      const k=key(current[0],current[1]),next=edges.get(k);
      if(!next||!next.length)break;
      const dest=next.pop()!;if(!next.length)edges.delete(k);
      points.push(dest);current=dest;
      if(current[0]===start[0]&&current[1]===start[1])break;
    }
    if(points.length>=4&&current[0]===start[0]&&current[1]===start[1]){
      let area=0;for(let i=0;i<points.length-1;i++)area+=points[i][0]*points[i+1][1]-points[i+1][0]*points[i][1];
      if(Math.abs(area)/2>=minArea){paths.push(simplify(points,smoothing));}
    }
    if(++inspected>30000)throw Error('Too many separate contours. Increase minimum area or use a simpler image.');
  }
  if(!paths.length)throw Error('No usable contours found. Try another threshold or a high-contrast logo or sketch.');
  return {paths,width,height};
}
function dxf(trace:Trace,widthMm:number){
  const scale=widthMm/trace.width;
  const lines=['0','SECTION','2','HEADER','9','$ACADVER','1','AC1015','9','$INSUNITS','70','4','0','ENDSEC','0','SECTION','2','ENTITIES'];
  for(const path of trace.paths){
    const pts=path.slice(0,-1);if(pts.length<3)continue;
    lines.push('0','LWPOLYLINE','8','TRACE','90',String(pts.length),'70','1');
    for(const p of pts)lines.push('10',(p[0]*scale).toFixed(5),'20',((trace.height-p[1])*scale).toFixed(5));
  }
  lines.push('0','ENDSEC','0','EOF');return lines.join('\n')+'\n';
}
export default function JpgToDxfConverter(){
  const canvas=useRef<HTMLCanvasElement>(null);
  const [file,setFile]=useState<File|null>(null),[threshold,setThreshold]=useState(160),[invert,setInvert]=useState(false);
  const [minArea,setMinArea]=useState(12),[smoothing,setSmoothing]=useState(1.5),[widthMm,setWidthMm]=useState(100);
  const [paths,setPaths]=useState<Point[][]>([]),[dimensions,setDimensions]=useState<[number,number]>([0,0]);
  const [error,setError]=useState(''),[busy,setBusy]=useState(false);
  useEffect(()=>{
    if(!file)return;
    let cancelled=false;const url=URL.createObjectURL(file);const img=new Image();
    img.onload=()=>{
      if(cancelled)return;
      try{
        const max=640,scale=Math.min(1,max/Math.max(img.naturalWidth,img.naturalHeight));
        const w=Math.max(1,Math.round(img.naturalWidth*scale)),h=Math.max(1,Math.round(img.naturalHeight*scale));
        const c=canvas.current;if(!c)return;c.width=w;c.height=h;
        const ctx=c.getContext('2d',{willReadFrequently:true});if(!ctx)throw Error('Canvas processing is unavailable.');
        ctx.fillStyle='#fff';ctx.fillRect(0,0,w,h);ctx.drawImage(img,0,0,w,h);
        setDimensions([w,h]);setError('');
      }catch(e){setError(e instanceof Error?e.message:'Could not read the image.')}
    };
    img.onerror=()=>!cancelled&&setError('Image could not be decoded.');
    img.src=url;return()=>{cancelled=true;URL.revokeObjectURL(url)};
  },[file]);
  useEffect(()=>{
    const c=canvas.current;if(!c||!file||!dimensions[0])return;
    try{const ctx=c.getContext('2d',{willReadFrequently:true});if(!ctx)return;
      const result=trace(ctx.getImageData(0,0,c.width,c.height).data,c.width,c.height,threshold,invert,minArea,smoothing);
      setPaths(result.paths);setError('');
    }catch(e){setPaths([]);setError(e instanceof Error?e.message:'Tracing failed.')}
  },[file,dimensions,threshold,invert,minArea,smoothing]);
  function choose(f?:File){if(!f)return;setPaths([]);setDimensions([0,0]);setError('');
    if(!['image/jpeg','image/png','image/webp'].includes(f.type)){setError('Choose a JPG, JPEG, PNG or WebP image.');setFile(null);return;}
    if(f.size>15*1024*1024){setError('Maximum image size is 15 MB.');setFile(null);return;}setFile(f);
  }
  function download(){
    if(!paths.length||widthMm<=0||!Number.isFinite(widthMm))return;setBusy(true);
    try{const content=dxf({paths,width:dimensions[0],height:dimensions[1]},widthMm);
      const url=URL.createObjectURL(new Blob([content],{type:'application/dxf'}));
      const link=document.createElement('a');link.href=url;link.download=(file?.name.replace(/\.[^.]+$/, '')||'navorika-trace')+'.dxf';link.click();
      window.setTimeout(()=>URL.revokeObjectURL(url),2000);
    }catch(e){setError(e instanceof Error?e.message:'Could not create DXF.')}finally{setBusy(false)}
  }
  return <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 text-slate-900 shadow-sm sm:p-8">
    <label className="block font-semibold">Upload an image (JPG, JPEG, PNG or WebP; maximum 15 MB)
      <input type="file" accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp" className="mt-3 block w-full rounded-lg border p-3" onChange={e=>choose(e.target.files?.[0])}/>
    </label>
    <p className="mt-2 text-sm text-slate-600">Images are processed in your browser, not uploaded. Best for black-and-white logos, silhouettes, symbols and line art.</p>
    <div className="mt-6 grid gap-5 md:grid-cols-2">
      <label className="font-medium">Tracing threshold: {threshold}<input className="mt-2 w-full" type="range" min="25" max="245" value={threshold} onChange={e=>setThreshold(Number(e.target.value))}/></label>
      <label className="font-medium">Minimum contour area (pixels)<input type="number" min="0" max="10000" value={minArea} onChange={e=>setMinArea(Math.max(0,Number(e.target.value)||0))} className="mt-2 w-full rounded-lg border p-2"/></label>
      <label className="font-medium">Point reduction (pixels)<input type="number" step="0.5" min="0" max="20" value={smoothing} onChange={e=>setSmoothing(Math.max(0,Number(e.target.value)||0))} className="mt-2 w-full rounded-lg border p-2"/></label>
      <label className="font-medium">Output width (mm)<input type="number" min="1" max="100000" value={widthMm} onChange={e=>setWidthMm(Number(e.target.value))} className="mt-2 w-full rounded-lg border p-2"/></label>
    </div>
    <label className="mt-5 flex items-center gap-2"><input type="checkbox" checked={invert} onChange={e=>setInvert(e.target.checked)}/> Trace light shapes on a dark background</label>
    <canvas ref={canvas} className="hidden"/>
    {error&&<p role="alert" className="mt-4 rounded-lg bg-red-50 p-3 text-red-700">{error}</p>}
    {file&&dimensions[0]>0&&<div className="mt-6 rounded-xl border bg-slate-50 p-4">
      <p className="font-semibold">Live vector outline preview</p>
      <p className="text-sm text-slate-600">{dimensions[0]} × {dimensions[1]} processing pixels · {paths.length.toLocaleString()} contours · approximate height {(widthMm*dimensions[1]/dimensions[0]).toFixed(1)} mm</p>
      <svg viewBox={'0 0 '+dimensions[0]+' '+dimensions[1]} className="mt-3 h-auto max-h-[420px] w-full rounded border bg-white" role="img" aria-label="Traced vector contour preview">
        {paths.map((path,i)=><polyline key={i} points={path.map(p=>p.join(',')).join(' ')} fill="none" stroke="#1755c4" strokeWidth={Math.max(0.65,dimensions[0]/900)} />)}
      </svg>
      <p className="mt-3 text-sm text-slate-600">The DXF contains closed 2D polylines. They are traced outlines, not recognized engineering dimensions or CAD features. Inspect scale and paths in CAD/CAM before manufacturing.</p>
    </div>}
    <button type="button" onClick={download} disabled={!paths.length||busy||widthMm<=0||!Number.isFinite(widthMm)} className="mt-6 rounded-xl bg-blue-700 px-6 py-3 font-bold text-white disabled:cursor-not-allowed disabled:opacity-40">{busy?'Preparing DXF…':'Download DXF — Free'}</button>
  </section>;
}
