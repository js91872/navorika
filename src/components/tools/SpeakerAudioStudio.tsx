'use client';
import {useEffect,useRef,useState} from 'react';
import {Play,Square,Volume2,AudioLines,Droplets,Activity,Headphones,SlidersHorizontal} from 'lucide-react';

const modes=[
 {id:'pulse',name:'Deep Pulse',sub:'165 Hz low-frequency tone',icon:Droplets},
 {id:'sweep',name:'Frequency Sweep',sub:'200–2,000 Hz listening sweep',icon:AudioLines},
 {id:'rhythm',name:'Rhythmic Pulse',sub:'Short low-frequency bursts',icon:Activity},
 {id:'test',name:'Sound Check',sub:'Alternating diagnostic tones',icon:Headphones}
] as const;
type Mode=typeof modes[number]['id'];
export default function SpeakerAudioStudio(){
 const [mode,setMode]=useState<Mode>('pulse'),[duration,setDuration]=useState(30),[volume,setVolume]=useState(25),[playing,setPlaying]=useState(false),[remaining,setRemaining]=useState(30),[error,setError]=useState('');
 const ctx=useRef<AudioContext|null>(null),osc=useRef<OscillatorNode|null>(null),gain=useRef<GainNode|null>(null),timer=useRef<ReturnType<typeof setInterval>|null>(null),started=useRef(0);
 function stop(){if(timer.current)clearInterval(timer.current);timer.current=null;try{osc.current?.stop()}catch{}osc.current?.disconnect();gain.current?.disconnect();osc.current=null;gain.current=null;if(ctx.current){void ctx.current.close();ctx.current=null}setPlaying(false)}
 useEffect(()=>()=>{if(timer.current)clearInterval(timer.current);try{osc.current?.stop()}catch{}void ctx.current?.close()},[]);
 async function start(){
 stop();setError('');
 try{
 const audio=new AudioContext();ctx.current=audio;await audio.resume();
 const o=audio.createOscillator(),g=audio.createGain();osc.current=o;gain.current=g;
 o.type='sine';o.frequency.setValueAtTime(mode==='pulse'||mode==='rhythm'?165:mode==='sweep'?200:440,audio.currentTime);
 g.gain.setValueAtTime(0,audio.currentTime);g.gain.linearRampToValueAtTime(volume/100*0.22,audio.currentTime+0.08);
 o.connect(g);g.connect(audio.destination);o.start();started.current=Date.now();setRemaining(duration);setPlaying(true);
 timer.current=setInterval(()=>{
 const elapsed=(Date.now()-started.current)/1000, left=Math.max(0,Math.ceil(duration-elapsed));setRemaining(left);
 if(left<=0){stop();return}
 const t=audio.currentTime;
 if(mode==='sweep')o.frequency.setTargetAtTime(200+(elapsed%4)/4*1800,t,0.035);
 if(mode==='test')o.frequency.setTargetAtTime([250,500,1000,2000][Math.floor(elapsed)%4],t,0.03);
 if(mode==='rhythm')g.gain.setTargetAtTime(Math.floor(elapsed*3)%2===0?volume/100*0.22:0,t,0.025);
 },75);
 }catch{stop();setError('Audio could not start. Check browser permissions and try again.')}
 }
 return <section className="overflow-hidden rounded-[28px] border border-zinc-700 bg-[#191b1f] text-white shadow-2xl" aria-label="Speaker cleaning audio studio">
 <div className="border-b border-zinc-700 bg-gradient-to-b from-[#35373b] to-[#24262a] px-5 py-5 sm:px-8"><div className="flex items-center gap-3"><div className="rounded-xl border border-red-700 bg-[#161719] p-3 text-red-500"><Volume2/></div><div><p className="text-xs font-bold tracking-[.22em] text-red-400">NAVORIKA AUDIO LAB</p><h2 className="text-xl font-bold">Speaker Cleaning Studio</h2></div></div></div>
 <div className="grid gap-6 p-5 sm:p-8 lg:grid-cols-[1fr_1.05fr]">
 <div className="rounded-2xl border border-zinc-700 bg-[#111315] p-6 text-center"><div className="mx-auto flex h-44 w-44 items-center justify-center rounded-full border-[12px] border-[#34373b] bg-[radial-gradient(circle,#292b30_0%,#101114_65%)] shadow-[inset_0_0_0_3px_#555,0_15px_35px_#0009]"><div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-red-900 bg-[#202124] shadow-[0_0_35px_#b91c1c44]"><Volume2 size={45} className="text-red-500"/></div></div><p className="mt-6 text-sm uppercase tracking-widest text-zinc-400">{playing?'Audio playing':'Ready to play'}</p><div className="mt-3 flex h-14 items-center justify-center gap-1" aria-hidden="true">{Array.from({length:35},(_,i)=><span key={i} className={playing?'animate-pulse':''} style={{height:playing?8+Math.abs(Math.sin(i*0.77))*37:5+Math.abs(Math.sin(i*.7))*12,animationDelay:i*27+'ms'}}><span className="block h-full w-1 rounded bg-gradient-to-t from-red-800 to-red-400"/></span>)}</div><p className="font-mono text-3xl tabular-nums">{remaining}s</p></div>
 <div><h3 className="mb-3 flex items-center gap-2 font-semibold"><SlidersHorizontal size={18} className="text-red-500"/> Select sound mode</h3><div className="grid grid-cols-2 gap-3">{modes.map(m=><button key={m.id} type="button" disabled={playing} onClick={()=>setMode(m.id)} aria-pressed={mode===m.id} className={'min-h-28 rounded-xl border p-3 text-left transition focus-visible:outline-2 focus-visible:outline-red-400 '+(mode===m.id?'border-red-500 bg-[#3a2023] shadow-[inset_0_2px_8px_#0009]':'border-zinc-600 bg-gradient-to-b from-[#414348] to-[#282a2e] hover:border-zinc-400')}><m.icon size={23} className={mode===m.id?'text-red-400':'text-zinc-300'}/><span className="mt-3 block text-sm font-bold">{m.name}</span><span className="mt-1 block text-xs text-zinc-300">{m.sub}</span></button>)}</div>
 <div className="mt-6"><label htmlFor="speaker-volume" className="flex justify-between text-sm font-medium"><span>Output level</span><span>{volume}%</span></label><input id="speaker-volume" type="range" min="5" max="50" step="5" value={volume} onChange={e=>setVolume(Number(e.target.value))} disabled={playing} className="mt-3 w-full accent-red-500"/><p className="text-xs text-zinc-400">Begin quietly. Your device volume also affects loudness.</p></div>
 <div className="mt-5"><p className="mb-2 text-sm font-medium">Playback duration</p><div className="flex gap-2">{[15,30,60].map(n=><button key={n} type="button" disabled={playing} onClick={()=>{setDuration(n);setRemaining(n)}} aria-pressed={duration===n} className={'flex-1 rounded-lg border px-3 py-2 text-sm font-bold '+(duration===n?'border-red-500 bg-red-800':'border-zinc-600 bg-zinc-800')}>{n}s</button>)}</div></div>
 <button type="button" onClick={playing?stop:start} className="mt-6 flex w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-b from-[#ed3d40] to-[#a8151e] px-6 py-4 text-lg font-bold shadow-[0_5px_0_#661015] transition hover:brightness-110 active:translate-y-1 active:shadow-none">{playing?<><Square size={20}/> Stop audio</>:<><Play size={20} fill="currentColor"/> Start sound</>}</button>{error&&<p role="alert" className="mt-3 text-sm text-red-300">{error}</p>}
 </div></div><p className="border-t border-zinc-700 bg-[#222428] px-6 py-4 text-sm text-zinc-300">Sound may help move some surface water. It cannot reliably remove packed dust, debris or corrosion. Stop if you hear distortion or discomfort. Never use on a charging wet phone.</p></section>
}