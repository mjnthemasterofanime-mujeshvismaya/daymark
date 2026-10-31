# DAYMARK - Make today count.
Offline-first daily planner. Plain HTML, CSS and JavaScript. No build step, no backend.

## Run locally
    cd DAYMARK
    python3 -m http.server 8000
Open http://localhost:8000 (Chrome DevTools > Application to inspect IndexedDB and the service worker).

## Structure
- index.html, manifest.json, service-worker.js
- css/: themes.css (colors), style.css, responsive.css (desktop sidebar)
- js/: utils.js, database.js (IndexedDB), notifications.js, views.js, sheets.js, app.js (actions + startup)

Scripts load in the order listed in index.html and share global state.

## Deploy
Host over HTTPS (GitHub Pages, Netlify). Then Chrome > Install app.

## Limits
- Notifications fire while the app is open. Alerts when fully closed need a push or scheduled-notification service, which browsers don't offer offline.
- iOS: install via Share > Add to Home Screen; notification support varies by iOS version.
- Export/import is copy-paste JSON in Settings.
