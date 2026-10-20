# Real Three.js social-logo hero

This replaces the previous CSS discs with a transparent Three.js canvas over a white hero. The JOYNO text, colors, primary button, secondary link and their original destinations remain accessible HTML. Other sections, navigation, Ballpit and cursor are retained.

The nine platform marks are solid local geometry. Filled SVG shapes use beveled ExtrudeGeometry; stroke contours receive closed front/back surfaces and side walls. Logos have physical glossy materials, procedural studio reflections, key/rim lighting and individual rotations. There are no coins or backing badges. The local simplified platform vectors are in src/hero-icons.ts; these are vector interpretations, not an externally downloaded official logo asset pack.

The lavender ribbon has a fixed curved surface, underside, edge walls, visible thickness and procedural fine surface lines. Depth testing naturally hides logo portions behind it. Controlled paths drop from the upper left, traverse the valley and rise toward the right. A 4.245-second phase cycle and staggered clusters repeat offscreen. Mobile reframes the scene below the controls.

Rendering loads when the hero becomes visible, pauses offscreen and in hidden tabs, caps DPR at 1.5, uses a static composition for reduced motion and retains prerendered SVG fallback art when WebGL is unavailable. Geometry, materials, textures, environment target, observers, events and renderer are disposed on exit. No packages were added.

Validation: production TypeScript/Vite/prerender build passed. Browser checks passed at 1440, 820 and 390px: all nine logo groups, real canvas rendering, exact text, white background, no horizontal overflow, clickable contact action, reduced-motion pause, offscreen pause and no page errors. Blocked-WebGL fallback and JavaScript-disabled content passed. Existing header/navigation checks passed. Screenshots at multiple animation times were compared with the supplied recording frames.

Limitation: this is a newly built scene; the recording does not supply the original models, camera, materials or keyframes. It cannot establish an exact frame-for-frame match. Ribbon shape and choreography are reconstructed from the visible reference.

## Upload

1. Extract JOYNO-REAL-3D-HERO.zip into a new folder.
2. Open the GitHub repository ROOT, choose Add file > Upload files, and drag in the extracted src folder. Confirm paths begin with src/ (not src/src/ and not bare files at root).
3. Commit to main. Wait for the newest Vercel deployment to show Ready, then refresh https://explore-joyno.vercel.app/#standard.

The patch includes six required source files: src/main.ts, src/hero-marketing.ts, src/hero-marketing.css, src/hero-icons.ts, src/hero-three.ts and src/hero-three-loader.ts. Package and Vercel settings are unchanged.
