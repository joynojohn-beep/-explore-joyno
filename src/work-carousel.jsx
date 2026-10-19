import React,{useState,useMemo,Component} from 'react';
import {createRoot} from 'react-dom/client';
import FlexCarousel from './components/FlexCarousel';
import './work-carousel.css';

const colors=['#96e8c2','#ffe76e','#c8b5ff','#89d9fb','#ff9c88'];
const escape=s=>s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));
function artwork(item){
 const initials=item.directory?item.title.split(/\s+/).filter(w=>/[a-z0-9]/i.test(w)).slice(0,2).map(w=>w[0]).join('').toUpperCase():'✳';
 const words=(item.directory?item.title:item.client||item.title).split(/\s+/),lines=[''];
 for(const word of words){if((lines.at(-1)+' '+word).length>20)lines.push(word);else lines[lines.length-1]+=(lines.at(-1)?' ':'')+word}
 const title=lines.slice(0,3).map((line,i)=>`<tspan x="24" dy="${i?22:0}">${escape(line)}</tspan>`).join('');
 const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="320" height="400" viewBox="0 0 320 400"><rect width="320" height="400" rx="18" fill="${colors[item.title.length%5]}"/><path d="M222 156H294M294 156V228M294 156L210 240" stroke="#fff" stroke-opacity=".48" stroke-width="9" fill="none"/><text x="24" y="35" font-family="Arial" font-size="9" letter-spacing="1.3" fill="#25213c">${escape(item.category.toUpperCase())}</text><text x="22" y="220" font-family="Arial" font-size="112" font-weight="700" letter-spacing="-6" fill="#25213c">${escape(initials)}</text><path d="M24 274H296" stroke="#25213c" stroke-opacity=".3"/><text x="24" y="309" font-family="Arial" font-size="18" font-weight="700" fill="#25213c">${title}</text><text x="24" y="376" font-family="Arial" font-size="10" fill="#25213c">${item.links?.length||0} ONLINE CHANNELS / VIEW PROFILE ↗</text></svg>`;
 return 'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg);
}
class GalleryBoundary extends Component{
 state={failed:false};static getDerivedStateFromError(){return{failed:true}}componentDidCatch(){this.props.onUnavailable()}
 render(){return this.state.failed?null:this.props.children}
}
function WorkCarousel({items,onReady,onUnavailable}){
 const [active,setActive]=useState(0);
 const slides=useMemo(()=>items.map(item=>({src:artwork(item),title:item.directory?item.title:item.client||item.title,subtitle:item.category,alt:item.alt})),[items]);
 const item=items[Math.min(active,items.length-1)]||items[0];
 if(!items.length)return <p className="gallery-empty">No matching profiles. Try another name or choose All.</p>;
 const step=key=>{const carousel=document.querySelector('#standard-work .flex-carousel');carousel?.dispatchEvent(new KeyboardEvent('keydown',{key,bubbles:false,cancelable:true}))};
 return <>
  <div className="work-flex-stage"><FlexCarousel key={items.map(item=>item.slug).join('|')} items={slides} preset="liquid" intro="rise" cardHeight={.52} gap={18} radius={16} fit="portrait" squeeze={.16} liquid={.15} bend={.25} dispersion={.2} captureWheel={false} autoplay={false} focusOnClick captions onReady={onReady} onUnavailable={onUnavailable} onChange={index=>setActive(index)} /></div>
  <div className="work-flex-controls"><button type="button" onClick={()=>step('ArrowLeft')} aria-label="Previous client">←</button><span>Drag to explore · tap to focus</span><button type="button" onClick={()=>step('ArrowRight')} aria-label="Next client">→</button></div>
  <article className="work-flex-selection" aria-label="Selected client profile">
   <div><p className="eyebrow">{item.category}</p><h3>{item.directory?item.title:item.client||item.title}</h3><a className="primary" href={'#project/'+item.slug}>View profile <span>↗</span></a></div>
   {item.links?.length>0?<details className="work-flex-channels"><summary>Website & social links ({item.links.length})</summary><div className="profile-links">{item.links.map(link=><a key={link.url} href={link.url} target="_blank" rel="noopener noreferrer">{link.label} ↗<span className="sr-only"> for {item.title} (opens in a new tab)</span></a>)}</div></details>:<p className="section-note">{item.status}</p>}
  </article>
 </>;
}
export function mountWorkCarousel(host,items,onReady,onUnavailable){
 const root=createRoot(host);
 const render=next=>root.render(<GalleryBoundary onUnavailable={onUnavailable}><WorkCarousel items={next} onReady={onReady} onUnavailable={onUnavailable}/></GalleryBoundary>);
 render(items);return{update:render,destroy:()=>root.unmount()};
}
