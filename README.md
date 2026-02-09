# Flip 7 Score Calculator

A free, unofficial score tracker and rules reference for the Flip 7 card game. Track multiplayer games, calculate scores in real time, and reference Flip 7 rules (bonuses, bust, 200-point goal).

**Live URL:** https://flip7scorecard.com

---

## Tech stack

- **Markup & styling:** HTML5, CSS3 (custom properties, no preprocessors)
- **Scripting:** Vanilla JavaScript (no frameworks)
- **Fonts:** [Google Fonts](https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Overpass:wght@400;600;700&display=swap) — Bebas Neue (display), Overpass (body)
- **External services:** Hotjar (analytics/feedback), Google Analytics (G-EWP1726FBR), Buy Me a Coffee, shared footer (see below)

---

## Project structure

```
Flip-7/
├── index.html          # Main app (Play)
├── faq.html            # Redirect to /faq/
├── faq/
│   └── index.html      # Rules & FAQ page
├── script.js           # Game logic, state, UI
├── styles.css          # All styles
├── favicon.png
├── flip7-qr.png        # QR code for Share modal
├── flip7logo.png
├── robots.txt
├── sitemap.xml
├── CNAME               # flip7scorecard.com (GitHub Pages custom domain)
├── .github/
│   └── workflows/
│       └── update-sitemap.yml   # Auto-update sitemap lastmod on push/release
└── UI-DESIGN-SYSTEM.md
```

---

## Local development

Static site — no build step. Serve the repo root with any local HTTP server, e.g.:

```bash
# Python 3
python3 -m http.server 8000

# or npx
npx serve .
```

Then open `http://localhost:8000`. The app uses relative paths and works offline except for analytics, fonts, and the shared footer.

---

## Key features

- **Multiplayer score tracking:** Add/remove players, rename, switch active player via a player strip.
- **Per-round scoring:** Select number cards (0–12) and modifiers (×2, +2, +4, +6, +8, +10); real-time total and banked score.
- **Flip 7 bonus:** Detects seven unique number cards in a round and applies the +15 bonus.
- **Bust:** “Bust” action ends the round with zero points for that round.
- **Bank:** Bank current round’s score and advance to the next round.
- **Round navigation:** Prev/Next and “View Rounds” list; jump to any round; total score across rounds.
- **Game summary:** Leaderboard modal with standings; 200-point celebration and optional Buy Me a Coffee CTA.
- **Reset options:** Reset active player, all scores, or entire game (with confirmations).
- **Share:** Modal with QR code and “Copy Link” (link only; no multiplayer sync).
- **Persistence:** Game state saved to `localStorage` and restored on load (with v1→v2 migration).
- **Rules/FAQ page:** `/faq/` with rules, Flip 7 bonus, bust, solo mode, plus FAQPage structured data for SEO.

---

## External dependencies

| Dependency | Purpose |
|------------|--------|
| **Google Fonts** | Bebas Neue, Overpass |
| **Google Analytics** | `G-EWP1726FBR` (gtag.js) |
| **Hotjar** | Tracking (hjid: 6441765) |
| **Buy Me a Coffee** | Button image from `img.buymeacoffee.com` (slug: edthedesigner); linked in footer and leaderboard modal |
| **Shared footer** | See below |

No other CDN scripts or CSS; no npm/Node build.

---

## Shared footer

The “Edward Stone” footer is loaded from a separate project. In the main app and FAQ page you’ll see:

- A placeholder: `<div id="es-footer" data-project="flip7"></div>`
- A module script: `<script type="module" src="https://footer.edwardstone.design/src/footer.js"></script>`

The script injects the footer into `#es-footer`. The `data-project="flip7"` value is used so this site is highlighted as the active project in the footer nav. The footer lives in a separate repo: **es-shared-footer**.

---

## Deployment

- **Hosting:** GitHub Pages (custom domain via `CNAME`).
- **CNAME:** `flip7scorecard.com` (root of repo).
- **Automation:** GitHub Action `.github/workflows/update-sitemap.yml` runs on push to `main` and on release; it updates all `<lastmod>` dates in `sitemap.xml` and commits back to the repo.
- No other CI/CD or build steps; the site is served as static files from the repo.

---

## Legal

- **Game attribution:** Flip 7 is a trademark of **The Op Games**. This app is not affiliated with The Op Games.
- **Disclaimer:** This is an unofficial fan tool. Official game info: [The Op – Flip 7](https://theop.games/pages/flip-7).
- The same disclaimer and link appear in the in-app footer and in Schema.org structured data (WebApplication/FAQPage).
