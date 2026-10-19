import fs from 'node:fs';
import {standardHTML} from '../src/views.ts';
const file='dist/index.html';let html=fs.readFileSync(file,'utf8');
// Explicit origin wins; Vercel's production alias stays stable across previews.
const defaultOrigin='https://explore-joyno.gino163535.chatgpt.site';
const configured=process.env.SITE_URL || process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL;
const siteURL=new URL(configured?(configured.includes('://')?configured:`https://${configured}`):defaultOrigin);
if(!['https:','http:'].includes(siteURL.protocol)||siteURL.username||siteURL.password)throw new Error('SITE_URL must be a public HTTP(S) origin');
const origin=siteURL.origin;
html=html.replaceAll(defaultOrigin,origin);
html=html.replace('<main id="portfolio" hidden></main>',`<main id="portfolio" hidden>${standardHTML()}</main>`);
html=html.replace(/<noscript>[\s\S]*?<\/noscript>/,'<noscript><style>#experience{display:none}#portfolio{display:block!important}[data-contact] button{display:none}</style></noscript>');
html=html.replace('</head>',`<script type="application/ld+json">${JSON.stringify({'@context':'https://schema.org','@type':'Organization',name:'JOYNO MEDIA',url:'https://joynomedia.com/',email:'gino@joynomedia.com',address:{'@type':'PostalAddress',addressLocality:'Lapu-Lapu City',addressRegion:'Cebu',addressCountry:'PH'}})}</script></head>`);
fs.writeFileSync(file,html);fs.writeFileSync('dist/standard.html',html.replace('<main id="portfolio" hidden>','<main id="portfolio">').replace('<main id="experience">','<main id="experience" hidden>').replace('<body>','<body class="is-standard">').replace(`href="${origin}/"`,`href="${origin}/standard.html"`));
for(const path of ['sitemap.xml','robots.txt'])fs.writeFileSync(`dist/${path}`,fs.readFileSync(`public/${path}`,'utf8').replaceAll(defaultOrigin,origin));
console.log(`Prerendered portfolio and SEO metadata for ${origin}`);
