declare module '*.jsx' {
 export function mountTargetPointer(host:HTMLElement):()=>void;
 export function mountBallpit(host:HTMLElement):()=>void;
 export function mountSwarmPointer(host:HTMLElement):()=>void;
 export function mountHeaderNavigation():()=>void;
 export function mountWorkCarousel(host:HTMLElement,items:import('./content').Project[],onReady:()=>void,onUnavailable:()=>void):{update:(items:import('./content').Project[])=>void;destroy:()=>void};
}


