# JOYNO motion enhancement

The standard portfolio uses the existing cobalt, lemon, mint, coral and lavender palette. No content, client data, business claims or external links are replaced.

- Hero headline lines reveal through short masks, followed by supporting copy and actions. The soft brand glow moves slightly with native scroll. Buttons remain interactive throughout.
- IntersectionObserver triggers one-time headings, cards and content entrances using the native Web Animations API. These reveal effects use native browser APIs; the separate SwarmCursor uses WebGL particles.
- The original target reticle has been replaced by React Bits SwarmCursor. See SWARM-CURSOR.md for current pointer behavior. Prominent CTA text still moves a few pixels inside its stationary link hit area.
- Cursor layers use pointer-events:none, including in native dialog top layers. Native cursors return over inputs, text selections, the driving canvas, keyboard navigation, window exit and inactive tabs. Cursor effects require a fine hovering pointer and a viewport wider than 1050px.
- A short desktop process story pins a decorative step marker beside the original four workflow steps. Scrolling remains native. Mobile and reduced-motion layouts show a normal document flow without the sticky marker or magnetic behavior.
- Header styling changes without resizing; a thin progress indicator reflects document scroll. Section anchors standard-about, standard-work, standard-services, standard-process and standard-contact navigate within the portfolio. Dialog closes retain the portfolio scroll position.
- All source content is visible before scripts run, if animations fail, or with reduced motion. No CSS permanently hides reveal targets. Animation instances, observers, media listeners, cursor frames and event listeners are cleaned up on page exit; initialization is guarded against duplication.

Implementation: src/motion.ts, src/motion.css, plus initialization and anchor handling in src/main.ts. The production build still emits index.html and standard.html. Existing form behavior remains an email draft, not a delivery backend.

Run the production preview at port 4173, then tests/motion.test.mjs with Google Chrome installed. It covers desktop target locking, pointer transparency, native input cursors, history/anchors, story progress, no overflow, mobile fallback and live reduced-motion behavior. Existing acceptance, client and responsive suites cover the retained experience.

Deployment: upload src/main.ts, src/motion.ts and src/motion.css together to the GitHub repository's src folder, then commit once. Vercel's existing Git connection will rebuild. A prepared local change is not a claim that the Vercel deployment has changed; publication requires repository access.

