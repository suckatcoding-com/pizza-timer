# Pizza Timer

A small, dependency-free web app to run a pizza timer in your browser.

**Live demo / local usage**

- Open `index.html` in any modern browser, or serve the folder over HTTP:

```
python -m http.server 8000
# then open http://localhost:8000
```

**What it is**

This project provides a lightweight timer UI (HTML/CSS/JS) intended for kitchen use — a quick visual and audible timer for baking pizza or other recipes. It includes:

- Calculates the time for each step based on its target completion time
- Optional service worker for offline support (`sw.js`)
- Basic internationalization support (`i18n.js`)

**Development**

- No build step required — just edit files and reload the page.
- If you prefer a local static server, use `npx http-server` or the Python command above.

**Contributing**

Contributions are welcome. Please open issues or pull requests with small, focused changes. Keep the app dependency-free and accessible on small displays.

**License**

This project is provided under the terms in the repository `LICENSE` file.
