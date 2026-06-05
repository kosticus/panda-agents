---
name: Village zone tile status
description: Current state of zone ground tiles and village layout as of 2026-03-28
type: project
---

Zone ground tiles were added in commit 16a704b (branch: setup).

**Completed:**
- All 5 zone types have palette chars + tile patterns in groundTiles.ts (interior + edge variants)
- Cooking palette is cool ash/gray (#7D766C base, #373028 soot) — distinct from warm gathering clay (#A57844)
- getGroundSprite() wired up: each zone returns its interior variant (no edge-awareness yet)
- Village layout redesigned with organic paths, rounded gathering hub (6 rows, 44 tiles), cooking adjacent to gathering's SW edge, large fishing pond (37 tiles), small garden (7 tiles)

**Not yet done / next session:**
- Edge-aware tile selection (gather2, water2, etc. exist but aren't used — getGroundSprite always returns the interior variant)
- Visual review needed: user hasn't built and checked the latest layout iteration yet
- The generate-zone-palette-preview.mjs script still has the old cooking RGB values (warm brown) — runtime groundTiles.ts has the updated ash/gray palette. Generator script is reference-only, not blocking.

**Why:** Building toward a panda village sim where pandas perform activities in zones (fishing at water, farming at garden, cooking at fire pit, gathering at hub, woodcutting in forest).

**How to apply:** Next session should start by having the user build and visually confirm the layout. Then edge-aware tile selection is the natural next step.
