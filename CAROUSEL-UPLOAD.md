# Apply the Our Work carousel update

1. Extract joyno-carousel-update.zip.
2. In GitHub's joynojohn-beep/-explore-joyno repository, upload package.json and package-lock.json at the top level, replacing the old versions. Upload REACT-BITS-LICENSE.md there too.
3. Open the repository's src folder. Upload main.ts, gallery-carousel.ts, gallery-jsx.d.ts, work-carousel.jsx and work-carousel.css from this ZIP's src folder.
4. In that same src folder, drag the entire components folder from the ZIP's src folder. Confirm GitHub shows src/components/FlexCarousel.jsx and src/components/FlexCarousel.css. Preserve the folder structure.
5. Open the repository's public folder and upload react-bits-license.txt.
6. Commit the changes. Vercel automatically installs the new React/OGL dependencies and rebuilds. A build during partially uploaded files may fail; the last complete commit must include every file above.
7. Once the newest deployment is Ready, visit https://explore-joyno.vercel.app/#standard-work. Use Carousel/Grid, drag, arrow controls, search and filters. Reduced-motion users see Grid view.

For one complete commit, use GitHub Desktop: copy all extracted src files into matching repository paths, copy the two package manifests and license files, commit and push together.

This is a website integration of the supplied React Bits component. Its attribution/license files must remain with the source and deployment. No GitHub push or Vercel publication is claimed by downloading this package.
