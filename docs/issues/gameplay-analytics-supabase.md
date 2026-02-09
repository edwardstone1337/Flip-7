# Gameplay analytics via Supabase (future feature)

**Type:** feature  
**Priority:** low (parked)  
**Effort:** medium  

---

## TL;DR

Skip GA for game stats. Log bust/bank (and optionally other) events to Supabase with card state so we can later answer questions like “riskiest card” and “average bust round” from real gameplay data.

---

## Current state

- No gameplay event persistence. Round data (cards, score, bust/bank, flip7) lives only in `script.js` state and `localStorage` (save/restore).
- GA is available but built for marketing analytics, not gameplay; wrong tool for “which card busts most” or “average bust round.”

## Expected outcome

- On **bust** and **bank**, insert a row into a Supabase table with at least:
  - Event type: `bust` | `bank`
  - Round index
  - Card state (e.g. list of card values that were face-up)
  - Score (0 on bust, banked score on bank)
  - Flip 7 bonus: yes/no
- Optional: session/game id, timestamp, player count.
- Later: dashboards or ad‑hoc queries for riskiest card, average bust round, etc.

---

## Relevant files

- `script.js` — add event logging in `bustRound()` and `bankRound()` (and any shared helper), plus Supabase client init.
- New: Supabase project + table(s) for gameplay events (e.g. `gameplay_events`).
- Config: Supabase URL/key via env or config (no keys in repo).

---

## Risk / notes

- Supabase is new to this repo (you already use it in SCP Reader; same pattern).
- Keep inserts fire-and-forget or non-blocking so UI stays snappy.
- Privacy: decide whether to attach any identity; anonymous by default is safer for a “parked” feature.

---

## Tracking plan (separate)

The discovery report is the source of truth. Structure for the tracking plan (events, properties, when to send) to be added in a follow-up doc or issue once the structure is decided.
