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
├── index.html              # Main app (Play)
├── faq.html                # Redirect to /faq/
├── faq/
│   └── index.html          # Rules & FAQ page
├── script.js               # Game logic, state, UI
├── styles.css              # All styles
├── package.json            # Playwright + serve (dev only)
├── playwright.config.js    # E2E test config
├── tests/
│   └── game.spec.js        # Playwright E2E test suite
├── favicon.png
├── flip7logo.png
├── robots.txt
├── sitemap.xml
├── CNAME                   # flip7scorecard.com (GitHub Pages)
├── .gitignore              # node_modules, test artifacts
├── .github/
│   └── workflows/
│       ├── update-sitemap.yml  # Auto-update sitemap lastmod
│       └── e2e.yml             # Playwright E2E tests on PR/push
├── UI-DESIGN-SYSTEM.md
├── TRACKING.md
├── CHANGELOG.md
└── CTO-ROLE.md
```

QR code in Share modal is client-generated (qrcode-generator CDN); no static QR image.

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

## Running tests

The project uses [Playwright](https://playwright.dev/) for end-to-end testing.

### Setup (one-time)
```bash
npm install
npx playwright install chromium
```

### Run tests
```bash
npm test                 # Headless (CI default)
npm run test:headed      # Watch in browser
npm run test:ui          # Playwright UI mode
```

Tests run automatically on PRs and pushes to `main` via GitHub Actions (`.github/workflows/e2e.yml`). Failures block merging.

### Test coverage
The suite covers: game load, card selection, bank, bust, Flip 7 detection, round navigation, 200-point celebration, add/remove player, single and multi-player rename, and all reset flows.

See `tests/game.spec.js` for the full suite. Each test starts with a clean `localStorage` and fresh page load.

---

## Key features

- **Multiplayer score tracking:** Add/remove players, rename, switch active player via a player strip.
- **Per-round scoring:** Select number cards (0–12) and modifiers (×2, +2, +4, +6, +8, +10); real-time total and banked score.
- **Flip 7 bonus:** Detects seven unique number cards in a round and applies the +15 bonus.
- **Bust:** “Bust” action ends the round with zero points for that round.
- **Bank:** Bank current round’s score and advance to the next round.
- **Round navigation:** Prev/Next and “View Rounds” list; jump to any round; total score across rounds.
- **Game summary:** Leaderboard modal with standings; 200-point celebration and optional Buy Me a Coffee CTA.
- **Reset options:** Context-aware — single player sees a simple "New Game?" confirmation; multiple players see "New Game" (keep players, clear scores) and "Start Fresh" (remove all players).
- **Share:** Modal with QR code and “Copy Link” (link only; no multiplayer sync).
- **Feedback:** Hotjar survey link in footer, celebration modal, and leaderboard modal.
- **Persistence:** Game state saved to `localStorage` and restored on load (with v1→v2 migration).
- **Rules/FAQ page:** `/faq/` with rules, Flip 7 bonus, bust, solo mode, plus FAQPage structured data for SEO.

---

## External dependencies

| Dependency | Purpose |
|------------|--------|
| **Google Fonts** | Bebas Neue, Overpass |
| **Google Analytics** | `G-EWP1726FBR` (gtag.js) |
| **Hotjar** | Tracking (hjid: 6441765), feedback survey |
| **qrcode-generator** | CDN: cdnjs.cloudflare.com — client-side QR in Share modal |
| **Buy Me a Coffee** | Button image from `img.buymeacoffee.com` (slug: edthedesigner); footer, leaderboard, celebration modals |
| **Shared footer** | See below |
| **Playwright** | E2E testing (dev only) — `@playwright/test` via npm |

No npm/Node build; static HTML/CSS/JS.

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
