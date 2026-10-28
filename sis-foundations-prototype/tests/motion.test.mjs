import {test}from'node:test';import assert from'node:assert/strict';import{readFileSync}from'node:fs';import{springSamples,playSpring,cancelMotion}from'../src/motion.ts';
const motion=JSON.parse(readFileSync('src/data/motion.json','utf8'));
for(const [name,profile]of Object.entries(motion.springs))test(`${name} settles, repeats, and respects its overshoot envelope`,()=>{
 const values=springSamples(profile);assert.deepEqual(values,springSamples(profile));assert.equal(values[0],0);assert.equal(values.at(-1),1);assert(values.every(Number.isFinite));assert(Math.min(...values)>=0);assert(Math.max(...values)<1.2);
 if(name==='restrained')assert(values.every((value,index)=>!index||value>=values[index-1]));else assert(Math.max(...values)>1.01);
});
test('replacement cancels the earlier animation and reduced motion creates none',()=>{let created=0,cancelled=0;const element={animate(){created++;return{cancel(){cancelled++},finished:new Promise(()=>{})}}};playSpring(element,motion.springs.restrained,120);playSpring(element,motion.springs.responsive,120);assert.equal(cancelled,1);cancelMotion(element);assert.equal(cancelled,2);assert.equal(playSpring(element,motion.springs.restrained,120,true),null);assert.equal(created,2);});
test('invalid and unsettled spring profiles fail',()=>{assert.throws(()=>springSamples({...motion.springs.restrained,mass:0}));assert.throws(()=>springSamples({...motion.springs.restrained,durationMs:10}));});
