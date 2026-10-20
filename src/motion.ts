import './motion.css';

/** One lightweight lifecycle for HTML motion. No scroll interception or render framework. */
export function initMotion(){
 if(document.documentElement.dataset.motionInitialized)return;
 document.documentElement.dataset.motionInitialized='true';
 const reduced=matchMedia('(prefers-reduced-motion: reduce)'),fine=matchMedia('(hover: hover) and (pointer: fine) and (min-width: 1051px)');
 const controller=new AbortController(),signal=controller.signal,root=document.documentElement;
 const portfolio=document.querySelector<HTMLElement>('#portfolio')!,panel=document.querySelector<HTMLDialogElement>('#panel')!;
 const animations=new Set<Animation>(),seen=new WeakSet<Element>();
 function animate(el:Element,frames:Keyframe[],options:KeyframeAnimationOptions){
  if(reduced.matches||!el.animate)return;
  const animation=el.animate(frames,{fill:'backwards',...options});animations.add(animation);
  animation.finished.then(()=>animations.delete(animation),()=>animations.delete(animation));
 }
 const hero=portfolio.querySelector<HTMLElement>('.standard-hero')!;
 for(const heading of [hero.querySelector('h1'),document.querySelector('.intro h1')]){
  if(!heading)continue;
  const groups:Node[][]=[[]];
  for(const node of Array.from(heading.childNodes)){if(node.nodeName==='BR')groups.push([]);else groups.at(-1)!.push(node)}
  heading.replaceChildren(...groups.map(nodes=>{const mask=document.createElement('span');mask.className='line-mask';const line=document.createElement('span');line.append(...nodes);mask.append(line);return mask}));
 }
 const glow=document.createElement('div');glow.className='hero-depth';glow.setAttribute('aria-hidden','true');hero.prepend(glow);
 const progress=document.createElement('div');progress.className='scroll-progress';progress.setAttribute('aria-hidden','true');document.body.append(progress);
 // The existing four-step workflow becomes a short native sticky story on desktop.
 const processSection=Array.from(portfolio.querySelectorAll<HTMLElement>('.standard-section')).find(section=>section.querySelector('.process-step'));
 let steps:HTMLElement[]=[],marker:HTMLElement|undefined;
 if(processSection){
  processSection.id||='standard-process';steps=Array.from(processSection.querySelectorAll<HTMLElement>('.process-step'));
  const layout=document.createElement('div');layout.className='process-layout';
  marker=document.createElement('aside');marker.className='process-marker';marker.setAttribute('aria-hidden','true');marker.innerHTML='<div class="process-reticle"><strong>01</strong></div><small>IDEAS WITH DIRECTION / 04</small><h3>Discover</h3>';
  const track=document.createElement('div');track.className='process-track';track.append(...steps);layout.append(marker,track);processSection.append(layout);
 }
 const entrances=new IntersectionObserver(entries=>{for(const entry of entries){
  if(!entry.isIntersecting||seen.has(entry.target))continue;
  seen.add(entry.target);entrances.unobserve(entry.target);
  const el=entry.target as HTMLElement;
  if(el.matches('.standard-hero,.intro')){
   el.querySelectorAll('.line-mask>span').forEach((line,i)=>animate(line,[{transform:'translateY(110%)',opacity:.4},{transform:'translateY(0)',opacity:1}],{duration:650,delay:i*85,easing:'cubic-bezier(.2,.75,.2,1)'}));
   el.querySelectorAll(':scope>p,:scope>.primary,:scope>.text-link,.hero-actions').forEach((part,i)=>animate(part,[{transform:'translateY(15px)',opacity:0},{transform:'translateY(0)',opacity:1}],{duration:450,delay:150+i*65,easing:'ease-out'}));
  }else{
   const stagger=el.matches('.service-item,.project-card')?Math.min(Array.from(el.parentElement!.children).indexOf(el)%3,2)*65:0;
   animate(el,[{opacity:0,transform:'translateY(22px)'},{opacity:1,transform:'translateY(0)'}],{duration:fine.matches?580:380,delay:stagger,easing:'cubic-bezier(.2,.7,.2,1)'});
  }
 }},{threshold:.08,rootMargin:'0px 0px -12px 0px'});
 function register(scope:ParentNode){scope.querySelectorAll<HTMLElement>('.standard-hero,.intro,.standard-section>h2,.service-item,.project-card,.process-step,.panel-body>h2').forEach(el=>{if(!seen.has(el))entrances.observe(el)});
  scope.querySelectorAll<HTMLElement>('.primary').forEach(button=>{
   button.querySelectorAll(':scope>span:not(.magnetic-visual)').forEach(arrow=>arrow.setAttribute('data-motion-arrow',''));
   if(button.matches('.standard-hero .primary,.panel-cta')&&!button.querySelector('.magnetic-visual')){const visual=document.createElement('span');visual.className='magnetic-visual';visual.append(...Array.from(button.childNodes));button.append(visual)}
  });
 }
 register(document);
 let currentStep=-1,scrollFrame=0;
 function updateScroll(){scrollFrame=0;const isStandard=!portfolio.hidden;const range=Math.max(1,document.documentElement.scrollHeight-innerHeight);
  progress.hidden=!isStandard;progress.style.transform=`scaleX(${Math.max(0,Math.min(1,scrollY/range))})`;document.body.classList.toggle('motion-scrolled',isStandard&&scrollY>35);
  if(isStandard&&fine.matches&&!reduced.matches){glow.style.transform=`translate3d(0,${Math.min(scrollY*.12,36)}px,0)`;
   if(steps.length){let closest=0,distance=Infinity;steps.forEach((step,i)=>{const d=Math.abs(step.getBoundingClientRect().top-innerHeight*.43);if(d<distance){closest=i;distance=d}});if(currentStep!==closest){currentStep=closest;steps.forEach((step,i)=>step.classList.toggle('is-current',i===closest));marker!.querySelector('strong')!.textContent=`0${closest+1}`;marker!.querySelector('h3')!.textContent=steps[closest].querySelector('h3')!.textContent;}}
  }
 }
 const scheduleScroll=()=>{if(!scrollFrame)scrollFrame=requestAnimationFrame(updateScroll)};
 window.addEventListener('scroll',scheduleScroll,{passive:true,signal});window.addEventListener('resize',scheduleScroll,{passive:true,signal});window.addEventListener('hashchange',scheduleScroll,{signal});
 function preferences(){if(reduced.matches){animations.forEach(animation=>animation.cancel());animations.clear();glow.style.transform=''}scheduleScroll()}
 reduced.addEventListener('change',preferences,{signal});fine.addEventListener('change',preferences,{signal});
 const observer=new MutationObserver(records=>{for(const record of records){if(record.type==='childList')for(const node of record.addedNodes)if(node instanceof HTMLElement)register(node.parentElement||node);}
  scheduleScroll();
 });
 observer.observe(portfolio,{attributes:true,attributeFilter:['hidden'],childList:true,subtree:true});observer.observe(panel,{attributes:true,attributeFilter:['open'],childList:true,subtree:true});
 scheduleScroll();
 window.addEventListener('pagehide',()=>{controller.abort();observer.disconnect();entrances.disconnect();animations.forEach(animation=>animation.cancel());cancelAnimationFrame(scrollFrame);root.classList.remove('reticle-active');progress.remove();delete root.dataset.motionInitialized},{once:true});
}
