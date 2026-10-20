# Upload the swarm cursor update

1. Extract joyno-swarm-cursor-update.zip on your computer.
2. Open the joynojohn-beep/-explore-joyno GitHub repository. Choose Add file > Upload files at the repository root.
3. Drag the extracted src folder and Markdown files into the upload area. Preserve the src/components subfolder. Upload extracted files, not the ZIP itself, and do not add an extra enclosing folder.
4. Commit to main. The existing Vercel Git connection should build automatically.
5. Wait for the newest production deployment to show Ready, then open https://explore-joyno.vercel.app/#standard and refresh.

No package.json or package-lock.json changes are required for this update: React is already installed by the previous header/carousel updates. The complete explore-joyno-swarm-ready.zip is available if the repository needs all source files.

Local implementation and tests are complete. This archive does not itself publish changes to GitHub or Vercel.
