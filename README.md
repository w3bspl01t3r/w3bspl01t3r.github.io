# ZDayLabs security portfolio

Static GitHub Pages site for ZDayLabs security services, engagement models, vulnerability research, and technical notes.

## Site structure

- `index.html` - portfolio landing page
- `services.html` - security capabilities and deliverables
- `engagements.html` - representative engagement tracks and delivery process
- `research.html` - published CVE and vulnerability research
- `blogs.html` - technical articles and Java gadget-chain notes
- `contact.html` - privacy-conscious email intake
- `policy.html` - coordinated vulnerability disclosure policy
- `style.css` - shared visual system and responsive layout
- `navigation.html` / `navigation.js` - shared navigation

Existing vulnerability write-ups, proof-of-concept files, images, and videos remain in their original locations.

## Local preview

From the repository root:

```sh
python3 -m http.server 4173
```

Then open `http://127.0.0.1:4173/`.

The site has no analytics, external JavaScript, form backend, or build-time dependency. GitHub Pages can serve it directly.

## Validation

```sh
python3 scripts/check_site.py
```

The check parses every root HTML page, validates local links and assets, detects duplicate IDs, confirms the shared shell on portfolio and research pages, and rejects em dash or en dash characters.
