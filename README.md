# HEX OS Website

Responsive landing page for HEX OS (Debian 12 + KDE Plasma).

## Repositories

- **Website source:** `Techman-cyber/Hex`
- **Operating system source + releases:** `Techman-cyber/Hex-OS`

The download button asks GitHub for the latest release of `Techman-cyber/Hex-OS` and downloads its `.iso`.
If that lookup fails, it links straight to `releases/latest/download/hex-os.iso`, so it never goes out of date.
To use another repo, change `OS_REPO` at the top of `script.js`.

## Run locally

```bash
python -m http.server 8000
```

Open http://localhost:8000.

## Deploy

Publish this folder with GitHub Pages, Vercel, Netlify or another static host. Keep `index.html`, `style.css`, `script.js` and `assets/` together.

## Notes

The desktop shown on the page is an original conceptual visual, not a screenshot of a running HEX OS build. Update it with real screenshots when available.
