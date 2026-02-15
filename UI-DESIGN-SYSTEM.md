# Flip 7 - UI Design System

## Design Principles

This design system is based on the "holy" card grid aesthetic, ensuring consistency across all UI elements while keeping the core gameplay interface untouched.

---

## Border Tokens (CSS Variables)

Design system uses semantic border tokens defined in `styles.css`:

| Token | Value | Use |
|-------|-------|-----|
| `--border-default` | 1px solid Navy | Cards, buttons, modals, rounds |
| `--border-subtle` | 1px solid Navy light | FAQ section dividers |
| `--border-transparent` | 1px solid transparent | Nav/footer ghost links |
| `--border-overlay` | 1px solid Navy | Modal content overlay |
| `--border-accent` | 1px solid Orange | Selected modifier, winner button |
| `--border-danger` | 1px solid Red | Danger variant |

---

## Color Palette

### Primary Colors (from card grid)
- **Navy** `#2b3276` - Primary text and borders
- **Teal** `#1d9995` - Primary action (Bank button)
- **Cream** `#fff4d2` - Background color
- **Red** `#e53e3e` - Danger actions (Bust button)
- **Orange** `#fbb03a` - Accents and highlights

### Supporting Colors
- **Navy Light** `rgba(43, 50, 118, 0.1)` - Hover states
- **Orange Light** `#fbcf8a` - Secondary accents
- **Gray** `#718096` - Secondary text

---

## Button System

### 1. Primary Buttons (Ghost Style)
**Use for:** Main actions, confirmations (Add, Save, Close)

**Style:**
- Background: Cream `#fff4d2`
- Text: Navy `#2b3276`
- Border: 2px solid Navy
- Border radius: 8px
- Min height: 48px

**Hover:**
- Background: Navy `#2b3276`
- Text: Cream `#fff4d2`
- Transform: translateY(-2px)
- Box shadow: 0 4px 12px rgba(0, 0, 0, 0.15)

**Examples:**
- "Add" in Add Player modal
- "Save" in Rename Player modal
- "Close" in modals
- "Game Summary" button
- "+ Add player" chip

**Note:** Bank button uses teal but is in the protected holy section

### 2. Secondary Buttons
**Use for:** Less prominent actions, cancellations

**Style:**
- Background: Cream `#fff4d2`
- Text: Navy `#2b3276`
- Border: 2px solid Navy
- Border radius: 8px
- Min height: 48px

**Hover:**
- Background: Navy light `rgba(43, 50, 118, 0.1)`
- Transform: translateY(-2px)
- Box shadow: 0 4px 12px rgba(0, 0, 0, 0.15)

**Examples:**
- "Cancel" buttons
- "View Rounds" toggle button

**Note:** Primary and Secondary now share similar styling, with Primary having a more pronounced hover (full navy) vs Secondary (navy light)

### 3. Danger Buttons
**Use for:** Destructive actions only

**Style:**
- Background: Red `#e53e3e`
- Text: White
- Border: None
- Border radius: 8px
- Min height: 48px

**Hover:**
- Background: Darker red `#c53030`
- Transform: translateY(-2px)
- Box shadow: 0 4px 12px rgba(0, 0, 0, 0.15)

**Examples:**
- Bust button (card grid - holy, don't touch)
- "Restart Game" button
- "Remove Player" option in player menu
- "Reset Entire Game" option

---

## Modal System

### Modal Container
- Background: Semi-transparent black `rgba(0, 0, 0, 0.8)`
- z-index: 1000
- Full viewport overlay

### Modal Content
- Background: Cream `#fff4d2`
- Border: 4px solid Navy `#2b3276`
- Border radius: 16px
- Padding: 32px
- Max width: 90% of viewport
- Width: 400px (desktop)
- Animation: Fade in + slide up

### Modal Typography
- **Title** (celebration-text): 24px, bold, Navy
- **Emoji**: 48px
- **Description text**: 13-14px, gray `#718096`

### Modal Buttons
- Use standard button system (Primary/Secondary/Danger)
- Display: flex with gap: 12px
- Full width on vertical layouts

---

## Input Fields

### Text Inputs (player names, etc.)
- Background: Cream `#fff4d2`
- Border: 2px solid Navy `#2b3276`
- Border radius: 8px
- Padding: 14px
- Font: 16px, semi-bold (600)
- Color: Navy

**Focus State:**
- Border: Teal `#1d9995`
- Box shadow: 0 2px 8px rgba(29, 153, 149, 0.2)

**Placeholder:**
- Color: Light gray `#a0aec0`
- Font weight: 400

---

## Card-Style Options

### Reset Options Cards
- Background: Cream `#fff4d2`
- Border: 2px solid Navy `#2b3276`
- Border radius: 8px
- Padding: 16px
- Min height: 70px
- Display: flex column, centered

**Hover:**
- Transform: translateY(-2px)
- Box shadow: 0 4px 12px rgba(0, 0, 0, 0.15)

**Danger Variant:**
- Border color: Red `#e53e3e`
- Title color: Red
- Hover background: Light red `#ffe5e5`

### Leaderboard Items
- Background: Cream `#fff4d2`
- Border: 2px solid Navy
- Border radius: 8px
- Padding: 14px

**Active Player:**
- Background: Navy `#2b3276`
- Text: Cream `#fff4d2`
- Score: Orange `#fbb03a`

---

## Rounds Section

### Container
- Background: Cream `#fff4d2`
- Border: 2px solid Navy
- Border radius: 8px
- Padding: 20px

### Header
- Border bottom: 2px solid Navy
- Title: Uppercase, bold, Navy
- Total score: Display font, Teal

### Round Items
- Background: Cream `#fff4d2`
- Border: 2px solid Navy
- Border radius: 8px
- Padding: 12px 16px
- Margin bottom: 8px

**Current Round:**
- Background: Navy
- Text: Cream
- Score: Orange

**Hover:**
- Transform: translateY(-2px)
- Box shadow: 0 4px 12px

### Footer
- Border top: 2px solid Navy
- Contains "View Game Summary" button (Primary style)

---

## Player Strip

### Player Chips
- Background: Cream `#fff4d2`
- Border: 2px solid Navy
- Border radius: 24px (pill shape)
- Min height: 44px (thumb-friendly)
- Padding: 8px 12px

**Active State:**
- Background: Navy
- Text: Cream
- Initials background: Orange

**Hover:**
- Transform: translateY(-2px)
- Box shadow: 0 4px 12px rgba(0, 0, 0, 0.15)

### Add Player Chip
- Background: Cream `#fff4d2`
- Border: 2px solid Navy
- Text: Navy

**Hover:**
- Background: Navy
- Text: Cream

**Disabled (Max players):**
- Background: Light gray `#e2e8f0`
- Text: Medium gray `#a0aec0`
- No hover effect

---

## Consistency Rules

### DO ✅
- Use 8px border radius for all buttons and cards
- Use 2px borders consistently
- Apply translateY(-2px) on hover for interactive elements
- Use min-height: 48px for all buttons (accessibility)
- Keep Navy as primary text color
- Use ghost style (navy border, cream bg) for most buttons
- Reserve Red only for destructive actions
- Use Cream for all backgrounds (no white except in holy section)
- Keep Teal as accent color (text, borders, small elements)

### DON'T ❌
- Mix different border radius values
- Use thin borders (< 2px)
- Apply red color to non-destructive actions
- Create buttons smaller than 44px height
- Use multiple shades of the same color
- Modify the card grid (Bank, Bust, numbers, modifiers)
- Use white backgrounds outside the holy section (creates jarring contrast)

---

## Spacing System

- **Small gap**: 8px
- **Medium gap**: 12px
- **Large gap**: 16px
- **Section spacing**: 24px
- **Modal padding**: 32px

---

## Animation Standards

### Hover Transitions
```css
transition: all 0.2s ease;
```

### Hover Transform
```css
transform: translateY(-2px);
box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
```

### Active State
```css
transform: translateY(0);
```

### Modal Entry
```css
animation: modalFadeInUp 0.35s cubic-bezier(0.23, 1, 0.32, 1);
```

---

## Accessibility

- All interactive elements ≥ 44px tap target
- Focus states with visible borders
- Color contrast ratios meet WCAG AA
- aria-live regions for score updates
- Keyboard navigation support

---

## Component Checklist

✅ **Standardized:**
- Modal buttons (Primary, Secondary, Danger)
- Reset options cards
- Player input fields
- Leaderboard items
- Toggle rounds button
- Summary button
- Restart button (Danger style)
- Player strip chips
- Modal containers
- Rounds section container
- Round items
- Rounds header and footer

🔒 **Protected (Don't Touch):**
- Number cards (0-12)
- Modifier cards (×2, +2, +4, +6, +8, +10)
- Bank button (✓)
- Bust button (X)
- Card grid layout

---

This design system ensures visual consistency while maintaining the playful, bold aesthetic of the Flip 7 card game.

---

## Border tokens

Borders use a two-layer token architecture (primitives → semantic) defined in `:root` in `styles.css`.

### Primitives
| Token | Value |
|-------|-------|
| `--border-width-sm` | `1px` |
| `--border-width-md` | `2px` (reserved, not currently used) |

### Semantic
| Token | Resolves to | Usage |
|-------|-------------|-------|
| `--border-default` | `1px solid var(--brand-navy)` | Cards, containers, buttons, inputs, rounds |
| `--border-subtle` | `1px solid var(--brand-navy-light)` | Section dividers (FAQ h2) |
| `--border-transparent` | `1px solid transparent` | Nav links, footer links (hover placeholder) |
| `--border-overlay` | `1px solid var(--brand-navy)` | Modals (celebration-content) |
| `--border-accent` | `1px solid var(--brand-orange)` | Selected modifier cards, winner button |
| `--border-accent-light` | `1px solid var(--brand-orange-light)` | Reserved |
| `--border-danger` | `1px solid var(--brand-red)` | Danger state overrides |

### Usage
Always use semantic tokens in component CSS. Never use raw `border: 1px solid ...`.
```css
/* ✅ Correct */
.my-component { border: var(--border-default); }

/* ❌ Incorrect */
.my-component { border: 1px solid var(--brand-navy); }
```

