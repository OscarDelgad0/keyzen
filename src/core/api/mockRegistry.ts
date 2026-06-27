import { HttpMethod } from "@/core/api/apiFetch";
export interface MockRequest<TBody = unknown> { params: Record<string,string>; query: Record<string,string>; body?: TBody; }
export type MockHandler = (req: MockRequest) => unknown | Promise<unknown>;
const registry = new Map<string, MockHandler>();
function makeKey(m:HttpMethod,p:string){return `${m} ${p}`;}
export function registerMock(m:HttpMethod,p:string,h:MockHandler){registry.set(makeKey(m,p),h);}
function matchPattern(pattern:string,actual:string):Record<string,string>|null{
  const pp=pattern.split("/").filter(Boolean), ap=actual.split("/").filter(Boolean);
  if(pp.length!==ap.length)return null;
  const params:Record<string,string>={};
  for(let i=0;i<pp.length;i++){if(pp[i].startsWith(":"))params[pp[i].slice(1)]=decodeURIComponent(ap[i]);else if(pp[i]!==ap[i])return null;}
  return params;
}
export interface ResolvedMock{handler:MockHandler;params:Record<string,string>;}
export function resolveMock(m:HttpMethod,path:string):ResolvedMock|null{
  const clean=path.split("?")[0];
  for(const [key,handler] of registry.entries()){const [rm,...rest]=key.split(" ");if(rm!==m)continue;const params=matchPattern(rest.join(" "),clean);if(params)return{handler,params};}
  return null;
}
export function simulateLatency(ms=350){return new Promise<void>(r=>setTimeout(r,ms));}
export function parseQuery(path:string):Record<string,string>{const i=path.indexOf("?");if(i===-1)return{};const s=new URLSearchParams(path.slice(i+1));const r:Record<string,string>={};s.forEach((v,k)=>{r[k]=v;});return r;}
