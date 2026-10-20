# Swarm cursor

The user-supplied React Bits SwarmCursor replaces the previous target reticle. It uses 800 WebGL particles, JOYNO cobalt/coral colors, interactive-target attraction and click bursts. No dependencies were added.

The overlay never intercepts clicks. Native cursors return for form fields, text selection, keyboard navigation, the driving canvas and carousel dragging. Phones, narrow screens, reduced-motion preferences and unavailable WebGL keep native cursor behavior. Animation pauses while hidden or idle; dialog overlays follow the native top layer.

Implementation: src/components/SwarmCursor.jsx and CSS; src/swarm-pointer.jsx and CSS; lifecycle in src/swarm-navigation.ts. React Bits attribution and license remain in REACT-BITS-LICENSE.md and public/react-bits-license.txt.

Validation: production TypeScript/Vite/prerender build passed. Two swarm browser tests confirm actual WebGL drawing, clicks, dialogs, native-input restoration, mobile/reduced-motion and unavailable-WebGL fallback. Eight regression tests passed for motion, navigation, carousel and static content.
