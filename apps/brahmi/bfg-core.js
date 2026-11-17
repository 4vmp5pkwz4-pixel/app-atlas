"use strict";
function makeCore(){
"use strict";
const bit=i=>1n<<BigInt(i),idx=m=>{let a=[],i=0;while(m){if(m&1n)a.push(i);m>>=1n;i++}return a};
function fib(n){let a=0n,b=1n;for(let i=0;i<n;i++)[a,b]=[b,a+b];return a}
function logBig(n){let s=n.toString(),k=Math.min(15,s.length);return Math.log2(Number(s.slice(0,k)))+(s.length-k)*Math.log2(10)}
function graph(text,r=0,norm="raw",spaces=false){
 if(!Number.isInteger(r)||r<0||r>7||!["raw","NFC","NFD"].includes(norm))throw Error("Invalid options");
 const a=Array.from(norm==="raw"?text:text.normalize(norm)).filter(c=>spaces||!/\s/u.test(c));if(a.length>800)throw Error("Maximum 800 Unicode code points after preprocessing");
 const ids=[],classes=[],map=new Map();
 for(let i=0;i<a.length;i++){const context=Array.from({length:2*r+1},(_,j)=>a[i+j-r]??null),key=JSON.stringify(context);if(!map.has(key)){map.set(key,classes.length);classes.push({id:classes.length,context,w:0,loop:false})}const id=map.get(key);ids.push(id);classes[id].w++}
 const adj=classes.map(()=>0n);for(let i=1;i<ids.length;i++){const x=ids[i-1],y=ids[i];if(x===y)classes[x].loop=true;else{adj[x]|=bit(y);adj[y]|=bit(x)}}
 return {a,ids,classes,adj,eligible:classes.reduce((m,c)=>c.loop?m:m|bit(c.id),0n)};
}
function validSelection(g,sel){let mask=g.ids.map(i=>sel.has(i)?1:0).join("");return {mask,valid:!mask.includes("11"),ones:[...mask].filter(x=>x==="1").length}}
function greedy(g,weights){let used=0n,total=0,selected=[];for(const i of idx(g.eligible).sort((i,j)=>weights[j]-weights[i]||i-j))if(!(used&bit(i))){selected.push(i);total+=weights[i];used|=bit(i)|g.adj[i]}return {total,selected}}
function countGraph(g,p,budget=12000){
 if(!Number.isFinite(p)||p<0||p>.5||!Number.isInteger(budget)||budget<1)throw Error("Invalid probability or budget");
 const weights=g.classes.map(c=>(1-p)**c.w-p**c.w),gw=greedy(g,g.classes.map(c=>c.w)),gq=greedy(g,weights),memo=new Map([[0n,{count:1n,w:0,q:0}]]);let visited=0;
 function solve(mask){
  if(memo.has(mask))return memo.get(mask);if(++visited>budget)throw Error("budget");
  const a=idx(mask);let v=a[0],degree=-1;for(const i of a){let d=idx(g.adj[i]&mask).length;if(d>degree){degree=d;v=i}}
  let z;if(degree===0)z={count:1n<<BigInt(a.length),w:a.reduce((s,i)=>s+g.classes[i].w,0),q:a.reduce((s,i)=>s+weights[i],0)};
  else{let component=bit(v),front=component;while(front){let nb=0n;for(const u of idx(front))nb|=g.adj[u];front=nb&mask&~component;component|=front}
   if(component!==mask){const x=solve(component),y=solve(mask&~component);z={count:x.count*y.count,w:x.w+y.w,q:x.q+y.q}}
   else{const x=solve(mask&~bit(v)),y=solve(mask&~(bit(v)|g.adj[v]));z={count:x.count+y.count,w:Math.max(x.w,y.w+g.classes[v].w),q:Math.max(x.q,y.q+weights[v])}}
  }memo.set(mask,z);return z;
 }
 let exact=null;try{exact=solve(g.eligible)}catch(e){if(e.message!=="budget")throw e}
 const all=idx(g.eligible),dimUpper=Math.min(logBig(fib(g.a.length+2)),all.length,exact?logBig(exact.count):Infinity),upper=Math.min(dimUpper,all.reduce((s,i)=>s+weights[i],0));
 return {exact:!!exact,count:exact?String(exact.count):null,countLower:String(1n<<BigInt(gw.selected.length)),logDimensionUpper:dimUpper,maxOnesLower:exact?exact.w:gw.total,maxOnesUpper:exact?exact.w:Math.min(Math.ceil(g.a.length/2),all.reduce((s,i)=>s+g.classes[i].w,0)),capacityLower:p===0&&exact?logBig(exact.count):exact?exact.q:gq.total,capacityUpper:upper,greedy:gw.selected,visited};
}
function analyze(text,r,p,norm,spaces,budget){const g=graph(text,r,norm,spaces),stats=countGraph(g,p,budget),edges=[];for(const c of g.classes)for(const j of idx(g.adj[c.id]))if(j>c.id)edges.push([c.id,j]);return {n:g.a.length,alphabet:g.classes.length,classes:g.classes,ids:g.ids,edges,eligible:idx(g.eligible),fullDimension:String(fib(g.a.length+2)),...stats}}
const encode=mask=>{if(!/^[01]*$/.test(mask))throw Error("Expected binary mask");return mask.replace(/./g,c=>c==="0"?"AC":"GT")};
const decode=s=>{if(!/^(AC|GT)*$/.test(s))throw Error("Invalid AC/GT blocks");return s.replace(/AC|GT/g,c=>c==="AC"?"0":"1")};
function gcd(a,b){while(b)[a,b]=[b,a%b];return a<0n?-a:a}
function frac(a,b=1n){if(!b)throw Error("Zero denominator");let d=gcd(a,b);return [a/d,b/d]}
const add=(a,b)=>frac(a[0]*b[1]+b[0]*a[1],a[1]*b[1]);
const fact=n=>{let a=1n;for(let i=2;i<=n;i++)a*=BigInt(i);return a};
function preset(w,kind){if(!Number.isInteger(w)||w<2||w>100)throw Error("Use 2–100 vertices");if(kind==="tree")return [2n**BigInt(w-1),1n];if(kind==="cycle"){if(w<3)throw Error("A cycle needs ≥3 vertices");return frac(fact(2*w-2),fact(w-1)**2n*2n**BigInt(w-1))}if(kind==="complete")return frac(fact(w),fact(w-1)**2n);throw Error("Unknown graph")}
function tunnel(w,edges){
 if(!Number.isInteger(w)||w<2||w>12)throw Error("Custom graph: 2–12 vertices");if(edges.length>66)throw Error("At most 66 edges");
 const seen=new Set();for(const [a,b,c] of edges){if(![a,b,c].every(Number.isInteger)||a<0||b<0||a>=w||b>=w||a===b||c<1||c>1000)throw Error("Distinct vertices, integer weights 1–1000 required");let k=[Math.min(a,b),Math.max(a,b)].join(":");if(seen.has(k))throw Error("Duplicate edge");seen.add(k)}
 const end=(1<<w)-1,dp=[[1n,1n]];let mincut=Infinity;
 for(let s=1;s<=end;s++){let z=[0n,1n];for(let i=0;i<w;i++)if(s&(1<<i))z=add(z,dp[s^(1<<i)]);if(s!==end){let c=0;for(const [i,j,v] of edges)if(Boolean(s&(1<<i))!==Boolean(s&(1<<j)))c+=v;if(!c)throw Error("Graph must be connected");mincut=Math.min(mincut,c);z=frac(z[0],z[1]*BigInt(c))}dp[s]=z}return {value:dp[end],mincut};
}
function parseNoise(text){let m=new Map();for(const l of text.trim().split(/\n/)){if(!l.trim())continue;let a=l.trim().split(/\s+/);if(a.length!==2||!/^[EDI]{1,8}$/.test(a[0])||!/^[0-9]+$/.test(a[1]))throw Error("Use E/D/I words and integer mass");let v=Number(a[1]);if(!Number.isSafeInteger(v)||v>1000000)throw Error("Mass too large");if(v)m.set(a[0],(m.get(a[0])||0)+v)}let rows=[...m];if(!rows.length||rows.length>32||rows.some(([s])=>s.length!==rows[0][0].length))throw Error("Use 1–32 words of equal length");return rows}
function transport(rows,other){const total=rows.reduce((a,x)=>a+x[1],0),n=rows.length,m=other.length,N=n+m+2,S=N-2,T=N-1,cap=Array.from({length:N},()=>Array(N).fill(0)),rank={E:0,D:1,I:2};
 rows.forEach(([s,v],i)=>{cap[S][i]=v;other.forEach(([t],j)=>{if([...s].every((c,k)=>rank[c]>=rank[t[k]]))cap[i][n+j]=total})});other.forEach(([s,v],j)=>cap[n+j][T]=v);let flow=0;
 while(true){const prev=Array(N).fill(-1),q=[S];prev[S]=S;for(let i=0;i<q.length&&prev[T]<0;i++)for(let j=0;j<N;j++)if(prev[j]<0&&cap[q[i]][j]>0){prev[j]=q[i];q.push(j)}if(prev[T]<0)break;let d=total;for(let j=T;j!==S;j=prev[j])d=Math.min(d,cap[prev[j]][j]);for(let j=T;j!==S;j=prev[j]){cap[prev[j]][j]-=d;cap[j][prev[j]]+=d}flow+=d}return {missing:total-flow,total}}
function noise(text){let rows=parseNoise(text),comp=rows.map(([s,v])=>[s.replace(/[EI]/g,c=>c==="E"?"I":"E"),v]);return {forward:transport(rows,comp),reverse:transport(comp,rows)}}
return {graph,validSelection,countGraph,analyze,encode,decode,preset,tunnel,noise,logBig,fib};
}
const BFGCore=makeCore();
if(typeof module!=="undefined"&&module.exports)module.exports=BFGCore;
if(typeof window!=="undefined")window.BFGCore=BFGCore;
