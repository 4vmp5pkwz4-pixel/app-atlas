"use strict";
const assert=require("node:assert/strict");
const C=require("../apps/brahmi/bfg-core.js");
let checks=0;
function equal(a,b){assert.deepEqual(a,b);checks++}
function check(x){assert.ok(x);checks++}
for(let n=0;n<=7;n++)for(let i=0;i<(1<<n);i++){
 const s=Array.from({length:n},(_,j)=>i&(1<<j)?"a":"b").join("");
 for(let r=0;r<=2;r++){
  const g=C.graph(s,r),z=C.countGraph(g,.1);
  let count=0,max=0;
  for(let m=0;m<(1<<g.classes.length);m++){
   const sel=new Set(g.classes.filter(c=>m&(1<<c.id)).map(c=>c.id)),v=C.validSelection(g,sel);
   if(v.valid){count++;max=Math.max(max,v.ones);equal(C.decode(C.encode(v.mask)),v.mask)}
  }
  check(z.exact);equal(BigInt(z.count),BigInt(count));equal(z.maxOnesLower,max);check(z.capacityLower<=z.capacityUpper+1e-12)
 }
}
for(let w=2;w<=9;w++){
 const path=Array.from({length:w-1},(_,i)=>[i,i+1,1]),full=Array.from({length:w},(_,i)=>Array.from({length:w-i-1},(_,j)=>[i,i+j+1,1])).flat();
 equal(C.tunnel(w,path).value,C.preset(w,"tree"));equal(C.tunnel(w,full).value,C.preset(w,"complete"));
 if(w>=3)equal(C.tunnel(w,[...path,[w-1,0,1]]).value,C.preset(w,"cycle"));
}
equal(C.tunnel(3,[[0,1,2],[1,2,3]]).value,[2n,3n]);
equal(C.noise("I 7\nE 3").forward.missing,0);
equal(C.noise("I 3\nE 7").reverse.missing,0);
const mix=C.noise("III 1\nIEE 3\nEIE 3\nEEI 3");
check(mix.forward.missing>0&&mix.reverse.missing>0);
check(!C.countGraph(C.graph("abcab",0),.1,1).exact);
const unique=Array.from({length:800},(_,i)=>String.fromCodePoint(0x4e00+i)).join("");
const large=C.analyze(unique,0,.1,"raw",false,1);
equal(large.count,C.fib(802).toString());equal(large.maxOnesLower,400);check(large.exact);
const a=C.graph("𑀓𑀮𑀓𑀲",1),b=C.graph("xYxZ",1);equal(a.ids,b.ids);
equal(C.graph("é",0,"NFD").a.length,2);equal(C.graph("a b",0,"raw",true).a.length,3);
equal(C.countGraph(C.graph("aaaa"),.1).count,"1");
equal(C.countGraph(C.graph("abcd"),.5).capacityLower,0);
assert.throws(()=>C.decode("AA"));assert.throws(()=>C.tunnel(3,[[0,1,1]]));assert.throws(()=>C.noise("I 1\nEE 1"));
console.log("BFG core:",checks,"independent assertions PASS");
