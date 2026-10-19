declare module '*.jsx' {
 export function mountWorkCarousel(host:HTMLElement,items:import('./content').Project[],onReady:()=>void,onUnavailable:()=>void):{update:(items:import('./content').Project[])=>void;destroy:()=>void};
}
