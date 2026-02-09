# Flip 7 — Analytics Tracking

## 1. Overview

Google Analytics is set up with measurement ID **G-EWP1726FBR** on both the main app and the FAQ page. Custom events are tracked via a `trackEvent()` helper in `script.js` that guards against `gtag` not being defined. FAQ-specific tracking (accordion opens) is handled inline in `faq/index.html` using a direct `gtag()` call with the same guard pattern, since that page does not load `script.js`.

---

## 2. Event reference

| Event Name | Trigger | Parameters | File & Function |
|------------|---------|------------|-----------------|
| `coffee_click` | Buy Me a Coffee link clicked | `location`: `'footer'` or `'leaderboard'` | script.js — DOMContentLoaded listener |
| `share_open` | Share button clicked | — | script.js — showShareModal() |
| `share_copy_link` | Copy Link button in share modal | — | script.js — copyLinkToClipboard() |
| `round_bank` | Player banks a round | `round_number`, `round_score` | script.js — bankRound() |
| `round_bust` | Player busts | `round_number` | script.js — bustRound() |
| `game_complete` | Player hits 200 points | — | script.js — showLeaderboard() |
| `card_select` | Card selected (not deselected) | `card_type`, `card_value` | script.js — toggleCard() |
| `player_add` | Player added | `player_count` | script.js — confirmAddPlayer() |
| `player_remove` | Player removed | `player_count` | script.js — confirmRemovePlayer() |
| `player_rename` | Player renamed | — | script.js — confirmRenamePlayer() |
| `game_reset` | Any reset action | `reset_type`: `'active'`, `'all'`, or `'entire'` | script.js — resetActivePlayer(), resetAllPlayers(), resetEntireGame() |
| `nav_click` | Nav or footer link clicked | `destination` | script.js — DOMContentLoaded listener |
| `faq_accordion_open` | FAQ accordion expanded | `faq_id` | faq/index.html — inline script |

---

## 3. Key implementation notes

- **Guard:** All events use the `trackEvent()` helper (or in FAQ, a direct `typeof gtag === 'function'` check), so tracking never runs if `gtag` is not defined.
- **Timing:** Events fire only after the action succeeds (e.g. after bank/bust/remove/rename/reset), never before.
- **card_select:** Fires only when a card is **selected**; deselection does not send an event.
- **coffee_click:** Location is derived by checking if the link is inside `#celebration-coffee` → `'leaderboard'`, otherwise `'footer'`.
- **FAQ:** Uses a direct `gtag('event', 'faq_accordion_open', { faq_id: ... })` in the accordion click handler, with the same `typeof gtag === 'function'` guard, because the FAQ page uses an inline script and does not load `script.js`.

---

## 4. What is NOT tracked (intentional)

- Modal cancel/close buttons
- Round prev/next navigation
- Card deselection

---

## 5. UTM parameters on shared links

Shared links include UTM parameters for attribution in Google Analytics:

| Share method | URL | UTM params |
|--------------|-----|------------|
| Copy Link | `https://flip7scorecard.com?utm_source=share&utm_medium=copy_link` | `utm_source=share` & `utm_medium=copy_link` |
| QR Code | `https://flip7scorecard.com?utm_source=share&utm_medium=qr_code` (main) or `.../faq/?utm_source=share&utm_medium=qr_code` (FAQ) | `utm_source=share` & `utm_medium=qr_code` |

These appear in GA under **Acquisition → Traffic acquisition** as source `share`. The QR code is generated dynamically via the qrcode-generator library (no static image file).

---

## 6. GA reports tip

To see these events: **GA → Reports → Engagement → Events.**  
To analyze coffee conversion paths, create a **custom funnel** in GA with `coffee_click` as the conversion step.
