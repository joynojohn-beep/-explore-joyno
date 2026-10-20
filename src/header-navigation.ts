export function initHeaderNavigation(){
 let dispose:(()=>void)|undefined,alive=true;
 void import('./header-gooey.jsx').then(({mountHeaderNavigation})=>{if(alive)dispose=mountHeaderNavigation()}).catch(()=>{ /* Original header links remain when the enhancement cannot load. */ });
 window.addEventListener('pagehide',()=>{alive=false;dispose?.()},{once:true});
}
