import './ballpit-background.css';
export function initBallpitBackground(){
 const reduced=matchMedia('(prefers-reduced-motion:reduce)');
 const portfolio=document.querySelector<HTMLElement>('#portfolio')!;
 let host:HTMLElement|undefined,dispose:(()=>void)|undefined,pending=false,alive=true;
 async function sync(){
  const enabled=!portfolio.hidden&&!reduced.matches;
  if(!enabled){dispose?.();dispose=undefined;host?.remove();host=undefined;return}
  if(host||pending||!alive)return;
  pending=true;
  try{
   const {mountBallpit}=await import('./ballpit-background.jsx');
   if(!alive||portfolio.hidden||reduced.matches)return;
   host=document.createElement('div');host.className='ballpit-background';host.setAttribute('aria-hidden','true');portfolio.prepend(host);dispose=mountBallpit(host);
  }catch{host?.remove();host=undefined}finally{pending=false}
 }
 const observer=new MutationObserver(()=>void sync());observer.observe(portfolio,{attributes:true,attributeFilter:['hidden']});
 reduced.addEventListener('change',sync);void sync();
 window.addEventListener('pagehide',()=>{alive=false;observer.disconnect();reduced.removeEventListener('change',sync);dispose?.();host?.remove()},{once:true});
}
