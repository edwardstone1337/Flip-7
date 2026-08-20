# Changelog

## [Unreleased]

### Added
- Installable web app: `manifest.json`, `apple-touch-icon`, `theme-color` and iOS home-screen meta on both pages. Adding to the home screen now uses the Flip 7 icon and opens standalone instead of showing a page screenshot in Safari chrome
- App icons `icon-192.png`, `icon-512.png`, `icon-512-maskable.png`, `apple-touch-icon.png`. The maskable variant is padded to 78% so Android's circular crop can't clip the 7 (the full-bleed artwork overflowed the safe zone by 22%)
- E2E tests 20–22 covering tie announcement, tie-break, and score-based ranking — the suite previously had no multi-player scoring test

### Fixed
- Ties: the leaderboard ranked by list position, so two players level on 207 were shown as 🥇 and 🥈. Ranking is now by score, and players level share a place (1st, 1st, 3rd — no silver awarded)
- Ties: crossing 200 announced "Congratulations" and "Final Standings" even when another player was level. A tie now shows a tie banner naming everyone involved and pointing at the FAQ rule to play another round; confetti is held back for an outright win
- Ties: a player who celebrated crossing 200 alone could never trigger a second announcement, so the round that finally broke a tie declared nothing. A tie now resets `celebrationShown` for every player involved
- Canonical host: canonical tags, JSON-LD `url`, `robots.txt` sitemap line, `sitemap.xml` locs, and the legacy `faq.html` stub all declared `www.flip7scorecard.com` while CNAME serves the apex. All five now use `https://flip7scorecard.com`
- Share modal QR 404: markup referenced `flip7-qr.png`, deleted in an earlier release. Both JS lookups found the image via `img[src*="flip7-qr"]`, so the image now carries `id="share-qr-img"` and both lookups use it. QR still generates client-side as a data URI on both pages

### Changed
- FAQPage structured data expanded from 4 to 20 questions (all gameplay + provenance Q&As). Donation and feedback accordions excluded — Google's FAQPage guidance treats promotional/navigational entries as ineligible
- `script.js` and the qrcode-generator CDN script now `defer` (were render-blocking in `<head>`). Safe because every consumer runs inside `DOMContentLoaded`, which deferred scripts precede

### Removed
- `flip7logo.png` (21KB) — referenced nowhere in markup, styles, or scripts

### Added
- Three-layer design token architecture (131 CSS custom properties)
- Primitive tokens: color, gray scale, spacing, border-radius, typography, shadows, motion
- Semantic tokens: background, text, shadow, border-radius including on-dark variants
- Button atom system: .btn base with .btn-primary/.btn-secondary/.btn-danger + size variants
- .busted utility class for round score styling
- Keyboard accessibility for Bank and Bust action cards (role="button", tabindex, keydown)
- --line-height-relaxed (1.4) and --line-height-loose (1.5) typography tokens
- Complete UI-DESIGN-SYSTEM.md reference documentation

### Changed
- All component CSS migrated from --brand-* to semantic token references
- Border token definitions now reference --color-* primitives
- Confetti colors in script.js now read from CSS custom properties via getComputedStyle
- Modal base class renamed from .celebration to .modal-overlay
- Game Summary button now uses btn-primary (navy bg — was cream)
- Busted round score now uses .busted class instead of inline style
- .card.selected shadow changed from blue to navy
- .winner-announcement border-radius snapped from 12px to 16px
- .footer-link, .celebration-coffee-img border-radius snapped from 6px to 8px
- All 27 buttons now compose from .btn atom classes

### Removed
- All --brand-* legacy token declarations
- 22 hover rules from non-card interactive elements (mobile-first decision)
- 14 orphaned transition declarations
- 6 orphaned :active rules
- ~65 lines of redundant per-selector button CSS

## Unreleased

### Added
- Google Analytics (gtag) on main and FAQ pages for usage analytics
- Event tracking: card select, player add/rename/remove, round bank/bust, game reset (all/active/entire), game complete, share open/copy, nav/clicks, coffee clicks, feedback clicks, FAQ accordion open
- Dynamic QR code in Share modal (client-generated via qrcode-generator; no static image). Share/copy URLs use UTM params (`utm_source=share`, `utm_medium=qr_code` or `copy_link`)
- Shared footer block (`#es-footer`, project `flip7`) loaded from footer.edwardstone.design
- Feedback link (Hotjar survey) in celebration modal, leaderboard modal, and footer
- Feedback accordion section on FAQ page with survey link
- Buy Me a Coffee + feedback in 200-point celebration modal (`#celebration-coffee-mini`)
- CSS border design tokens (`--border-default`, `--border-subtle`, `--border-transparent`, `--border-overlay`, `--border-accent`, `--border-danger`)
- Feedback: Hotjar survey link in FAQ (new section faq22), site footer, celebration modal, and leaderboard modal
- Feedback: `.feedback-link` CSS class for consistent link styling across all feedback touchpoints
- Feedback: `feedback_click` analytics event with location tracking (faq, footer, celebration, leaderboard)
- Coffee: Buy Me a Coffee button added to celebration modal (#celebration-coffee-mini)
- Coffee: Fixed `coffee_click` location detection — celebration modal now correctly reports `location: 'celebration'` instead of `'footer'`
- Footer: Share button and Feedback link added to site footer nav (Play, Rules, Share, Feedback)
- Border system: Design token architecture (primitives + semantic) for borders — `--border-default`, `--border-subtle`, `--border-transparent`, `--border-overlay`, `--border-accent`, `--border-accent-light`, `--border-danger`
- Border system: Migrated all 28 border declarations to use tokens; unified to 1px across the app
- Border system: Fixed `.card.modifier.selected` invalid shorthand (was `border: var(--brand-orange)` with no width)
- Reset modal: Context-aware — single player sees "New Game?" confirmation; 2+ players see "New Game" and "Start Fresh" options
- Player menu: Context-aware — single player sees inline rename input directly; 2+ players see Rename/Remove/Cancel menu
- Player menu: "Remove Player" hidden when only 1 player remains
- Testing: Playwright E2E suite with 14 tests covering all critical paths
- Testing: GitHub Actions workflow (`e2e.yml`) runs tests on PR/push to main, blocks merge on failure
- Diagnostic: Temporary logging in `bankRound()` for intermittent bank-it bug investigation

### Changed
- Buy me a coffee links use direct `buymeacoffee.com/edthedesigner` (FAQ and main)
- Copy link uses canonical URL `https://flip7scorecard.com` with UTM params instead of `window.location.href`
- Nav/footer: "FAQ" → "Rules"; footer adds Share button and Feedback link
- Share modal title: "Share Flip 7" → "Share Flip 7 Score Calculator"
- Player strip: `overflow: visible`, added padding for chip hover shadow
- Modal/button borders use semantic tokens (1px) instead of hardcoded 2px/4px
- Round prev/next nav buttons: borders removed for cleaner look

### Removed
- Static `flip7-qr.png` (replaced by client-side QR generation)
- Reset modal: Removed "Reset Active Player" option (redundant, no valid use case)
- Player menu: Removed "Reset This Player" option (redundant with reset modal)
- Dead code: Removed `resetActivePlayer()`, `resetAllPlayers()`, `resetEntireGame()`, `showResetPlayerConfirm()`, `confirmResetPlayer()`, `closeResetPlayerModal()` and associated HTML modal

### Changed
- Modal button order standardised: primary action → danger → cancel (6 modals reordered)
- 37 legacy button class instances removed (modal-button variants, toggle-rounds-button)
- Off-grid spacing snapped to tokens: 14px→16px, 6px→8px, 30px→32px
- .modal-feedback-link font-size converted from 0.85rem to --font-size-sm token
- FAQ accordion hover state removed (mobile-first consistency)
- Playwright config: removed SPA mode flag for correct FAQ page routing

### Added
- 5 new Playwright tests: round navigation, game summary, share modal, overlay close, FAQ accordion
- Test coverage now 19/19 across all critical user journeys

### Changed
- Game Summary button changed from primary to secondary
- Leaderboard modal: cream backgrounds with borders replace navy fills
- Winner name/score: navy text, drop shadows removed
- New Game is now the primary CTA in leaderboard modal
- Feedback link in leaderboard converted to secondary button (opens Hotjar survey)
- Reset button and modal copy unified: "New Game" / "Start a new game?" throughout
- Multi-player reset options: "New Game (keep players)" and "New Game (start fresh)"
- FAQ feedback link colour fixed for accessibility (orange → navy)
- Leaderboard active player uses navy border instead of orange

### Fixed
- Critical: New Game in leaderboard now closes leaderboard before opening reset modal
