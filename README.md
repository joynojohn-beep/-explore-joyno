# Explore JOYNO

For independent hosting under the JOYNO Vercel team, follow [DEPLOY-VERCEL.md](DEPLOY-VERCEL.md). The included vercel.json configures Vite, npm ci, npm run build and dist output, with Node.js 24.x.

An original interactive JOYNO MEDIA portfolio: a miniature tropical creative campus, six destinations, an orange delivery van and a complete HTML portfolio. The official website remains unchanged. This is a separate public site; visitors do not need a ChatGPT sign-in.

The colorful creative-passport interface is documented in [UX.md](UX.md), with responsive visual styling in `src/playground.css`.

The header uses the supplied React Bits GooeyNav with the same React runtime as the client carousel. See [HEADER-GOOEY.md](HEADER-GOOEY.md) for behavior and [HEADER-UPLOAD.md](HEADER-UPLOAD.md) for deployment steps.

The desktop pointer now uses the supplied React Bits SwarmCursor, with click bursts and native cursor fallbacks. See [SWARM-CURSOR.md](SWARM-CURSOR.md) and [SWARM-UPLOAD.md](SWARM-UPLOAD.md).

The standard portfolio has a colorful React Bits Ballpit background. See [BALLPIT.md](BALLPIT.md) and [BALLPIT-UPLOAD.md](BALLPIT-UPLOAD.md).

## Run

Requires Node.js 24+ and npm. Developed on Windows 11 with Node 24.21.0.

```sh
npm ci
npm run dev
```

Open the printed localhost URL. Production build:

```sh
npm run build
npm run preview -- --port 4173
```

`dist/` is a static deployable site. Serve over HTTP, not `file://`; use HTTPS for production. No secrets or backend environment variables are required. `npm run build` type-checks TypeScript, bundles the application, and prerenders shared portfolio content into both `index.html` and `standard.html`. Keep the entire `dist/assets` folder with the HTML.

## Architecture

Vanilla TypeScript + Vite + Three.js + Rapier, with native HTML dialogs and forms. The Our Work section mounts the supplied React Bits FlexCarousel as an isolated, lazy-loaded React + OGL component. The existing HTML grid remains available for static browsing, reduced motion and unsupported WebGL.

- `src/content.ts`: editable company, destinations, services, projects and proposed process data.
- `src/clients.ts`: all 55 supplied client, company and team profiles, with 244 website and social links. Includes 39 JOYNO MEDIA clients and 12 Casa Amorosa clients; the three company profiles and Gino’s profile are labeled separately.
- `src/views.ts`: shared HTML content, case studies and standard portfolio.
- `src/main.ts`: lifecycle, accessible navigation/dialogs, keyboard/touch input, email drafts, fallback and quality controls.
- `src/world.ts`: procedural original scenery, material batching, Rapier colliders, arcade vehicle, checkpoint recovery, camera and render loop.
- `src/handling.ts`: eased throttle, braking, reverse and speed-sensitive steering. See `DRIVING.md` for the control tuning and validation scope.
- `src/camera-navigation.ts`: wheel zoom (up out / down in), captured mouse drag on the ground plane, bounded panning, Center and driving follow recovery. Events are scoped to the world; content panels retain normal scrolling.
- `src/plaza.ts`: Mactan Newtown-inspired fountain, dolphin forms, planted roundabout, boulevard furniture and glass-fronted towers. See `PLAZA.md` for reference sources and scope.
- `src/town.ts`: continuous coastal neighborhood based on the supplied aerial reference, with a pavilion, residential cluster, offices, avenues, parking, distant houses and sunset sky. This replaces the original small floating campus base.
- `src/realism.ts`: original surface maps, outdoor reflections, curved dolphins and fine palm geometry. The scene uses a stable perspective camera and physically based material response.
- `src/audio.ts`: original instrumental music loop and quiet driving tone, off until user activation, visibility pause. Music continues while parked or reading panels.
- `src/style.css`: responsive layout, touch controls, readable HTML and reduced-motion handling.
- `scripts/prerender.mjs`: crawlable portfolio and Organization metadata.
- `tests/experience.test.mjs`: browser acceptance checks.

Version pins are recorded in `package.json` and `package-lock.json`: Three 0.186.1, Rapier compat 0.21.0, Vite 8.3.4 and TypeScript 5.9.3. The installed packages passed `npm audit` with zero reported vulnerabilities at initial installation on October 16, 2026.

## Controls

Focus the world or select **Let’s explore**. WASD/arrows drive, Space brakes, E/Enter interacts, R resets to the latest safe checkpoint, M opens the map, Escape opens the menu or closes a dialog. Movement keys are intercepted only while the world has focus. Form fields never drive. The menu, map, navigation and standard portfolio provide immediate access to every section. Mobile has four directional controls and a brake; accelerate and steer can be held together.

The world uses a fixed 60 Hz timestep with five maximum catch-up steps, CCD, simple cuboid collisions, render interpolation, bounded speed and frame-rate-independent camera damping. Rotation is constrained to an arcade heading; upside-down states cannot occur. Out-of-bounds and prolonged immobility reset velocity and return to a safe checkpoint. Map destinations spawn outside buildings. The browser tab pauses rendering/simulation and audio when hidden.

## Content and brand verification

Reviewed the actual homepage HTML at https://joynomedia.com/ on October 16, 2026. Initial fetches timed out; a subsequent direct HTTP fetch succeeded. The homepage identifies WordPress, Astra, Elementor, Yoast and WPForms. Its deployment host, analytics account, CMS credentials and form-delivery settings were not available. No existing integrations were reused or changed.

Verified: JOYNO MEDIA name, official lion logo asset, orange `#f44a25` / ink `#1b1f29` website tokens, six service areas, Cebu location, `gino@joynomedia.com`, Philippine phone number, and Moreno Pizza PH’s published client/challenge/service scope. Editorial summaries paraphrase published descriptions without numerical marketing claims. The environmental sage, cream, gold and pink colors are provisional art-direction tokens, not official brand colors.

Missing: approved case-study imagery, deliverable inventories, detailed approaches, verified results, official process approval and a form backend. All 55 entries in the client list supplied on October 16, 2026 are included, alongside the existing Moreno Pizza PH case-study reference. The two placeholder projects were removed. The process is labeled as a proposed draft. No testimonials, clients, service assignments, awards or results were invented. Client entries link to the supplied online channels; they do not claim that JOYNO built a particular site or delivered unspecified work.

To add a client profile, edit `clientEntries` in `src/clients.ts`; use a unique slug, accurate group, and public website/social links. To add a detailed case study, edit `projects` in `src/content.ts` and supply verified details. Project routes are `#project/<slug>`. Artwork is original typography, not official client logos or client work. To use approved media, extend `art()` in `src/views.ts` to render the supplied image field. The gallery supports search, group filters and native expandable links that work without JavaScript.

## Contact delivery

The inquiry form validates in the browser and opens an editable `mailto:` draft. It does not send a request or claim success. A verified direct email and phone are always provided. Draft values survive panel changes in page memory and are not saved to disk. They disappear on refresh. Some visitors may have no configured email application; the page explicitly explains the alternative.

For real submission, add an approved server endpoint or existing WPForms integration with consent, server-side validation, abuse protection and delivery monitoring. Replace the submit handler in `src/main.ts`; preserve fields on failures and only show success after a confirmed response. Do not place mail-service keys in frontend code. Loading/success/failure delivery states are intentionally not simulated while no backend exists.

## Hosting and SEO

`.openai/hosting.json` identifies the public Site and `dist` output. Sites publication uses the skill’s source workflow helper to push the source and package a matching build, then saves and deploys that version. For another static host, upload `dist/`. Update canonical URLs, Open Graph origin, sitemap and robots in `index.html` and `public/` to the chosen final domain. The prerender script creates `/standard.html`, which does not initialize the 3D engine until requested. Hash deep links support browser history but are not separate indexable case-study URLs; public SEO expansion should add dedicated case-study HTML routes when approved content is available.

This is not a replacement deployment of joynomedia.com; no redirects were applied. If adopted as a replacement, retain existing indexed WordPress URLs, map `/about-us/` to approved About content, `/case-studies/` to project landing pages, service URLs to matching service pages, and `/contact-us/` to Contact. Prefer real server routes for that migration, with 301 redirects and Search Console review, rather than redirecting all existing URLs into hashes.

## QA

With the production preview running, PowerShell:

```powershell
$env:TEST_ORIGIN='http://127.0.0.1:4173'
npm test
```

Tests use locally installed Google Chrome via Playwright. Set up Chrome before running; the tests do not install or modify it. See `VERIFICATION.md` for results and limits. Development diagnostics are read-only at `window.joynoDiagnostics` and include renderer calls, triangles, sampled FPS, current position and state. No visitor analytics is installed.

## Before public launch

Provide approved project media and accurate case-study details; approve the proposed process copy; connect contact delivery if desired; replace provisional art colors if brand guidance differs; test on actual mid-range iOS/Android devices and with a screen reader; update final-domain SEO and redirects. The Site is public at the user's request.


