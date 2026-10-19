# Mactan Newtown plaza update

The user requested that the miniature plaza resemble Mactan Newtown using https://maps.app.goo.gl/pxkBCbWFK85zWNKE6. The short link resolves to The Mactan Newtown at approximately 10.3083, 124.0113 and includes an entrance photo reference. Reference sources reviewed:

- https://megaworldinternational.com/properties/the-mactan-newtown/
- https://yourhome.ph/property/the-mactan-newtown/
- https://cebutrip.net/en-us/local/view/cebumangoes-festival

The new scenery is a stylized original interpretation, not a surveyed reconstruction. It adds a circular tiered fountain, bronze-colored dolphin sculpture, formal planted ring with purple accents, paired palms, pale glass-fronted towers, gray boulevard surfaces, crossings, street lights and benches. JOYNO signage and all business destinations remain part of the portfolio. No other business's endorsement is implied. No reference photos, Google map tiles or third-party models are embedded in the application.

Implementation: `src/plaza.ts` defines the landmark and tower architecture. `src/world.ts` owns integration, batching and physics. A fixed cylinder collider protects the central fountain and planting. Existing destination checkpoints remain outside the towers and fountain; driving speed, resets and map navigation retain their behavior. Water jets are static optimized geometry; there is no new camera or water animation that would bypass reduced-motion preferences.

Desktop and 390×844 portrait screenshots were reviewed. A short desktop capture reported approximately 42 FPS, 182 draw calls and 28,960 triangles in the development Chrome environment; this is a short-run observation, not a physical mobile performance guarantee. Mobile continues to default to Light quality. No new network assets were added; original procedural geometry is batched by material.

Validation: production TypeScript/Vite build passed. The three affected browser scenarios passed against the production preview: driving/braking/reset/bounds/panel pause, every destination shortcut and interaction, and touch driving/Light quality/panel scrolling. No blocking page errors were reported.

## Realism refinement

The next visual pass replaces the orthographic camera with a modest 36-degree perspective camera, retaining the elevated stable follow view. `src/realism.ts` adds original deterministic asphalt, paving, grass and water surface maps generated locally at 256×256, a prefiltered outdoor sky/sun reflection environment, pinnate palm fronds with individual tapered leaflets and bark rings, and curved tapered dolphin bodies with organic fin silhouettes. Glass and bronze have distinct metalness/roughness values. Fountain water uses clearcoat, subtle surface relief and partial transparency. Pavements and multi-clump shrubs provide additional scale cues. No new downloaded assets, runtime network requests, water animation or postprocessing passes were introduced.

The perspective layout was reviewed at 1440×1000 and 390×844, including the closer driving view. Five affected browser checks passed: driving/reset/bounds/panel pause, all map destinations, mobile controls, forced WebGL failure, and reduced-motion/focus behavior. A separate visual QA run reported no blocking page errors. Short-run observations on the development computer were 50 FPS / 214 calls / 97,880 rendered triangles for desktop High and 60 FPS / 116 calls / 49,314 triangles for portrait touch emulation in Light. These values precede the final small shrub/window-tone refinement and remain observations rather than a device performance guarantee. Real Android/iOS hardware still needs testing.

This remains an optimized interactive architectural miniature, with more lifelike geometry and material response; it is not a photographic reconstruction of the estate. `scripts/realism-qa.mjs` can reproduce the two local visual profiles with the production preview at port 4173.

## User-supplied aerial composition

The user supplied `C:/Users/Joyno IT/Downloads/unnamed.png` (407×271) to clarify the requested direction. The scene was substantially rebuilt as a continuous neighborhood rather than a model on a small raised base. Its composition now includes a central fountain junction, a burgundy octagonal pavilion, a broad mid-rise office, a taller residential cluster farther left/back, low commercial buildings, parking lots, continuous multi-lane avenues, roadside trees, irregular neighboring houses, open land, a coastal horizon, sunset clouds and warm light pools. Building footprints are kept clear of travel lanes. The photo guides composition; it is not used as a stretched background or redistributed asset.

All six destinations were repositioned to the new district and the map uses matching coordinates. About is in the mid-rise, Work in the pavilion, Services at the residential podium, Process in a low commercial building, and Contact beside the front avenue. Safe spawn remains at (0,8). The ground collider and reset bounds are expanded to support scenic drives, with reset at ±105 world units. The camera transitions from a low aerial establishing view to the elevated driving view. The welcome and control overlays have translucent panels to remain readable against the larger scene.

The production build passed. Five affected browser scenarios passed, covering driving/reset/panel pause, all shortcuts, touch controls, WebGL fallback and reduced motion. All map shortcuts were rerun after final building clearances. Desktop and portrait screenshots were inspected. A separate desktop High profile sampled approximately 40 FPS / 237 calls / 190,188 rendered triangles, while portrait Light emulation sampled 60 FPS / 120 calls / 95,612 triangles. These are short local observations, not real mobile hardware guarantees. No client data or external client links changed.

An additional scenic-avenue browser check drove beyond x=90, verified reset at the expanded boundary to the safe Contact checkpoint, and confirmed that recovery clears velocity and held input. It passed without blocking page errors.

## Compact district

At the user's request, the location was reduced to focus on the core plaza. The playable limits changed from ±105 on both axes to ±70 horizontally and ±60 in depth (about 62% less playable area). The long avenues were cut to 130 units, the distant neighborhood reduced from 220 houses to 40, decorative field patches reduced, and camera pan bounded to ±55. All six destinations and client content remain available. The aerial view is centered closer to the plaza, while the driving camera starts slightly farther out for easier navigation. Wheel zoom, dragging and Center remain available.
