# Smooth driving update

The vehicle now uses `src/handling.ts` for gradual, time-based arcade handling, while Rapier continues to own collision transforms.

- Forward speed capped at 6.5 world units/second (previously 9).
- Reverse capped at 2.4 (previously 3.5).
- Forward acceleration capped at 5.2 units/second², with eased approach to cruising speed.
- Steering eases in and centers quickly on release. Turning sensitivity reduces at cruising speed and remains responsive at parking speeds.
- Releasing acceleration slows the van promptly. Space brakes more strongly; changing direction first slows existing momentum.
- The rounded collision box follows the van's yaw, preventing the visible car from turning independently of a fixed collision box.
- Rendered yaw interpolates between physics steps; body lean eases instead of jumping with key presses.
- Camera look-ahead is reduced to keep steering changes from dragging the view around.
- Camera zoom eases into driving mode instead of jumping to a closer distance.
- Scroll up zooms out and scroll down zooms in over the 3D world. Hold the left mouse button and drag to pan. Center restores the default zoom and view; driving eases the camera back to the van. Zoom is bounded to 0.5–2.8 times the default camera distance, and pan is bounded to the scenic district. Ctrl-wheel retains browser behavior. Panel and form scrolling does not affect the camera. Touch driving controls remain separate from mouse panning.
- The first keyboard movement now survives the transition into driving mode.
- Reset, blur and content panels clear both movement and steering state.

Four handling checks passed for progressive acceleration/speed limits, braking/reverse behavior, steering/centering and consistency between update rates. The production browser checks passed for driving and panel pause, all map checkpoints, touch controls and expanded-boundary recovery. An additional browser check validates immediate first-key response, an actual curved driving path and stopping under braking. No scenery or portfolio content changed.
