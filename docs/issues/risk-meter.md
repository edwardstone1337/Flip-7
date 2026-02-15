# Risk meter (bust probability as you select cards)

**Type:** feature  
**Priority:** normal  
**Effort:** medium  

---

## TL;DR

A visual meter that fills up as you select cards, showing how risky it is that your next flip will bust (duplicate number). Reinforces the press-your-luck tension and helps newer players understand exposure.

---

## Current state

- No indication of bust risk. Players see their score and Flip 7 status, but nothing that communicates “you’re getting riskier.”
- Card selection updates score, breakdown, and Flip 7 indicator only.

## Expected outcome

- A **risk meter** (bar or similar) that:
  - Updates when cards are selected/deselected
  - Fills based on how many unique number cards are face-up (more cards = higher risk)
  - Optionally shows a label like “Bust risk” or “Exposure”
  - Sits near the score display / status indicators
- Risk logic: with N unique number cards selected, the next flip has N/13 chance of being a duplicate (0–12 deck). Simple heuristic; we don’t model actual deck composition.
- Meter empty when no number cards selected; maxed (or near max) at 7 unique number cards.

---

## Relevant files

- `index.html` — add risk meter markup (e.g. inside `.status-indicators` or a new `.risk-meter` block).
- `script.js` — compute risk from `round.selectedCards` (count unique number cards), call from `toggleCard` / `updateDisplay`.
- `styles.css` — styles for the meter (bar, label, responsive).

---

## Risk / notes

- Keep it optional or subtle; avoid alarming casual players. Consider copy like “Exposure” instead of “Bust risk.”
- Deck composition (how many of each number remain) is unknown; N/13 is a heuristic. Could add a note in tooltip: “Approximate risk based on unique cards.”
- If we later add gameplay analytics (Supabase), risk level at bank/bust could be logged for analysis.
