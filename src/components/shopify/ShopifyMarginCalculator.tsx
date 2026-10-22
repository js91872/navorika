'use client';
import {useMemo,useState} from 'react';
type Input={price:number;discount:number;shippingCharged:number;productCost:number;shippingCost:number;packaging:number;ads:number;other:number;refundReserve:number;monthlyCost:number;monthlyOrders:number;feeRate:number;feeFixed:number;thirdPartyRate:number;targetMargin:number;};
const initial:Input={price:49.99,discount:0,shippingCharged:0,productCost:17,shippingCost:5.50,packaging:1.25,ads:7,other:0,refundReserve:1,monthlyCost:39,monthlyOrders:100,feeRate:2.9,feeFixed:.30,thirdPartyRate:0,targetMargin:30};
const presets={'Custom':null,'Basic US':2.9,'Grow US':2.7,'Advanced US':2.5} as const;
const n=(x:number)=>Number.isFinite(x)?x:0;
function calculate(s:Input){
 const sale=s.price*(1-s.discount/100),revenue=sale+s.shippingCharged;
 const feeBase=Math.max(0,revenue),processing=feeBase*s.feeRate/100+(feeBase>0?s.feeFixed:0),thirdParty=feeBase*s.thirdPartyRate/100;
 const allocation=s.monthlyOrders>0?s.monthlyCost/s.monthlyOrders:0;
 const costs=s.productCost+s.shippingCost+s.packaging+s.ads+s.other+s.refundReserve+processing+thirdParty+allocation;
 const profit=revenue-costs, margin=revenue>0?profit/revenue*100:NaN;
 const productGross=sale-s.productCost, grossMargin=sale>0?productGross/sale*100:NaN;
 const fixed=s.productCost+s.shippingCost+s.packaging+s.ads+s.other+s.refundReserve+allocation+(s.feeFixed||0);
 const rate=(s.feeRate+s.thirdPartyRate)/100;
 const multiplier=1-s.discount/100;
 const denominator=multiplier*(1-rate);
 const breakEven=denominator>0?(fixed-s.shippingCharged*(1-rate))/denominator:NaN;
 const targetDenominator=multiplier*(1-rate-s.targetMargin/100);
 const target=targetDenominator>0?(fixed-s.shippingCharged*(1-rate-s.targetMargin/100))/targetDenominator:NaN;
 const nonAdCosts=costs-s.ads,maxAdSpend=revenue-nonAdCosts,roas=maxAdSpend>0?revenue/maxAdSpend:NaN;
 return {sale,revenue,processing,thirdParty,allocation,costs,profit,margin,grossMargin,breakEven,target,maxAdSpend,roas};
}
const fields:[keyof Input,string][]=[['price','Product selling price ($)'],['discount','Discount (%)'],['shippingCharged','Shipping charged to customer ($)'],['productCost','Product cost / COGS ($)'],['shippingCost','Shipping you pay ($)'],['packaging','Packaging / fulfillment ($)'],['ads','Advertising cost per order ($)'],['other','Other variable expenses ($)'],['refundReserve','Refund/returns reserve per order ($)'],['monthlyCost','Monthly subscription and app costs ($)'],['monthlyOrders','Expected orders per month'],['feeRate','Payment processing percentage (%)'],['feeFixed','Fixed payment processing fee ($)'],['thirdPartyRate','Additional third-party transaction fee (%)'],['targetMargin','Target profit margin (%)']];
const cash=(v:number)=>Number.isFinite(v)?new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format(v):'Not attainable';
const pct=(v:number)=>Number.isFinite(v)?v.toFixed(2)+'%':'—';
export default function ShopifyMarginCalculator(){
 const [s,setS]=useState<Input>(initial),[plan,setPlan]=useState<keyof typeof presets>('Basic US');
 const r=useMemo(()=>calculate(s),[s]);
 const valid=Object.values(s).every(Number.isFinite)&&Object.entries(s).every(([k,v])=>v>=0&&(k!=='discount'||v<100)&&(k!=='targetMargin'||v<100))&&s.monthlyOrders>0;
 const update=(key:keyof Input,value:string)=>{const val=value===''?0:Number(value);setS(a=>({...a,[key]:val}));if(key==='feeRate')setPlan('Custom');};
 const exportCsv=()=>{const rows=[['Metric','USD or percent'],...Object.entries(r).map(([k,v])=>[k,String(v)])];const csv=rows.map(x=>x.map(t=>'"'+t.replaceAll('"','""')+'"').join(',')).join('\r\n');const blob=new Blob([csv],{type:'text/csv;charset=utf-8'});const u=URL.createObjectURL(blob);const a=document.createElement('a');a.href=u;a.download='shopify-margin-breakdown.csv';a.click();URL.revokeObjectURL(u);};
 return <section className="rounded-3xl border border-slate-200 bg-white p-4 text-slate-900 shadow-sm sm:p-8">
 <div className="mb-6"><h2 className="text-2xl font-bold">Calculate your real profit per Shopify order</h2><p className="mt-2 text-slate-600">Instant results as you type. Amounts are US dollars; values are estimates before income tax. No data is uploaded.</p></div>
 <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)]"><div>
 <label className="mb-4 block text-sm font-semibold">Payment rate preset (editable)<select value={plan} onChange={e=>{const p=e.target.value as keyof typeof presets;setPlan(p);if(presets[p]!==null)setS(x=>({...x,feeRate:presets[p]}));}} className="mt-2 w-full rounded-xl border border-slate-300 bg-white p-3">{Object.keys(presets).map(p=><option key={p}>{p}</option>)}</select></label>
 <p className="mb-5 text-xs text-slate-500">Indicative standard US online card fees; always verify your Shopify account and contract. Fixed fees and third-party transaction fees vary.</p>
 <div className="grid gap-4 sm:grid-cols-2">{fields.map(([key,label])=><label key={key} className="block text-sm font-semibold">{label}<input type="number" inputMode="decimal" step="any" min="0" max={key==='discount'||key==='targetMargin'?99.999:undefined} value={s[key]} onChange={e=>update(key,e.target.value)} className="mt-2 w-full rounded-xl border border-slate-300 bg-white p-3 text-base" /></label>)}</div>
 <button className="mt-5 rounded-xl border border-slate-300 px-5 py-3 font-semibold hover:bg-slate-50" onClick={()=>{setS(initial);setPlan('Basic US');}}>Reset sample</button>
 </div>
 <div className="lg:sticky lg:top-5 lg:self-start" aria-live="polite">
 {!valid?<p role="alert" className="rounded-xl bg-red-50 p-4 text-red-700">Enter nonnegative values, a positive monthly order count and percentage values below 100.</p>:<>
 <div className="rounded-2xl bg-emerald-50 p-6"><p className="text-sm font-semibold text-emerald-900">Estimated profit per order</p><p className="my-2 text-4xl font-extrabold text-emerald-950">{cash(r.profit)}</p><p className="text-xl font-bold text-emerald-800">Net profit margin: {pct(r.margin)}</p><p className="mt-2 text-sm text-emerald-900">Gross product margin (before other expenses): {pct(r.grossMargin)}</p></div>
 <div className="mt-5 grid grid-cols-2 gap-3">{[['Revenue',cash(r.revenue)],['Total expenses',cash(r.costs)],['Break-even list price',cash(Math.max(0,r.breakEven))],['Price for target margin',cash(Math.max(0,r.target))],['Max ad spend / order',cash(r.maxAdSpend)],['Break-even ROAS',Number.isFinite(r.roas)?r.roas.toFixed(2)+'×':'Not defined']].map(([a,b])=><div key={a} className="rounded-xl border border-slate-200 p-4"><p className="text-xs text-slate-600">{a}</p><p className="mt-1 text-lg font-extrabold">{b}</p></div>)}</div>
 <h3 className="mt-7 text-lg font-bold">Itemized cost breakdown</h3><dl className="mt-3 divide-y divide-slate-200">{[['Sale after discount',r.sale],['Customer shipping paid',s.shippingCharged],['Product cost',s.productCost],['Merchant shipping',s.shippingCost],['Packaging / fulfillment',s.packaging],['Ad spend',s.ads],['Other expenses',s.other],['Refund reserve',s.refundReserve],['Payment processing',r.processing],['Third-party fee',r.thirdParty],['Allocated monthly costs',r.allocation]].map(([a,b])=><div className="flex justify-between gap-4 py-2 text-sm" key={String(a)}><dt>{a}</dt><dd className="font-semibold">{cash(Number(b))}</dd></div>)}</dl>
 <div className="mt-5 flex flex-wrap gap-3"><button onClick={exportCsv} className="rounded-xl bg-emerald-700 px-5 py-3 font-bold text-white hover:bg-emerald-800">Export CSV (Excel)</button><button onClick={()=>window.print()} className="rounded-xl border border-slate-300 px-5 py-3 font-semibold">Print / Save PDF</button></div>
 <p className="mt-4 text-xs leading-5 text-slate-600">Break-even and target-price figures assume constant per-order costs and fee percentages. Refund reserves are an estimate, not a forecast. Sales tax collected for remittance is not revenue or profit.</p>
 </>}
 </div></div></section>;
}
