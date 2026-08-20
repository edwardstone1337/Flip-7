# Tie handling (two or more players finish level)

**Type:** bug
**Priority:** normal
**Effort:** small
**Status:** shipped — see CHANGELOG (Unreleased), e2e tests 20–22

---

## TL;DR

Two players on an identical score get 🥇 and 🥈 anyway, decided by array order. The leaderboard should give equal scores equal rank, and the win announcement should say the game is tied rather than crowning one of them.

Scoped deliberately small. The happy path — one player crosses 200 and wins — stays exactly as it is today. This only changes what happens on the edge case.

---

## Current state

Verified in Chromium, two players driven to exactly 207 each:

- Leaderboard renders `🥇 Player 1 · 207` and `🥈 Bea · 207`. Rank comes from list position, not score — `script.js:1116`:
  ```js
  const rankEmoji = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '';
  ```
- The win banner fires per player. Each tied player triggers their own "Congratulations! / NAME SCORED 207 / FINAL STANDINGS", so the app declares two different winners in sequence.
- `faq/index.html` publishes the correct rule: *"if at the end of a round two or more players are tied with scores over 200, you simply play additional rounds until one clear winner emerges."* The app contradicts the rules page on the same site.

## Expected outcome

- **Equal scores share a rank.** Standard competition ranking — two players level on top are both 🥇, and the next player is 3rd. No silver awarded for an identical score.
- **Tie is named, not hidden.** When a player crosses 200 and at least one other player has the same total, the banner reads as a tie ("Tied at 207") and points at the FAQ rule — play another round — rather than "Congratulations".
- **Single winner is untouched.** One player above 200 with no one level: identical behaviour, wording and confetti to today.

---

## Relevant files

- `script.js:1106` `updateLeaderboardDisplay()` — replace index-based `rankEmoji` with score-based ranking. Carry `prevTotal`/`prevRank` through the map so equal totals reuse the previous rank.
- `script.js:861` `bankRound()` — `shouldCelebrate` currently checks only `newBankedTotal >= 200 && !player.celebrationShown`. Add a lookup for other players on the same total and pass that through to the announcement.
- `script.js:1042` `showLeaderboard(winningPlayer)` — accepts one optional winner. Needs a tie branch that sets the title/copy differently; the existing `winner-announcement` block can be reused rather than adding new markup.

## Outcome

Shipped as described, with one addition found during QA that the original scoping missed: a player who celebrated crossing 200 *alone* had `celebrationShown` set, so when an opponent later drew level and the tie was then broken, the deciding round announced nothing. A tie now clears `celebrationShown` for every player involved, since a tie means nobody has won yet.

Ranking uses standard competition ranking — two players level on top are both 🥇 and the next is 3rd (🥉, no silver).

## Risk / notes

- **No new markup or CSS required** if the tie state reuses `#winner-announcement`. Keeps it clear of the design system's protected zones (number cards, modifiers, Bank, Bust, card grid).
- ~~`celebrationShown` already resets below 200, so re-celebration after a tie-break works without changes.~~ **Wrong** — this assumption was disproved in QA. It only resets when a total falls *below* 200, which never happens in a tie-break. See Outcome above.
- Done: e2e tests 20–22 in `tests/game.spec.js` cover the tie banner, the tie-break, and score-based ranking, using a `seedTotals()` helper rather than playing 200 points of real rounds per player.
- **Out of scope, tracked separately:** the win banner fires the moment the *first* player passes 200, while opponents may not have played that round yet — so it can say "FINAL STANDINGS" mid-round. Fixing that properly needs a notion of "round complete for all players", which the app does not have (each player carries an independent `currentRound`). See `round-completion-model.md`.
