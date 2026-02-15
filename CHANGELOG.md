# Changelog

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
