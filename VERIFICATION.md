# Verification — October 16, 2026

## Environment

Windows desktop, Node 24.21.0, npm 11.19.0, locally installed Google Chrome controlled with Playwright 1.56.1. Desktop viewport 1440×1000; portrait mobile emulation 390×844 with touch enabled; reduced-motion media emulation; forced WebGL initialization failure. The browser runs on the development computer, not a physical phone.

## Checks

- Production TypeScript check and Vite build completed.
- All eight browser acceptance scenarios and two static/no-JavaScript checks passed against the production preview, with zero blocking page errors after teardown repair.
- Desktop and portrait screenshots reviewed; island scale and mobile welcome framing adjusted.
- Browser acceptance suite covers acceleration/braking, safe reset/bounds, panel pause while typing, all five destination teleports and E interactions, filtering/case study routes, direct Contact, back/forward, email validation and draft retention, mobile input and scrolling, WebGL fallback, lightweight standard entry and reduced-motion/focus behavior.
- Form integration intentionally remains a validated email draft flow; no live backend submission is tested or represented as working.
- Prerendered standard HTML and no-JavaScript content provide essential business information without WebGL.

## Performance observations

Initial desktop browser sample: 57 FPS, 428 draw calls, 10,592 triangles. After static scenery batching: 58 FPS, 150 draw calls, 11,420 triangles. Samples came from the same automated desktop browser environment over short runs; these are observations, not guarantees of sustained frame rate. High quality caps device pixel ratio at 1.75; Light caps it at 1 and disables shadows. Mobile defaults to Light. No expensive postprocessing or transparent full-screen effects are used.

Production engine download before compression: Three ~566 KB; Rapier compat ~4.33 MB (embedded WASM), with about 143 KB and 1.67 MB gzip respectively. Application ~23 KB (9 KB gzip), scene ~13 KB (5 KB gzip), stylesheet ~15 KB (4 KB gzip). Vite reports a large physics-chunk warning; it is documented rather than hidden. Standard entry defers all engine/physics/scene chunks. Logo is 52 KB. Portfolio prerendered HTML is approximately 12 KB.

## Client gallery update

The October 16 client import adds all 55 supplied profiles and 244 links, retaining Moreno Pizza PH for 56 gallery cards. TypeScript and the production build pass. Three new targeted checks pass for complete source coverage/public link normalization, search/filter/detail/mobile behavior, and all 244 links with JavaScript disabled. History navigation and both prerendered/static checks were rerun for the expanded gallery. Desktop and 390px portrait gallery screenshots were inspected. No client service scopes or results were inferred from the supplied channel list. The expanded prerendered HTML is approximately 97 KB, with application JavaScript approximately 46 KB (14 KB gzip).

## Remaining verification limits

Physical mobile GPU/thermal/network performance, Safari/Firefox, screen-reader announcements, long-duration driving, email-client configuration, production message delivery and final-domain SEO have not been certified. No performance claim is made for a representative mid-range phone. Detailed case-study content and imagery need approval. Before a public launch, run those checks on real target devices and complete editorial review.
