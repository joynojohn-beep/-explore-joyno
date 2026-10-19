# Vercel preparation verification — October 19, 2026

- Reviewed the full source/assets inventory and hosting/build dependencies. Deployment preparation changes only build configuration, Node version selection, metadata generation, ignore rules and documentation; no UI, scene, client data or control modules changed.
- Clean npm ci succeeded using the pinned package-lock.json. npm reported zero known vulnerabilities.
- Production build (TypeScript check, Vite bundle and HTML prerender) passed on Node 24.21.0. A SITE_URL value of https://explore-joyno.vercel.app was used solely to test metadata; this does not assert that the name is available or reserved.
- Verified index.html, standard.html, sitemap.xml and robots.txt contain the configured test origin and no references to the prior hosting address. standard.html has its own canonical URL.
- Nine production browser/data checks passed: music, camera navigation, client data integrity, gallery/mobile details, no-JavaScript client links, driving, four responsive viewports, prerendered content and renderer-free standard entry. Chrome emulation is not a physical-device test.
- Existing advisory: large physics chunk (~4.33 MB raw). There are no build errors; the renderer and physics are dynamically loaded for the world.
- Vercel integration discovered but not connected at preparation time; no Vercel CLI authentication or VERCEL_TOKEN was present. JOYNO team membership, plan eligibility and preferred alias availability remain unverified. No Vercel production deployment has been performed.
- ZIP exports all source/public assets/build inputs/tests/documentation and a SHA-256 file manifest. It excludes credentials, Git history, the prior provider's account ID, installed dependencies, generated builds and QA screenshots. Reinstall dependencies and build from source with npm ci and npm run build.
