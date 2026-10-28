export type SpringProfile={mass:number;stiffness:number;damping:number;durationMs:number;sampleRate:number};
export function springSamples(profile:SpringProfile){
  const {mass,stiffness,damping,durationMs,sampleRate}=profile;
  if([mass,stiffness,damping,durationMs,sampleRate].some(value=>!Number.isFinite(value)||value<=0)||sampleRate>240||durationMs>2000)throw new Error('Invalid bounded spring profile');
  const omega=Math.sqrt(stiffness/mass),zeta=damping/(2*Math.sqrt(stiffness*mass));
  const count=Math.ceil(durationMs*sampleRate/1000);
  const values=Array.from({length:count+1},(_,i)=>{
    const t=(i/count)*durationMs/1000;
    if(Math.abs(zeta-1)<1e-7)return 1-Math.exp(-omega*t)*(1+omega*t);
    if(zeta<1){const damped=omega*Math.sqrt(1-zeta*zeta);return 1-Math.exp(-zeta*omega*t)*(Math.cos(damped*t)+(zeta*omega/damped)*Math.sin(damped*t));}
    const root=Math.sqrt(zeta*zeta-1),a=-omega*(zeta-root),b=-omega*(zeta+root);
    return 1-(b*Math.exp(a*t)-a*Math.exp(b*t))/(b-a);
  });
  if(Math.abs(1-values.at(-1)!)>0.002)throw new Error('Spring must settle before its declared end');
  values[0]=0;values[values.length-1]=1;
  return values.map(value=>Math.round(value*1e6)/1e6);
}
const active=new WeakMap<Element,Animation>();
export function cancelMotion(element:Element){active.get(element)?.cancel();active.delete(element);}
export function playSpring(element:HTMLElement,profile:SpringProfile,distance:number,reduced=false){
  cancelMotion(element);
  if(reduced||(typeof matchMedia==='function'&&matchMedia('(prefers-reduced-motion: reduce)').matches))return null;
  if(!Number.isFinite(distance)||Math.abs(distance)>320)throw new Error('Motion distance exceeds the demonstration limit');
  const frames=springSamples(profile).map((progress,index,all)=>({transform:`translateX(${distance*progress}px)`,offset:index/(all.length-1)}));
  const animation=element.animate(frames,{duration:profile.durationMs,easing:'linear',fill:'forwards'});
  active.set(element,animation);
  animation.finished.then(()=>{if(active.get(element)===animation)active.delete(element);},()=>{});
  return animation;
}
