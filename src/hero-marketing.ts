const platforms=[
 {name:'Facebook',color:'#1877f2',icon:'<path d="M28 42V26h6l1-7h-7v-4q0-3 4-3h4V6h-6q-10 0-10 10v3h-5v7h5v16Z" fill="currentColor"/>'},
 {name:'Instagram',color:'#d83aa0',icon:'<rect x="8" y="8" width="32" height="32" rx="10"/><circle cx="24" cy="24" r="8"/><circle cx="34" cy="14" r="2" fill="currentColor" stroke="none"/>'},
 {name:'TikTok',color:'#242139',icon:'<path d="M28 8v23a8 8 0 1 1-7-8M28 8q2 11 12 11" stroke-width="5"/><path d="M30 9q2 8 10 8" stroke="#ff6a9e"/>'},
 {name:'YouTube',color:'#f34256',icon:'<rect x="5" y="11" width="38" height="26" rx="8" fill="currentColor" stroke="none"/><path d="m20 17 12 7-12 7Z" fill="var(--disc-color)" stroke="none"/>'},
 {name:'Twitter / X',color:'#36324b',icon:'<path d="M10 8h9l19 32h-9ZM37 8 11 40" stroke-width="3"/>'},
 {name:'LinkedIn',color:'#0a79bc',icon:'<path d="M10 20v20M21 40V20m0 9q0-10 8-10t8 10v11" stroke-width="6"/><circle cx="10" cy="11" r="3.5" fill="currentColor" stroke="none"/>'},
 {name:'Pinterest',color:'#d92e52',icon:'<path d="m18 42 5-25m-1 11q13 8 14-8Q37 6 25 7 10 7 11 22q0 5 4 8" stroke-width="5"/>'},
 {name:'Reddit',color:'#ff723f',icon:'<ellipse cx="24" cy="28" rx="17" ry="12"/><path d="m25 16 4-10 9 2M17 32q7 5 14 0"/><circle cx="39" cy="9" r="3"/><circle cx="17" cy="26" r="2" fill="currentColor"/><circle cx="31" cy="26" r="2" fill="currentColor"/><path d="M9 20q-9-6-7 4m37-4q9-6 7 4"/>'},
 {name:'Website',color:'#6e4fe2',icon:'<circle cx="24" cy="24" r="18"/><ellipse cx="24" cy="24" rx="8" ry="18"/><path d="M7 17h34M7 31h34"/>'}
];
export function marketingHeroArt(){return `<div class="marketing-scene social-drop-scene" aria-hidden="true"><div class="social-drop-glow"></div>${platforms.map((p,i)=>`<div class="social-drop" data-platform="${p.name}" style="--disc-color:${p.color};--lane:${[8,58,31,68,2,46,20,73,39][i]}%;--delay:${-i*.84}s;--tilt:${i%2?-18:18}deg"><div class="social-disc"><svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" focusable="false">${p.icon}</svg></div></div>`).join('')}<div class="social-ribbon"></div></div>`}
