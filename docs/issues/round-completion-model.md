# Shared round model — know who has played the current round

**Type:** feature
**Priority:** normal
**Effort:** medium

---

## TL;DR

Every player carries their own independent `currentRound`, so the app has no concept of "this round is finished for everyone". That single gap causes the most-reported UX complaint *and* the premature win announcement. One model fixes both.

---

## Current state

- Each player object holds its own `rounds[]` and `currentRound`; players advance independently (`script.js:354` `switchToPlayer`, `script.js:885` auto-advance in `bankRound`).
- Nothing shows which players have banked or busted in the round currently being played. Mid-round, a scorekeeper cannot tell who still owes a score.
- Because there is no round boundary, the win check fires the instant *one* player's banked total passes 200 (`script.js:861`) and immediately shows "FINAL STANDINGS" — while opponents may still be on the same round and not yet played.

Direct user evidence, Hotjar, 3★, phone:

> "It's a bit annoying that I have to select which player to edit the points of. There is also no display of who I've edited the current round. It would be nice if the design was more compact."

And independently, from the second survey:

> "Making the game summary and you can click on the name to put in points"

Both describe the same missing thing from opposite directions.

## Expected outcome

- A shared notion of the active round, with per-player status within it: **pending / banked / busted**.
- The player strip shows that status at a glance, so "who still needs scoring" is answerable without tapping through players.
- Win detection resolves at the *end* of a round rather than mid-round: once every player has banked or busted, if exactly one is above 200 they win; if two or more are level, it is a tie and play continues (see `tie-handling.md`).
- Entering a score should be reachable from the summary/standings view by tapping a name, per the second quote above.

---

## Relevant files

- `script.js:8` game state shape — needs a round-level concept alongside the per-player `rounds[]`, plus a migration path (a v2→v3 step; `loadGameState()` at `script.js:52` already handles v1→v2).
- `script.js:861` `bankRound()` — move the 200-point check out of per-player banking and into a round-resolution step.
- `script.js` `updatePlayerStrip()` — surface per-player round status.

## Risk / notes

- **Biggest change on this list.** It touches persisted state shape, so it needs the migration handled carefully — existing players have live games in `localStorage`.
- Do `tie-handling.md` first. That fix is small, independent, and does not need this model; it should not wait on it.
- The design system marks number cards, modifier cards, Bank, Bust and the card grid as protected "Do Not Modify" zones. Status indicators belong in the player strip and rounds view, not on the play surface.
- Worth confirming the desired behaviour before building: does the scorekeeper want the app to *enforce* round order, or just *show* who has played? The quotes above only ask to be shown. Enforcing is a bigger behavioural change and may annoy tables that play loosely.
