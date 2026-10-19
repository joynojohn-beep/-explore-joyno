import {filteredProjects} from './views';
import type {Project} from './content';
import './work-carousel.css';

export function initGalleryCarousel(){
 const gallery=document.querySelector<HTMLElement>('#standard-work [data-gallery]');if(!gallery)return;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)'),abort=new AbortController();
 let controller:{update:(items:Project[])=>void;destroy:()=>void}|undefined,loading=false,ready=false,chosen='carousel',alive=true,failed=false;
 const toolbar=document.createElement('div');toolbar.className='work-gallery-modes';toolbar.innerHTML='<span>Explore our creative circle</span><div role="group" aria-label="Gallery layout"><button type="button" data-gallery-mode="carousel" aria-pressed="false">Carousel ↔</button><button type="button" data-gallery-mode="grid" aria-pressed="true">Grid ▦</button></div>';
 const host=document.createElement('div');host.dataset.flexRoot='';gallery.querySelector('[data-gallery-results]')!.before(toolbar,host);
 const items=()=>filteredProjects(gallery.dataset.category||'All',gallery.querySelector<HTMLInputElement>('[data-search]')!.value);
 function sync(){const active=ready&&chosen==='carousel'&&!reduced.matches&&items().length>0;const hash=location.hash,anchor=document.getElementById(hash.slice(1));const before=anchor?.getBoundingClientRect().top;const changed=gallery!.classList.contains('work-carousel-active')!==active;gallery!.classList.toggle('work-carousel-active',active);if(changed&&anchor&&before!==undefined&&before>=0&&before<200&&hash!=='#standard-work')requestAnimationFrame(()=>{if(location.hash===hash)window.scrollBy(0,anchor.getBoundingClientRect().top-before)});toolbar.querySelectorAll<HTMLButtonElement>('button').forEach(button=>{button.setAttribute('aria-pressed',String(button.dataset.galleryMode===(active?'carousel':'grid')));if(button.dataset.galleryMode==='carousel'){button.disabled=reduced.matches||failed;button.title=reduced.matches?'Grid view respects your reduced-motion preference':failed?'Carousel unavailable; all profiles remain in Grid view':''}});}
 function unavailable(){ready=false;chosen='grid';failed=true;sync();}
 async function load(){if(controller||loading||reduced.matches||!items().length||!alive)return;loading=true;
  try{
   const probe=document.createElement('canvas').getContext('webgl2');if(!probe){unavailable();return}probe.getExtension('WEBGL_lose_context')?.loseContext();
   const {mountWorkCarousel}=await import('./work-carousel.jsx');if(!alive)return;
   controller=mountWorkCarousel(host,items(),()=>{if(alive){ready=true;sync()}},unavailable);
  }catch{unavailable()}finally{loading=false}
 }
 toolbar.addEventListener('click',event=>{const button=(event.target as HTMLElement).closest<HTMLButtonElement>('[data-gallery-mode]');if(!button)return;chosen=button.dataset.galleryMode!;if(chosen==='carousel')void load();sync()},{signal:abort.signal});
 gallery.addEventListener('joyno:gallery-change',()=>{controller?.update(items());sync();if(chosen==='carousel')void load()},{signal:abort.signal});
 reduced.addEventListener('change',()=>{if(reduced.matches){controller?.destroy();controller=undefined;ready=false;host.replaceChildren()}sync();if(!reduced.matches&&chosen==='carousel')void load()},{signal:abort.signal});
 const observer=new IntersectionObserver(entries=>{if(entries.some(entry=>entry.isIntersecting))void load()},{rootMargin:'100px'});observer.observe(gallery);
 sync();
 window.addEventListener('pagehide',()=>{alive=false;abort.abort();observer.disconnect();controller?.destroy()},{once:true});
}
