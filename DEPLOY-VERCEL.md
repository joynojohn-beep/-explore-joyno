# Deploy Explore JOYNO to Vercel

This package contains the complete editable TypeScript, Three.js world, client data, CSS, original audio generator, public images, tests, pinned npm lockfile and build scripts. It does not depend on ChatGPT hosting, login, APIs or source retrieval. Git history, credentials, node_modules, generated screenshots and the former hosting account ID are excluded from the ZIP.

## Requirements and cost

Use Node.js 24.x. No runtime secrets, database, Functions, paid domain or paid add-on are required by the code. Vercel provides a vercel.app address, but the exact explore-joyno.vercel.app alias is unverified until Vercel assigns it. If unavailable, choose another project name such as explore-joyno-media and use the assigned address.

Select your existing JOYNO team. This export does not create a team or change any subscription. Vercel's Hobby plan is limited to personal, non-commercial use; this agency portfolio is a business use case. If the JOYNO team's current plan does not cover this use, stop rather than accepting an upgrade or trial. A free platform address does not mean the hosting plan permits business use.

## GitHub → Vercel (recommended)

1. Extract explore-joyno-vercel-ready.zip into a new folder. Open the folder containing package.json and vercel.json, not a parent folder.
2. Sign in at https://github.com/login and create a repository named explore-joyno. Choose its owner and visibility. Do not initialize it with another README or .gitignore.
3. Open a terminal in the extracted folder and run:

   ```sh
   git init
   git branch -M main
   git add .
   git commit -m "Prepare Explore JOYNO for Vercel"
   git remote add origin https://github.com/YOUR-OWNER/explore-joyno.git
   git push -u origin main
   ```

   Replace YOUR-OWNER with the actual GitHub user or organization. Authenticate in GitHub's official browser flow or Git Credential Manager. Never paste credentials into source files. GitHub Desktop's Add Local Repository → Publish Repository is an alternative.

4. Open https://vercel.com/login and sign in using the account that belongs to the JOYNO team. Complete any verification or SSO in Vercel's own page. If JOYNO is absent from the team selector, ask its administrator for access; do not deploy to a different team.
5. Select JOYNO in the dashboard, then Add New → Project. Connect GitHub and grant the Vercel GitHub integration access to this repository. Import explore-joyno.
6. Confirm these settings before clicking Deploy:

   | Setting | Value |
   | --- | --- |
   | Team | Existing JOYNO team |
   | Project Name | explore-joyno (if available) |
   | Framework Preset | Vite |
   | Root Directory | ./ |
   | Install Command | npm ci |
   | Build Command | npm run build |
   | Output Directory | dist |
   | Node.js Version | 24.x |
   | Environment variables | None required |

7. Click Deploy only under the existing permitted plan. The included vercel.json sets the build/output options. The build performs TypeScript validation and emits both index.html and standard.html. Hash routes such as /#work and /#explore require no server rewrite. Keep standard.html as a real static page.
8. Copy the production URL from Vercel. Under Settings → Domains, inspect the assigned vercel.app alias. Request explore-joyno.vercel.app only if it is available; do not purchase a custom domain. Do not claim the preferred alias until Vercel confirms assignment.
9. SEO metadata automatically uses VERCEL_PROJECT_PRODUCTION_URL, falling back to VERCEL_URL. If necessary, set SITE_URL in Production to the actual assigned HTTPS origin and redeploy. Do not set it to an unassigned preferred address. No frontend secret variables are needed.
10. Verify /, /standard.html, /#explore, /#work and /#contact on the production address. Check driving, zoom/pan, mobile portrait/landscape, gallery search, team link and music after tapping ♫. The contact form intentionally opens an email draft; it is not a server-delivered contact service.

Future pushes to main deploy through the connected Git repository. A GitHub organization repository can require a plan that permits organization integration; do not upgrade automatically.

## Official CLI login alternative

With Node.js 24 installed, run from the extracted project folder:

```sh
npx vercel@latest login
npx vercel@latest teams ls
npx vercel@latest link
npx vercel@latest --prod
```

The login command provides Vercel's official authentication flow. Complete it in your browser; keep tokens private. In link/setup, select the existing JOYNO scope and create or select explore-joyno. Use the real JOYNO team slug if supplying --scope; do not assume its display name is its slug. Review prompts and stop if a purchase or subscription change is required.

## Local verification

```sh
npm ci
npm run build
npm run preview -- --port 4173
```

Open http://127.0.0.1:4173. Browser regression tests use locally installed Google Chrome; they are not run during Vercel builds. To run them in PowerShell:

```powershell
$env:TEST_ORIGIN='http://127.0.0.1:4173'
node --test --test-concurrency=1 tests/*.test.mjs
```

SITE_URL is a build-process environment variable, not loaded from .env by the prerender script. Set it in Vercel settings or your shell. The sample .env.example documents its purpose only.

## Inspection notes

- All app code runs in the browser; Vite bundles npm dependencies locally. Rapier's compat package embeds its WASM in the physics chunk, so there is no remote physics endpoint.
- World geometry, surface maps, animations and instrumental audio are procedural. The logo, sharing image and favicon are in public/. Google Fonts remains an external stylesheet with fallback fonts.
- All client/profile data and external business links remain in src/clients.ts and src/content.ts. Company content, responsive CSS and controls are unchanged by deployment preparation.
- The physics chunk is large (about 4.33 MB raw); Vite reports an advisory size warning. It is loaded dynamically for the world, and standard.html / #standard avoid downloading the 3D engine.
- Source SEO references to the prior host are replaced at build time using the Vercel origin. The existing-host default is retained only for non-Vercel builds with no configured origin.
- No domain purchase, plan upgrade, live Vercel deployment or URL reservation is implied by this ZIP. Account/team access is required to finish publication.

Official documentation:
- https://vercel.com/docs/frameworks/frontend/vite
- https://vercel.com/docs/git
- https://vercel.com/docs/cli/login
- https://vercel.com/docs/deployments/generated-urls
- https://vercel.com/docs/limits/fair-use-guidelines
