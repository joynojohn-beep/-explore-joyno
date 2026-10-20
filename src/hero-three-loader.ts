export function initHeroThree(){
 const host=document.querySelector<HTMLElement>('.hero-three-stage');if(!host)return;
 let dispose:(()=>void)|undefined,pending=false,alive=true;
 const observer=new IntersectionObserver(async entries=>{
  if(!entries.some(e=>e.isIntersecting)||dispose||pending||!alive)return;
  pending=true;
  try{const {mountHeroScene}=await import('./hero-three');if(alive)dispose=mountHeroScene(host)}catch{host.classList.remove('is-ready');host.querySelector('canvas')?.remove()}finally{pending=false}
 });observer.observe(host);
 window.addEventListener('pagehide',()=>{alive=false;observer.disconnect();dispose?.()},{once:true});
}
