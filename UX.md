# Creative passport interface

Responsive refinement: welcome content follows normal document flow on phones and tablets up to 1050px. Driving uses the dynamic viewport height, safe-area offsets, larger touch controls and a compact header. Landscape controls remain in the bottom corners; destination links move to the right edge. Dialogs scroll within the screen and form fields use 16px text to avoid phone focus zoom. tests/responsive.test.mjs checks 320px and 390px phones, a 768px tablet and 844px landscape, including unobstructed controls and horizontal overflow.

The October 19 refresh gives the portfolio a playful travel-ticket identity: a yellow welcome ticket, six colorful destination shortcuts, a World/Portfolio switch, and a compact driving dashboard. Direct links provide the same content without driving. Mobile shortcuts retain short captions and full accessible names.

The interface palette uses cobalt (#4336cd), coral (#ff9c88), lemon (#ffe76e), mint (#96e8c2), lavender (#c8b5ff), sky blue (#89d9fb), and dark ink (#25213c). This is an interface palette; the official JOYNO lion logo remains intact. Destination dialogs, map stops, client cards and standard portfolio sections share the visual system.

Implementation lives in src/playground.css, with navigation state in src/main.ts. Native dialogs retain Escape, focus restoration, document scrolling and keyboard access. Reduced-motion preferences disable decorative hover movement. All business content, client links, email-draft behavior and driving physics are preserved.

Validation: desktop and phone visual inspection; tests/playground.test.mjs covers shortcut colors and routing, view state, themed dialogs, gallery search, restored focus, mobile captions, touch targets, menu and overflow. Existing acceptance, camera and driving tests cover the retained interactions.
