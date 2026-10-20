# Ballpit background

The standard portfolio now uses the user-supplied React Bits Ballpit as a fixed decorative background, with satin lavender, yellow, mint and coral spheres. Content panels remain readable and all pointer events pass through the background. Ball grabbing is disabled to preserve text selection and page scrolling; pointer attraction and click bursts remain available. Mobile starts with 48 balls instead of 110 and a lower pixel ratio.

The component loads only for the standard page, unmounts when it is hidden, pauses in hidden tabs, and is omitted for reduced motion. Unsupported WebGL retains the gradient background and normal page functionality. No dependencies were added. Existing React Bits attribution/license files apply.

Production build and seven browser checks passed for actual background rendering, responsive layout, forms, reduced motion, WebGL fallback, the swarm cursor, header navigation and static content. Desktop and mobile screenshots were visually reviewed.

Implementation: src/components/Ballpit.jsx, src/ballpit-background.jsx, src/ballpit-background.css and src/ballpit-navigation.ts, initialized from src/main.ts.
