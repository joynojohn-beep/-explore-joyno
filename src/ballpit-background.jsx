import React from 'react';
import {createRoot} from 'react-dom/client';
import Ballpit from './components/Ballpit';
import './ballpit-background.css';
export function mountBallpit(host){
 const root=createRoot(host),mobile=matchMedia('(max-width:700px)').matches;
 root.render(<Ballpit count={mobile?48:110} colors={['#b9a1ff','#ffe273','#9ae4c6','#ff9d8d','#7063db']} material="satin" gravity={0} drift={0.25} minSize={0.35} maxSize={0.8} followCursor={!mobile} grab={false} clickEffect="burst" intro={false} dpr={mobile?1:1.25}/>);
 return ()=>root.unmount();
}
