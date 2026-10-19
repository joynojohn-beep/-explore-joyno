# Our Work — FlexCarousel integration

The requested React Bits FlexCarousel replaces the standard portfolio's default card-grid presentation with a liquid-bending, draggable row. The supplied source and CSS live in src/components/. The rest of the website remains vanilla TypeScript, with the existing driving world, target cursor, content, navigation, dialogs, forms and profile routes retained.

React 19.3.1, React DOM 19.3.1 and OGL 1.0.11 are pinned in package.json and package-lock.json. The React/OGL component chunk loads only near the visible standard gallery; it is approximately 94 KB compressed. No stock photos or third-party image requests are used: the existing category colors, client initials and names are rendered into small local SVG textures. These are typographic profile illustrations, not client logos.

Behavior:
- Liquid preset, rise entrance, inertial horizontal dragging, modest speed squeeze, focus-on-click and animated captions/counter.
- Previous/Next buttons, keyboard arrows/Home/End and touch swipes. Vertical wheels and vertical touch scrolling continue moving the page. Autoplay is disabled.
- All 56 profiles/projects and all 244 supplied links remain in the existing grid. Search and all category filters synchronize the carousel. The selected profile also exposes its existing route and website/social channels.
- Grid mode switches back to the complete HTML gallery. The work dialog retains its existing grid. Reduced-motion preferences and unavailable WebGL use Grid mode without mounting the animation. Without JavaScript, the original prerendered gallery and links remain available.
- The GPU renderer stops requesting frames at rest/offscreen and pauses when the tab is hidden. Unmounting disposes textures, observers, events and the WebGL context. The wrapper catches initialization errors and retains the grid.

Component changes relative to the user-supplied source: classic React import for Vite, removal of the Next.js-only use-client directive, readiness/fallback callbacks, and hidden-tab frame cancellation. Integration props disable vertical-wheel capture and autoplay. Source notice and terms are retained in REACT-BITS-LICENSE.md (MIT plus Commons Clause); this application integration is not a component/template resale package.

Validation: production TypeScript check, Vite build and prerender; desktop and mobile visual inspection; tests/carousel.test.mjs covers controls, wheel scrolling, search/filter synchronization, profile links, grid switching, touch layout, reduced motion and WebGL fallback. Existing client/static/motion/navigation suites cover retained content and accessibility.

Deployment: upload the supplied update files into their matching GitHub locations, including src/components/ and the two root package manifests. Commit together. Vercel will install the new pinned dependencies and rebuild. This local implementation is not claimed published until the GitHub/Vercel deployment is verified.
