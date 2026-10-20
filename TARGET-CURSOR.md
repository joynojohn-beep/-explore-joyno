# TargetCursor update

The desktop cursor now uses the user-supplied React Bits TargetCursor. Rotating brackets spring onto links and buttons, follow their rounded corners, lean with pointer motion and squeeze on click. Difference blending keeps the white reticle visible across the colorful page. Ballpit and other page animations remain unchanged.

Native cursors return for forms, text selection, keyboard navigation, driving and carousel dragging. The effect is disabled for coarse pointers, screens up to 1050px and reduced motion. The overlay is pointer-transparent and follows native dialogs into the top layer. Event listeners, animation frames, injected cursor styles and React roots are disposed on teardown. No dependencies were added. React Bits attribution/license files are retained.

The new entry is src/target-navigation.ts with src/target-pointer.jsx and src/components/TargetCursor.jsx/CSS. The previous swarm source remains unused; src/main.ts now loads only TargetCursor.

To publish: extract joyno-target-cursor-update.zip, upload the extracted src folder and Markdown files to the root of joynojohn-beep/-explore-joyno on GitHub, preserving src/components paths, and commit to main. Wait for Vercel Ready and refresh https://explore-joyno.vercel.app/#standard. Do not upload the ZIP itself or an enclosing folder.
