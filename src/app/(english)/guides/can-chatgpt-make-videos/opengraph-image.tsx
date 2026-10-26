import { ImageResponse } from 'next/og';
export const alt = 'AI video creation workspace showing a prompt storyboard and cinematic video preview';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export default function Image() {
 return new ImageResponse(
 <div style={{width:'100%',height:'100%',display:'flex',padding:58,background:'linear-gradient(125deg, #071522 0%, #102939 45%, #083b3a 100%)',fontFamily:'Arial, sans-serif',position:'relative'}}>
   <div style={{position:'absolute',top:-110,right:-30,width:500,height:500,borderRadius:250,background:'rgba(60,210,178,0.10)',display:'flex'}}/>
   <div style={{display:'flex',width:'100%',height:'100%',gap:34,alignItems:'center'}}>
     <div style={{display:'flex',flexDirection:'column',width:445,height:490,background:'#eaf6f2',borderRadius:28,padding:27,boxShadow:'0 16px 40px rgba(0,0,0,.20)'}}>
       <div style={{display:'flex',alignItems:'center',gap:12}}>
         <div style={{width:30,height:30,borderRadius:15,background:'#008a70',display:'flex'}}/>
         <span style={{fontSize:23,fontWeight:800,color:'#102d2b'}}>AI video storyboard</span>
       </div>
       <div style={{height:2,background:'#d0dfdb',marginTop:20,marginBottom:24,display:'flex'}}/>
       {[
         ['01','IDEA','A hiker reaches a summit'],
         ['02','CAMERA','Slow cinematic push-in'],
         ['03','LIGHT','Warm sunrise, soft haze'],
         ['04','OUTPUT','Vertical short film']
       ].map(([n,label,desc])=><div key={n} style={{display:'flex',alignItems:'center',gap:15,marginBottom:19}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'center',width:44,height:44,borderRadius:13,background:'#c3e7d9',color:'#065f46',fontWeight:800,fontSize:19}}>{n}</div>
        <div style={{display:'flex',flexDirection:'column',gap:3}}>
          <span style={{fontSize:14,letterSpacing:2,fontWeight:800,color:'#0b7869'}}>{label}</span>
          <span style={{fontSize:19,color:'#173b36'}}>{desc}</span>
        </div>
       </div>)}
       <div style={{display:'flex',marginTop:'auto',borderRadius:12,background:'#00876f',height:45,alignItems:'center',justifyContent:'center',fontSize:18,color:'#fff',fontWeight:700}}>PROMPT READY</div>
     </div>
     <div style={{display:'flex',flexDirection:'column',width:600,gap:15}}>
       <div style={{display:'flex',height:390,width:'100%',borderRadius:26,overflow:'hidden',position:'relative',background:'linear-gradient(180deg,#ebae70 0%,#f5cd8a 29%,#879d9e 53%,#293f58 68%,#142638 100%)',border:'5px solid #d4eee7'}}>
         <div style={{display:'flex',position:'absolute',top:155,left:-40,width:690,height:300,clipPath:'polygon(0 100%, 0 50%, 18% 25%, 33% 50%, 49% 10%, 63% 34%, 79% 15%, 100% 44%, 100% 100%)',background:'#304c5b'}}/>
         <div style={{display:'flex',position:'absolute',top:206,left:-20,width:680,height:210,clipPath:'polygon(0 100%, 0 40%, 29% 8%, 43% 43%, 63% 18%, 79% 42%, 100% 12%, 100% 100%)',background:'#172f40'}}/>
         <div style={{display:'flex',position:'absolute',top:132,right:58,width:95,height:95,borderRadius:50,background:'#ffe0a4',opacity:.83}}/>
         <div style={{position:'absolute',top:146,left:250,width:110,height:110,border:'5px solid rgba(255,255,255,.92)',borderRadius:60,display:'flex',alignItems:'center',justifyContent:'center',background:'rgba(0,0,0,.25)',color:'#fff',fontSize:57}}>▶</div>
         <div style={{position:'absolute',bottom:22,left:30,fontSize:25,fontWeight:800,color:'#fff',display:'flex',textShadow:'0 2px 6px rgba(0,0,0,.7)'}}>FROM PROMPT TO VIDEO</div>
       </div>
       <div style={{display:'flex',gap:12}}>{[0,1,2,3].map(i=><div key={i} style={{display:'flex',flex:1,height:65,borderRadius:12,background:i===1?'#e4b16e':'#416677',border:i===1?'4px solid #70e3c5':'3px solid #7da3a6',alignItems:'center',justifyContent:'center',fontSize:15,fontWeight:700,color:'#fff'}}>SCENE {i+1}</div>)}</div>
     </div>
   </div>
 </div>,{...size}
 );
}