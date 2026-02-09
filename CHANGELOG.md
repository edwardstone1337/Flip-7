# Changelog

## Unreleased

### Added
- Google Analytics (gtag) on main and FAQ pages for usage analytics
- Event tracking: card select, player add/rename/remove, round bank/bust, game reset (all/active/entire), game complete, share open/copy, nav/clicks, coffee clicks, FAQ accordion open
- Dynamic QR code in Share modal (client-generated via qrcode-generator; no static image). Share/copy URLs use UTM params (`utm_source=share`, `utm_medium=qr_code` or `copy_link`)
- Shared footer block (`#es-footer`, project `flip7`) loaded from footer.edwardstone.design

### Changed
- Buy me a coffee links use direct `buymeacoffee.com/edthedesigner` (FAQ and main)
- Copy link uses canonical URL `https://flip7scorecard.com` with UTM params instead of `window.location.href`

### Removed
- Static `flip7-qr.png` (replaced by client-side QR generation)
