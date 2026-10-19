import {defineConfig} from 'vite';
// Rapier compat embeds its WASM in the existing lazy physics chunk (~4.33 MB).
// Budget for that required asset; this does not reduce the download size.
export default defineConfig({build:{rollupOptions:{output:{manualChunks:(id)=>id.includes('rapier3d')?'physics':id.includes('/three/')?'three':undefined}},chunkSizeWarningLimit:4500}});
