import React,{Component,useEffect,useState} from 'react';
import {createRoot} from 'react-dom/client';
import GooeyNav from './components/GooeyNav';
import './header-gooey.css';

const views=[{label:'World',href:'#explore',view:'world'},{label:'Portfolio',href:'#standard',view:'portfolio'}];
const sections=[{label:'Home',href:'#home'},{label:'The studio',href:'#about'},{label:'Our work',href:'#work'},{label:'What we do',href:'#services'}];
function sectionIndex(){const hash=location.hash;return hash.includes('about')?1:hash.includes('work')||hash.startsWith('#project/')?2:hash.includes('services')?3:0}
class NavBoundary extends Component{
 state={failed:false};static getDerivedStateFromError(){return{failed:true}}
 render(){return this.state.failed?<div className="gooey-fallback">{this.props.items.map(item=><a key={item.href} href={item.href} data-view={item.view}>{item.label}</a>)}</div>:this.props.children}
}
function HeaderNav({kind}){
 const items=kind==='views'?views:sections;
 const [index,setIndex]=useState(()=>kind==='views'?Number(document.body.classList.contains('is-standard')):sectionIndex());
 const [reduced,setReduced]=useState(()=>matchMedia('(prefers-reduced-motion: reduce)').matches);
 const [mobile,setMobile]=useState(()=>matchMedia('(max-width:1050px)').matches);
 useEffect(()=>{
  const sync=()=>setIndex(kind==='views'?Number(document.body.classList.contains('is-standard')):sectionIndex());
  const motion=matchMedia('(prefers-reduced-motion: reduce)'),size=matchMedia('(max-width:1050px)');
  const preference=()=>setReduced(motion.matches),resize=()=>setMobile(size.matches);
  window.addEventListener('hashchange',sync);motion.addEventListener('change',preference);size.addEventListener('change',resize);
  return()=>{window.removeEventListener('hashchange',sync);motion.removeEventListener('change',preference);size.removeEventListener('change',resize)};
 },[kind]);
 // Hidden desktop navigation uses ordinary links and holds no GPU resources.
 if(kind==='sections'&&mobile)return <>{items.map(item=><a key={item.href} href={item.href}>{item.label}</a>)}</>;
 return <GooeyNav key={`${reduced}-${mobile}`} items={items} activeIndex={index} onChange={next=>setIndex(next)} theme="light" color="#4336cd" activeTextColor="#ffffff" colors={['#4336cd','#c8b5ff','#ff9c88','#96e8c2']} frame={false} size="sm" animationTime={520} particleCount={mobile?6:10} spread={mobile?20:32} timeVariance={120} gooeyness={.5} wobble={.25} hoverEffect={!mobile&&!reduced} reducedMotion={reduced}/>;
}
export function mountHeaderNavigation(){
 const roots=[];
 for(const [selector,kind] of [['.view-switch','views'],['.desktop-nav','sections']]){
  const host=document.querySelector(selector);if(!host)continue;
  const root=createRoot(host);host.classList.add('gooey-mounted');root.render(<NavBoundary items={kind==='views'?views:sections}><HeaderNav kind={kind}/></NavBoundary>);roots.push(root);
 }
 return()=>roots.forEach(root=>root.unmount());
}
