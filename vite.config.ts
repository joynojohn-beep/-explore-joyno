import {defineConfig} from 'vite';
export default defineConfig({build:{rollupOptions:{output:{manualChunks:(id)=>id.includes('rapier3d')?'physics':id.includes('/three/')?'three':undefined}},chunkSizeWarningLimit:2300}});
