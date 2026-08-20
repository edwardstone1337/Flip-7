# Abandoned round edit leaves card selection out of sync with score

**Type:** bug
**Priority:** normal
**Effort:** small

---

## TL;DR

Go back to a banked round, change the cards, then navigate away without pressing Bank. The score correctly stays put — but the stored card selection keeps the change. The round then displays cards that don't add up to its own score, and the mismatch survives a page reload.

---

## Current state

Reproduced in Chromium:

1. Bank round 1 with cards `3` and `5` → score 8.
2. Bank round 2 with card `10` → score 10. Game total 18.
3. Prev back to round 1. Deselect `3`, select `12`.
4. Navigate forward without banking.

Round 1 in `localStorage` is now:

```json
{ "round": 1, "cards": ["3","5"], "score": 8,
  "selectedCards": ["number-5","number-12"], "saved": true }
```

`score` and `cards` are correct and the game total is still 18 — no scoring corruption. But `selectedCards` has drifted, and it is what `loadRoundSelection()` renders. Revisiting round 1 shows `5` and `12` highlighted on a round scored as `3 + 5 = 8`. A page reload does not clear it.

## Expected outcome

- Leaving a saved round without banking discards the pending selection — `selectedCards` reverts to what `score`/`cards` describe.
- Or, if in-place editing is meant to be sticky, the round is re-scored on navigate-away so the three fields agree. Discarding is the smaller and safer of the two.
- Either way the invariant to hold: for a `saved` round, `selectedCards` always matches `cards` and `score`.

---

## Relevant files

- `script.js:253` `toggleCard()` — writes to `round.selectedCards` and persists it even when the round is already `saved`.
- `script.js:750` / `script.js:795` `goToPreviousRound()` / `goToNextRound()` / `goToRound()` — the navigation points where a pending, unbanked edit should be resolved.

## Risk / notes

- Scores are not affected, so this is a display-integrity bug rather than a data-loss bug. Worth fixing because it makes a correct score look wrong, which erodes trust in the tracker.
- Related but separate: the banked score reads `0` when viewing round 1 (it shows the running total *entering* the round). Not a bug, but it reads as "my scores are gone" at exactly the moment someone is trying to correct a mistake. See `round-edit-discoverability.md` if that gets picked up.
- Add an e2e case: edit a saved round, navigate away, reload, assert `selectedCards` matches `cards`.
