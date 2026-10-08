import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { kreslingState, kreslingMarkup } from '../static/kresling.js';
import { kirigamiSquares, kirigamiMarkup } from '../static/kirigami.js';
import { mountStructureIcons } from '../static/structure-icons.js';

assert(kreslingState(1).height < kreslingState(0).height / 2);
assert(kreslingState(1).twist > kreslingState(0).twist);
assert.equal(kreslingState(-5).compression, 0);
assert.equal(kreslingState(5).compression, 1);
const near = (a,b) => assert(Math.abs(a-b)<1e-8);
for (const p of [0, .25, .5, .75, 1]) {
  const squares = kirigamiSquares(p);
  for (const [a,b] of [[squares[0][1],squares[1][0]], [squares[0][2],squares[2][1]], [squares[1][3],squares[3][0]], [squares[2][2],squares[3][3]]]) {
    near(a[0],b[0]); near(a[1],b[1]);
  }
  for (const vertices of squares) for (let i=0;i<4;i++) {
    const a=vertices[i], b=vertices[(i+1)%4];
    near(Math.hypot(a[0]-b[0],a[1]-b[1]),11.6);
  }
  for (const svg of [kreslingMarkup(p), kirigamiMarkup(p)]) {
    assert(!/NaN|Infinity/.test(svg));
    for (const coords of svg.matchAll(/(?:points|d)="([^"]+)"/g)) {
      for (const value of coords[1].match(/-?\d+(?:\.\d+)?/g)) assert(+value>0 && +value<48);
    }
  }
}
assert(!/cursor:\s*none|kresling-cursor/.test(await readFile(new URL('../static/style.css',import.meta.url),'utf8')));
assert(!/mountKreslingCursor/.test(await readFile(new URL('../static/site.js',import.meta.url),'utf8')));

// Controlled time verifies the real icon handlers, including quick taps and idle behaviour.
let now=0, id=0;
const frames=new Map(), timers=new Map();
globalThis.performance={now:()=>now};
globalThis.requestAnimationFrame=cb=>{frames.set(++id,cb);return id;};
globalThis.cancelAnimationFrame=key=>frames.delete(key);
globalThis.setTimeout=(cb,delay)=>{timers.set(++id,{cb,at:now+delay});return id;};
globalThis.clearTimeout=key=>timers.delete(key);
const advance=milliseconds=>{
  const end=now+milliseconds;
  while(now<end){
    now=Math.min(end,now+10);
    for(const [key,t] of [...timers])if(t.at<=now){timers.delete(key);t.cb();}
    const callbacks=[...frames.values()];frames.clear();callbacks.forEach(cb=>cb(now));
  }
};
const events=()=>({listeners:new Map(),addEventListener(type,fn){const list=this.listeners.get(type)||[];list.push(fn);this.listeners.set(type,list);}});
const button=kind=>({ ...events(), dataset:{structure:kind}, disabled:true, mesh:{innerHTML:''}, keyboardFocus:false, querySelector(){return this.mesh;}, matches(){return this.keyboardFocus;} });
const buttons=[button('kirigami'),button('kresling')];
const media={...events(),matches:false};
globalThis.window={...events(),matchMedia:()=>media};
globalThis.document={...events(),hidden:false,querySelectorAll:()=>buttons};
const emit=(target,type,values={})=>target.listeners.get(type)?.forEach(fn=>fn({pointerType:'mouse',isPrimary:true,button:0,...values}));
mountStructureIcons();
for(const b of buttons){
  const amount=()=>+b.dataset.deformation;
  assert(!b.disabled);
  emit(b,'pointerenter'); advance(320); assert.equal(amount(),.85);
  emit(b,'pointerdown'); advance(320); assert.equal(amount(),1);
  emit(b,'pointerup'); emit(b,'click'); advance(320); assert.equal(amount(),1);
  advance(600); assert.equal(amount(),.85);
  emit(b,'pointerleave'); advance(450); assert.equal(amount(),0);
  emit(b,'pointerenter',{pointerType:'touch'}); advance(320); assert.equal(amount(),0);
  emit(b,'pointerdown',{pointerType:'touch'});emit(b,'pointerup',{pointerType:'touch'});emit(b,'click');
  advance(320); assert.equal(amount(),1);advance(600);assert.equal(amount(),0);
  b.keyboardFocus=true;emit(b,'focus');advance(320);assert.equal(amount(),.85);
  emit(b,'click');advance(320);assert.equal(amount(),1);advance(600);assert.equal(amount(),.85);
  emit(b,'blur');advance(450);assert.equal(amount(),0);
  emit(b,'pointerdown');advance(100);emit(b,'pointercancel');advance(450);assert.equal(amount(),0);
  emit(b,'pointerenter');advance(320);emit(window,'blur');advance(450);assert.equal(amount(),0);
  media.matches=true;emit(b,'pointerenter');assert.equal(amount(),.85);assert.equal(frames.size,0);
  emit(b,'pointerleave');assert.equal(amount(),0);media.matches=false;
}
assert.equal(frames.size,0);assert.equal(timers.size,0);
console.log('Passed fixed kirigami hinges and tile sizes, geometry bounds, native pointer restoration, hover/press/reset, touch, keyboard, cancellation, reduced motion and idle-frame checks.');
