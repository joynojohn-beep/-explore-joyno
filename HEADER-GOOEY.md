# JOYNO header — GooeyNav

Integrated the React Bits GooeyNav source supplied by the user into the existing header. World/Portfolio uses animated merging cobalt pills on desktop and mobile; desktop navigation adds Home alongside the original Studio, Work and Services links. The logo, contact CTA, mobile menu button, routes and keyboard behavior are preserved.

The implementation reuses the React/React DOM versions already installed for FlexCarousel; no dependencies were added. Native links remain in the initial HTML and if the dynamic module cannot load. The original mobile menu stays available at widths up to 1050px.

The supplied WebGL droplet shader runs only during active transitions or hover changes. The header uses fewer droplets on phones. Reduced-motion users get a static pill without creating WebGL contexts. Unsupported WebGL uses the supplied CSS fallback pill. Hidden desktop navigation holds no GPU context. Media changes recreate the enhancement safely; leaving the page disposes roots, listeners, observers, frame loops, buffers and programs. Tab hiding cancels frames and resumes in a settled state. Decorative layers ignore pointer events and are hidden from assistive technology.

Adaptations: standard React import and removal of the Next.js use-client directive; semantic outer navigation preserved with a div component root; data-view/aria-current attributes retained; controlled route synchronization; reactive reduced motion; visibility cleanup and context disposal; JOYNO palette, responsive sizing, keyboard focus and overflow clipping.

Source: src/components/GooeyNav.jsx and GooeyNav.css; wrapper and integration: src/header-gooey.jsx, header-gooey.css, header-navigation.ts, gallery-jsx.d.ts and main.ts. Copyright (c) 2026 David Haz; MIT + Commons Clause terms remain in REACT-BITS-LICENSE.md and public/react-bits-license.txt.

Validation: production build, desktop/mobile screenshots, navigation/focus/active-state tests at 1440, 1100, 768, 390 and 320px, plus reduced-motion and WebGL fallback checks. Existing motion, gallery, carousel, responsive and static suites exercise retained behavior. Browser mobile emulation is not a physical-device test.

Publication requires the files to be committed to the existing GitHub repository. A local build is not a claim that the live Vercel website has changed.
