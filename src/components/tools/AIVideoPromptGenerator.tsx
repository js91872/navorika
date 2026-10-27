'use client';
import {useMemo,useState} from 'react';

const formats=['YouTube Short','TikTok / Instagram Reel','YouTube landscape video','Product advertisement','Educational explainer','Cinematic scene'];
const styles=['Cinematic realistic','Documentary','3D animation','Illustrated animation','Minimal product studio','Lifestyle'];
const cameras=['Slow tracking shot','Static tripod','Smooth pan','Slow zoom','Aerial / drone-style','Handheld documentary'];
const lights=['Golden hour','Soft daylight','Studio softbox','Moody low key','Neon night','Overcast natural'];
const modes=['Text to video','Image to video'] as const;
export default function AIVideoPromptGenerator(){
 const [mode,setMode]=useState<(typeof modes)[number]>('Text to video');
 const [topic,setTopic]=useState('A cozy cabin beside a mountain lake at sunrise');
 const [image,setImage]=useState('A photograph of a wooden cabin reflected in a calm lake');
 const [format,setFormat]=useState(formats[0]);
 const [style,setStyle]=useState(styles[0]);
 const [camera,setCamera]=useState(cameras[0]);
 const [lighting,setLighting]=useState(lights[0]);
 const [duration,setDuration]=useState('15');
 const [aspect,setAspect]=useState('9:16');
 const [voice,setVoice]=useState(false);
 const [captions,setCaptions]=useState(false);
 const [negative,setNegative]=useState('Flicker, distorted anatomy, inconsistent objects, unreadable text, sudden cuts');
 const [copied,setCopied]=useState(false);
 const prompt=useMemo(()=>[
   'VIDEO GENERATION BRIEF',
   'Mode: '+mode,
   'Format: '+format,
   'Length target: '+duration+' seconds (adjust to your generator\'s supported duration)',
   'Frame: '+aspect,
   mode==='Image to video'?'Use the supplied reference image as the first-frame visual anchor: '+image:'Scene description: '+topic,
   mode==='Image to video'?'Animate the original scene naturally; preserve major objects, composition and identity. Motion goal: '+topic:'Create a coherent visual narrative around: '+topic,
   'Art direction: '+style+'. Lighting: '+lighting+'.',
   'Camera: '+camera+'. Favor physically plausible motion, consistent framing and subject continuity.',
   'Plan the sequence with a clear opening, visual development and satisfying final shot. Use transitions only when needed.',
   voice?'Add a concise voiceover script with timestamps that fits the duration.':'No voiceover required.',
   captions?'Include short readable captions in a separate editing script, rather than relying on generated in-frame text.':'Avoid unnecessary on-screen text.',
   negative.trim()?'Avoid: '+negative.trim():null,
   'OUTPUT: Provide (1) a single copy-ready text-to-video prompt, (2) a timed shot list, and (3) optional editor notes. Do not claim a video was rendered.'
 ].filter(Boolean).join('\n'),[mode,topic,image,format,style,camera,lighting,duration,aspect,voice,captions,negative]);
 const select=(label:string,value:string,update:(s:string)=>void,items:string[])=> <label className="block text-sm font-semibold text-slate-800">{label}<select className="mt-2 w-full rounded-lg border border-slate-300 bg-white p-3 text-slate-900" value={value} onChange={e=>{update(e.target.value);setCopied(false);}}>{items.map(item=><option key={item} value={item}>{item}</option>)}</select></label>;
 return <section aria-label="AI video prompt generator" className="my-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
 <h2 className="text-2xl font-bold text-slate-900">Build your AI video prompt</h2>
 <p className="mt-2 text-slate-600">Free, private, browser-only prompt builder. It creates a text prompt—not a video. No account or API key needed.</p>
 <div className="mt-5 grid gap-4 sm:grid-cols-2">
 {select('Input type',mode,v=>setMode(v as (typeof modes)[number]),[...modes])}
 {select('Video format',format,setFormat,formats)}
 <label className="sm:col-span-2 block text-sm font-semibold text-slate-800">{mode==='Image to video'?'Describe the scene and motion you want':'Describe your video idea'}<textarea value={topic} onChange={e=>{setTopic(e.target.value);setCopied(false);}} rows={3} maxLength={1200} className="mt-2 w-full rounded-lg border border-slate-300 p-3 font-normal text-slate-900" placeholder="Describe the subject, action and setting"/></label>
 {mode==='Image to video'&&<label className="sm:col-span-2 block text-sm font-semibold text-slate-800">Describe the reference image (upload the image separately in your video platform)<textarea value={image} onChange={e=>setImage(e.target.value)} maxLength={1000} rows={2} className="mt-2 w-full rounded-lg border border-slate-300 p-3 font-normal text-slate-900"/></label>}
 {select('Style',style,setStyle,styles)}
 {select('Camera movement',camera,setCamera,cameras)}
 {select('Lighting',lighting,setLighting,lights)}
 {select('Duration target',duration,setDuration,['5','10','15','30','60'])}
 {select('Aspect ratio',aspect,setAspect,['9:16','16:9','1:1','4:5'])}
 <fieldset className="rounded-lg border border-slate-200 p-3"><legend className="px-1 text-sm font-semibold">Optional elements</legend><label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={voice} onChange={e=>setVoice(e.target.checked)}/>Voiceover script</label><label className="mt-2 flex items-center gap-2 text-sm"><input type="checkbox" checked={captions} onChange={e=>setCaptions(e.target.checked)}/>Caption editing notes</label></fieldset>
 <label className="sm:col-span-2 block text-sm font-semibold">Things to avoid<textarea rows={2} maxLength={1000} value={negative} onChange={e=>setNegative(e.target.value)} className="mt-2 w-full rounded-lg border border-slate-300 p-3 font-normal text-slate-900"/></label>
 </div>
 <div className="mt-6"><label htmlFor="generated-ai-video-prompt" className="block text-lg font-bold">Your generated prompt</label><textarea id="generated-ai-video-prompt" readOnly value={prompt} rows={16} className="mt-2 w-full rounded-xl border border-slate-300 bg-slate-50 p-4 font-mono text-sm text-slate-800" aria-live="polite"/></div>
 <div className="mt-4 flex flex-wrap gap-3"><button type="button" onClick={async()=>{try{await navigator.clipboard.writeText(prompt);setCopied(true);}catch{setCopied(false);}}} className="rounded-xl bg-emerald-700 px-5 py-3 font-bold text-white hover:bg-emerald-800">{copied?'Copied!':'Copy prompt'}</button><button type="button" className="rounded-xl border border-slate-300 px-5 py-3 font-semibold hover:bg-slate-100" onClick={()=>{setTopic('A cozy cabin beside a mountain lake at sunrise');setMode('Text to video');setFormat(formats[0]);setStyle(styles[0]);setCamera(cameras[0]);setLighting(lights[0]);setDuration('15');setAspect('9:16');setVoice(false);setCaptions(false);setCopied(false);}}>Reset example</button></div>
 <p className="mt-4 text-sm text-slate-600">Tip: Paste this brief into ChatGPT for a refined shot-by-shot prompt, or adapt it for your video generation service. Video quality, duration and aspect-ratio availability vary by provider. Avoid uploading images without the necessary rights and consent.</p>
 </section>;
}