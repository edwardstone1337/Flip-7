# Flip 7 — UI Design System

## Architecture

Three-layer token system implemented as CSS custom properties in `styles.css`:

- **Primitives** (`--color-*`, `--space-*`, `--radius-*`, `--font-size-*`, `--shadow-*`, `--duration-*`) — raw values named by what they ARE. Never referenced directly in component CSS.
- **Semantic** (`--bg-*`, `--text-*`, `--border-*`, `--shadow-hover`, etc.) — intent-based tokens named by what they DO. This is what component CSS references.
- **Component** — not yet needed at our scale. Semantic tokens suffice.

Rule: component selectors reference ONLY semantic tokens or, for borders, the `--border-*` shorthand tokens.

---

## Color Primitives

### Brand
| Token | Value | Usage |
|-------|-------|-------|
| `--color-navy` | `#2b3276` | Primary brand color |
| `--color-navy-light` | `rgba(43, 50, 118, 0.1)` | Light tint for hover states |
| `--color-teal` | `#1d9995` | Primary action color |
| `--color-cream` | `#fff4d2` | Surface/background color |
| `--color-orange` | `#fbb03a` | Accent/highlight |
| `--color-orange-light` | `#fbcf8a` | Secondary accent |
| `--color-red` | `#e53e3e` | Danger/destructive |
| `--color-red-dark` | `#c53030` | Danger hover |
| `--color-green` | `#38a169` | Success/positive |
| `--color-white` | `#ffffff` | — |
| `--color-black` | `#000000` | — |

### Gray Scale (Tailwind v1)
| Token | Value |
|-------|-------|
| `--color-gray-100` | `#f7fafc` |
| `--color-gray-200` | `#edf2f7` |
| `--color-gray-300` | `#e2e8f0` |
| `--color-gray-400` | `#cbd5e0` |
| `--color-gray-500` | `#a0aec0` |
| `--color-gray-600` | `#718096` |
| `--color-gray-700` | `#4a5568` |
| `--color-gray-800` | `#2d3748` |
| `--color-gray-900` | `#1a202c` |

---

## Semantic Tokens — Background

| Token | Resolves to | Usage |
|-------|-------------|-------|
| `--bg-primary` | cream | App background |
| `--bg-surface` | cream | Cards, chips, buttons, inputs at rest |
| `--bg-body` | teal | Body element background |
| `--bg-muted` | gray-200 | Unselected/inactive card backgrounds |
| `--bg-disabled` | gray-300 | Disabled elements |
| `--bg-overlay` | `rgba(0,0,0,0.8)` | Modal/celebration overlays |
| `--bg-hover-light` | navy-light | Light hover tint on ghost buttons |
| `--bg-action-primary` | teal | Bank button, primary actions |
| `--bg-action-navy` | navy | Active nav, inverted hover fills, footer |
| `--bg-action-danger` | red | Bust, reset, danger actions |
| `--bg-action-danger-hover` | red-dark | Hover on danger elements |
| `--bg-accent` | orange | Accent backgrounds |
| `--bg-accent-light` | orange-light | Secondary accent backgrounds |
| `--bg-on-dark-subtle` | `rgba(255,255,255,0.05)` | Subtle surface on dark containers |
| `--bg-on-dark-hover` | `rgba(255,255,255,0.1)` | Hover on dark containers |

## Semantic Tokens — Text

| Token | Resolves to | Usage |
|-------|-------------|-------|
| `--text-primary` | navy | Default text on light backgrounds |
| `--text-secondary` | gray-600 | Helper/secondary text |
| `--text-muted` | gray-700 | De-emphasised text |
| `--text-disabled` | gray-500 | Disabled element text |
| `--text-placeholder` | gray-500 | Input placeholders |
| `--text-on-dark` | cream | Text on dark backgrounds |
| `--text-on-action` | cream | Text on teal/navy/red action buttons |
| `--text-on-action-muted` | `rgba(255,255,255,0.85)` | Secondary text on action backgrounds |
| `--text-on-dark-muted` | `rgba(255,255,255,0.8)` | Secondary text on dark containers |
| `--text-success` | green | Success indicators |
| `--text-danger` | red | Danger/warning text |
| `--text-accent` | orange | Accent text (winner, scores) |
| `--text-accent-light` | orange-light | Secondary accent text |
| `--text-action-primary` | teal | Teal text for scores and links |

## Semantic Tokens — Shadows

| Token | Resolves to | Usage |
|-------|-------------|-------|
| `--shadow-hover` | `0 4px 12px rgba(0,0,0,0.15)` | Standard hover lift |
| `--shadow-hover-subtle` | `0 4px 12px rgba(0,0,0,0.1)` | Subtle hover lift |
| `--shadow-selected` | `0 6px 16px rgba(43,50,118,0.4)` | Selected card state |
| `--shadow-focus` | `0 2px 8px rgba(29,153,149,0.2)` | Input focus ring |
| `--shadow-elevated` | `0 4px 12px rgba(0,0,0,0.3)` | Snackbar, elevated surfaces |
| `--shadow-accent-hover` | `0 4px 12px rgba(251,176,58,0.4)` | Winner button hover |

## Semantic Tokens — Border Radius

| Token | Resolves to | Usage |
|-------|-------------|-------|
| `--radius-card` | 8px | Cards |
| `--radius-button` | 8px | Buttons, inputs |
| `--radius-container` | 16px | App container, modals |
| `--radius-chip` | 24px | Player chips, pills |
| `--radius-circle` | 50% | Avatars, initials |

---

## Border Tokens

Shorthand tokens combining width + style + color:

| Token | Value | Usage |
|-------|-------|-------|
| `--border-default` | `1px solid navy` | Cards, buttons, inputs |
| `--border-subtle` | `1px solid navy-light` | Dividers, FAQ sections |
| `--border-transparent` | `1px solid transparent` | Ghost nav/footer links |
| `--border-overlay` | `1px solid navy` | Modal content |
| `--border-accent` | `1px solid orange` | Selected modifier, winner |
| `--border-accent-light` | `1px solid orange-light` | — |
| `--border-danger` | `1px solid red` | Danger variant |

---

## Spacing Scale (8-point base)

| Token | Value |
|-------|-------|
| `--space-1` | 2px |
| `--space-2` | 4px |
| `--space-3` | 8px |
| `--space-4` | 12px |
| `--space-5` | 16px |
| `--space-6` | 20px |
| `--space-7` | 24px |
| `--space-8` | 32px |

Off-grid values (intentionally hardcoded): `14px`, `28px`, `56px` (nav offset), `6px` (tight spacing), `30px`.

---

## Typography

### Font Families
| Token | Stack |
|-------|-------|
| `--font-display` | Bebas Neue + system fallbacks |
| `--font-body` | Overpass + system fallbacks |

### Font Size Scale
`--font-size-2xs` (8px) → `--font-size-xs` (10px) → `--font-size-sm` (12px) → `--font-size-md` (14px) → `--font-size-base` (16px) → `--font-size-lg` (18px) → `--font-size-xl` (20px) → `--font-size-2xl` (24px) → `--font-size-3xl` (32px) → `--font-size-4xl` (36px) → `--font-size-5xl` (72px) → `--font-size-hero` (160px)

Off-scale values (intentionally hardcoded): `13px`, `28px`, `40px`, `48px`, `96px`, `0.85rem`.

### Font Weights
`--font-weight-normal` (400) · `--font-weight-semibold` (600) · `--font-weight-bold` (700) · `--font-weight-extrabold` (800)

### Line Heights
`--line-height-tight` (1) · `--line-height-snug` (1.2) · `--line-height-relaxed` (1.4) · `--line-height-loose` (1.5) · `--line-height-normal` (1.6)

Off-scale value: `1.3` (one-off on `.realtime-score`).

### Letter Spacing
`--letter-spacing-normal` (0.5px) · `--letter-spacing-wide` (1px)

---

## Motion

| Token | Value | Usage |
|-------|-------|-------|
| `--duration-fast` | 0.2s | Standard interactions |
| `--duration-medium` | 0.3s | Larger transitions |
| `--easing-default` | ease | General purpose |
| `--easing-bounce` | `cubic-bezier(0.68, -0.55, 0.265, 1.55)` | Playful pop effects |
| `--easing-smooth` | `cubic-bezier(0.23, 1, 0.32, 1)` | Modal entrances |
| `--transition-fast` | `all 0.2s ease` | Common hover/state transitions |
| `--transition-medium` | `all 0.3s ease` | Slide/expand transitions |

---

## Button Hover Treatments

| Group | Behaviour | Tokens used | Selectors |
|-------|-----------|-------------|-----------|
| **A — Navy fill invert** | bg→navy, text→cream | `--bg-action-navy`, `--text-on-action` | `.summary-button:hover`, `.modal-button.primary:hover`, `.add-player-chip:hover` |
| **B — Light tint** | bg→navy-light | `--bg-hover-light` | `.toggle-rounds-button:hover`, `.modal-button.secondary:hover`, `.nav-link:hover`, `.share-button:hover` |
| **C — Danger** | bg→red-dark | `--bg-action-danger-hover` | `.reset-button:hover`, `.modal-button.danger:hover`, `.reset-option.danger:hover`, `.card.action.bust:hover` |
| **D — Lift only** | translateY(-2px) + shadow | `--shadow-hover` | `.card:hover`, `.player-chip:hover`, `.reset-option:hover` |
| **E — Accent** | bg→orange-light | `--bg-accent-light`, `--shadow-accent-hover` | `.winner-continue-button:hover` |

### Known gaps (to address in UX polish)
- `.card.action.primary:hover` (Bank) — hover bg identical to resting state, no visual feedback
- `.nav-button:hover` (Prev/Next) — no hover rule exists

---

## Protected Zones (Do Not Modify)

- Number cards (0–12)
- Modifier cards (×2, +2, +4, +6, +8, +10)
- Bank button (✓)
- Bust button (X)
- Card grid layout

---

## Button Atoms

Mobile-first button system. Hover states intentionally omitted (78% mobile users).

### Base class: `.btn`
All interactive buttons MUST include `.btn` as their base class. It provides:
touch-target sizing (48px min-height), padding, font, border, radius, cursor, full-width layout.

### Intent variants (mutually exclusive)
| Class | Background | Text | Border | Use for |
|-------|-----------|------|--------|---------|
| `.btn-primary` | Navy | Cream | Default | Primary actions — submit, confirm, Game Summary |
| `.btn-secondary` | Cream | Navy | Default | Secondary actions — cancel, View Rounds, navigation |
| `.btn-danger` | Red | Cream | None | Destructive actions — reset, remove, bust |

### Size variants
| Class | Padding | Font size | Use for |
|-------|---------|-----------|---------|
| (default) | 12px 16px | 14px | Gameplay buttons below card grid |
| `.btn-lg` | 12px 24px | 16px | Modal buttons |
| `.btn-sm` | 8px 16px | 14px (auto min-height) | Round nav Prev/Next |

### Modifiers
| Class | Effect |
|-------|--------|
| `.btn-full` | Forces `width: 100%` (already default on `.btn`, useful for overriding flex contexts) |

### Composition
Buttons are composed by combining base + intent + size:
```
class="btn btn-primary"              → standard primary
class="btn btn-lg btn-secondary"     → large secondary (modal cancel)
class="btn btn-sm btn-secondary"     → small secondary (Prev/Next)
class="btn btn-lg btn-danger"        → large danger (modal remove/reset)
```

### Keyboard accessibility
Action cards (Bank/Bust) have `role="button"` and `tabindex="0"` with Enter/Space keydown handlers.

### Legacy classes
The following classes are retained on elements alongside `.btn` for selector stability but contain minimal or no CSS:
`nav-button`, `toggle-rounds-button`, `summary-button`, `reset-button`, `modal-button`, `modal-button primary`, `modal-button secondary`, `modal-button danger`

These will be removed in a future cleanup pass once all selectors and tests reference `.btn-*` classes exclusively.

---

## Utility Classes

| Class | Effect | Use for |
|-------|--------|---------|
| `.busted` | `color: var(--text-danger); text-decoration: line-through;` | Round score display when round was busted |
| `.hidden` | `display: none` | Modal visibility toggle |

---

## Modal System

Base class: `.modal-overlay` (renamed from `.celebration` — semantic improvement).
Visibility toggled via `.hidden` class in JavaScript.
All modals follow the pattern: `<div class="modal-overlay hidden" id="xxx-modal">`.

### Known UX debt (backlog)
- Inconsistent close/cancel pattern — some modals use bottom cancel, some have no explicit close
- Button hierarchy not enforced — some multi-action modals lack a clear primary action
- Three container layout classes still in use: `.modal-buttons`, `.modal-buttons-vertical`, `.reset-options-container`
