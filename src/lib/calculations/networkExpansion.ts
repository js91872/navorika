export function ipv4ToNumber(value: string): number | null {
  const parts = value.trim().split('.'); if (parts.length !== 4) return null;
  const octets = parts.map(Number); if (octets.some((part) => !Number.isInteger(part) || part < 0 || part > 255)) return null;
  return (((octets[0] << 24) >>> 0) | (octets[1] << 16) | (octets[2] << 8) | octets[3]) >>> 0;
}
export function numberToIpv4(value: number) { const n=value>>>0; return [n>>>24,(n>>>16)&255,(n>>>8)&255,n&255].join('.'); }
export function prefixMask(prefix: number) { return prefix === 0 ? 0 : (0xffffffff << (32-prefix)) >>> 0; }
export function maskText(prefix: number) { return numberToIpv4(prefixMask(prefix)); }

export function calculateIpRange(startText: string, endText: string) {
  const start=ipv4ToNumber(startText), end=ipv4ToNumber(endText);
  if(start===null||end===null) return { valid:false as const, error:'Enter two valid IPv4 addresses.' };
  if(start>end) return { valid:false as const, error:'Start address must not be greater than end address.' };
  const count=end-start+1; let common=0; const different=(start^end)>>>0; while(common<32 && ((different >>> (31-common))&1)===0) common+=1;
  const network=(start & prefixMask(common))>>>0;
  const blocks:string[]=[]; let current=start;
  while(current<=end){
    const lowBit=(current & -current)>>>0;
    let size=current===0 ? 2**32 : 2**(31-Math.clz32(lowBit));
    const remaining=end-current+1; while(size>remaining) size/=2;
    const prefix=32-Math.log2(size); blocks.push(`${numberToIpv4(current)}/${prefix}`); current+=size;
  }
  return { valid:true as const, start:numberToIpv4(start), end:numberToIpv4(end), count, containingCidr:`${numberToIpv4(network)}/${common}`, exactCidrs:blocks };
}

export interface VlsmRequest { id: string; name: string; hosts: number }
export interface VlsmAllocation { id:string; name:string; requested:number; network:string; prefix:number; mask:string; first:string; last:string; broadcast:string; capacity:number; waste:number; startNumber:number; endNumber:number }
export function allocateVlsm(parentText:string, requests:VlsmRequest[]) {
  const [ipText,prefixText]=parentText.trim().split('/'); const ip=ipv4ToNumber(ipText??''); const parentPrefix=Number(prefixText);
  if(ip===null||!Number.isInteger(parentPrefix)||parentPrefix<0||parentPrefix>30) return {valid:false as const,error:'Enter a valid IPv4 parent CIDR with prefix /0 through /30.'};
  const mask=prefixMask(parentPrefix); const parentStart=(ip&mask)>>>0; const parentSize=2**(32-parentPrefix); const parentEnd=parentStart+parentSize-1;
  const clean=requests.filter((item)=>item.name.trim()&&Number.isInteger(item.hosts)&&item.hosts>0).sort((a,b)=>b.hosts-a.hosts);
  if(!clean.length) return {valid:false as const,error:'Add at least one named requirement with a positive whole host count.'};
  let cursor=parentStart; const allocations:VlsmAllocation[]=[];
  for(const request of clean){
    const blockSize=2**Math.ceil(Math.log2(request.hosts+2)); const prefix=32-Math.log2(blockSize); cursor=Math.ceil(cursor/blockSize)*blockSize;
    const broadcast=cursor+blockSize-1; if(broadcast>parentEnd) return {valid:false as const,error:`Insufficient space for ${request.name}.`,allocations};
    const capacity=blockSize-2; allocations.push({id:request.id,name:request.name,requested:request.hosts,network:numberToIpv4(cursor),prefix,mask:maskText(prefix),first:numberToIpv4(cursor+1),last:numberToIpv4(broadcast-1),broadcast:numberToIpv4(broadcast),capacity,waste:capacity-request.hosts,startNumber:cursor,endNumber:broadcast}); cursor=broadcast+1;
  }
  return {valid:true as const,parent:`${numberToIpv4(parentStart)}/${parentPrefix}`,allocations,remaining:parentEnd-cursor+1};
}
