export function initSwarmPointer(){
 const fine=matchMedia('(hover:hover) and (pointer:fine) and (min-width:1051px)'),reduced=matchMedia('(prefers-reduced-motion:reduce)');
 let dispose:(()=>void)|undefined,host:HTMLElement|undefined,pending=false,alive=true;
 const panel=document.querySelector<HTMLDialogElement>('#panel')!;
 function restore(){document.documentElement.classList.remove('swarm-cursor-hidden','reticle-active')}
 async function sync(){
  if(!alive)return;
  if(!fine.matches||reduced.matches){dispose?.();dispose=undefined;host?.remove();host=undefined;restore();return}
  if(host||pending)return;pending=true;
  try{const {mountSwarmPointer}=await import('./swarm-pointer.jsx');if(!alive||!fine.matches||reduced.matches)return;
   host=document.createElement('div');host.className='swarm-overlay';host.setAttribute('aria-hidden','true');(panel.open?panel:document.body).append(host);dispose=mountSwarmPointer(host);
  }catch{host?.remove();host=undefined;restore()}finally{pending=false}
 }
 const observer=new MutationObserver(()=>{const parent=panel.open?panel:document.body;if(host&&host.parentElement!==parent){restore();parent.append(host)}});observer.observe(panel,{attributes:true,attributeFilter:['open']});
 fine.addEventListener('change',sync);reduced.addEventListener('change',sync);void sync();
 window.addEventListener('pagehide',()=>{alive=false;observer.disconnect();fine.removeEventListener('change',sync);reduced.removeEventListener('change',sync);dispose?.();host?.remove();restore()},{once:true});
}
