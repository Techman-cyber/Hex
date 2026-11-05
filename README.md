# HEX OS Website

Premium, responsive landing page for HEX OS.

## Repository split

- **Website source:** `Techman-cyber/Hex`
- **Operating system source + releases:** `Techman-cyber/Hex-OS`

The download button calls the GitHub Releases API for **`Techman-cyber/Hex-OS`** and downloads the `.iso` asset from its latest published release. It never checks this website repository for OS downloads.

## Run locally

Use Python:

```bash
python -m http.server 8000
```

Open http://localhost:8000.

Or use VS Code Live Server.

## Deploy

Publish the contents of this folder using GitHub Pages, Vercel, Netlify or another static host. Keep `index.html`, `style.css`, `script.js` and `assets/` together.

## Release behavior

- Finds the latest published release from `Techman-cyber/Hex-OS`.
- Selects the first `.iso` asset.
- Shows the release tag and ISO size.
- Looks for a SHA256/checksum asset and updates the verification note.
- If no release or ISO is available, the button safely links to the OS Releases page.

GitHub's public API has an unauthenticated rate limit. The site gracefully falls back to the Releases page if the API is unavailable.

## Notes

The desktop shown on the page is an original conceptual visual, not a screenshot of a running HEX OS build. Update it with real screenshots when available.


## Fixed v0.1.0 release link

The download section also includes a dedicated **Download v0.1.0** button linking directly to the requested release page: https://github.com/Techman-cyber/Hex/releases/tag/v0.1.0. The separate latest-ISO button continues to resolve the latest ISO from the OS repository (`Techman-cyber/Hex-OS`).
