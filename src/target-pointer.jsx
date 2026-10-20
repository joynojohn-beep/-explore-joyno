import React from 'react';
import {createRoot} from 'react-dom/client';
import TargetCursor from './components/TargetCursor';
import './target-pointer.css';
export function mountTargetPointer(host){
 const root=createRoot(host);
 root.render(<TargetCursor portalHost={host} targetSelector="a,button,summary,[data-cursor-label]" spinDuration={2} hideDefaultCursor parallaxOn size={36} cornerSize={12} thickness={2} padding={6} dotSize={18} blendMode="normal" />);
 return ()=>root.unmount();
}

