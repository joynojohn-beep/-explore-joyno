# Upload the GooeyNav header update

1. Extract joyno-gooey-header-update.zip.
2. Open the existing GitHub repository's src folder. Upload main.ts, gallery-jsx.d.ts, header-navigation.ts, header-gooey.jsx and header-gooey.css from this ZIP's src folder, replacing existing versions where applicable.
3. Open src/components in GitHub. Upload GooeyNav.jsx and GooeyNav.css from the ZIP's src/components folder.
4. Commit the complete set of changes. No package.json or lockfile changes are needed; React was installed with the previous carousel update.
5. Wait for Vercel's newest deployment to show Ready, then refresh https://explore-joyno.vercel.app/#standard. Try the World/Portfolio switch and the desktop header links. On phones, the existing menu button remains available.

Keep the existing React Bits license files in the repository and public folder. For a single commit, use GitHub Desktop to copy the extracted src files into matching paths, then commit and push together.
