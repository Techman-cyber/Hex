# HEX OS website

A responsive, single-page landing site for HEX OS with an interactive Three.js hero scene.

## Run locally
No build step is required. Open `index.html` in a local web server (recommended because ES modules and the GitHub API are used).

For example, with Python:
```bash
python -m http.server 8000
```
Then visit http://localhost:8000.

## Deploy
Upload the contents of this folder to GitHub Pages, Vercel, Netlify, or any static host.

## Downloads
The download section checks the GitHub Releases API for the latest published release and links directly to the first `.iso` asset it finds. If no release exists yet, it falls back to the repository's Releases page.

## Notes
- The 3D hero uses Three.js from jsDelivr CDN.
- Fonts load from Google Fonts.
- The desktop preview is an illustrative concept, not a screenshot of a live HEX OS session.
- Feature descriptions are based on the HEX OS repository README. Verify release details and hardware requirements before publishing.
