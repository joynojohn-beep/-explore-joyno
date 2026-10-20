import React,{Component} from 'react';
import {createRoot} from 'react-dom/client';
import SwarmCursor from './components/SwarmCursor';
import './swarm-pointer.css';

class CursorBoundary extends Component{
 state={failed:false};static getDerivedStateFromError(){return{failed:true}}
 componentDidCatch(){document.documentElement.classList.remove('swarm-cursor-hidden')}
 render(){return this.state.failed?null:this.props.children}
}
export function mountSwarmPointer(host){
 const root=createRoot(host);
 root.render(<CursorBoundary><SwarmCursor className="joyno-swarm" globalCursor count={800} size={2.2} spread={74} speed={.7} swirl={.6} tail={.45} trail={.45} wander={.3} depth={.45} color="#4336cd" accentColor="#ee563b" targets="a,button,summary,[data-swarm-target]" idle="hide" clickEffect="burst" hideCursor intro={false} lightMode dpr={1.25}/></CursorBoundary>);
 return()=>{root.unmount();document.documentElement.classList.remove('swarm-cursor-hidden')};
}
