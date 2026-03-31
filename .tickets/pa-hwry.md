---
id: pa-hwry
status: closed
deps: []
links: []
created: 2026-03-31T14:42:30Z
type: task
priority: 2
assignee: Kimberly Kost
parent: pa-gmv6
tags: [planned]
---
# Design 50×30 village layout

Fix the preview script dimensions and design a new 50×30 village layout.

The current layout is 40×23. The preview script (generate-layout-preview.mjs) has stale dimensions (W=30, H=23) — it's been truncating the rightmost 10 columns.

Zone arrangement for the new layout:
- Building NW (chopping + building) — edge location for noisy work
- Garden/pond NE — water source + crops together, enlarged
- Cooking W of gathering — communal meals adjacent to social hub
- Gathering center — hub with paths radiating outward
- Groundskeeping S — sweep + dig, connective location along path network
- Lake SE — enlarged, enough shoreline for 2-3 fishing spots
- Huts scattered organically in grass areas, mixed sizes, 4-5 tile clearance between markers
- Bamboo perimeter thinned to 1-2 tiles (negotiable)
- Paths: trunk N→S through center, branches to each zone, 1-2 tiles wide with organic jitter

Layout file must stay human-editable (50 chars/row). Organic/freeform feel — not gridded.

## Design

Implementation:
1. scripts/generate-layout-preview.mjs — line 16: W = 30 → W = 50, line 17: H = 23 → H = 30
2. scripts/village-layout.txt — rewrite to 50 columns × 30 rows with the zone arrangement above

This is iterative creative work. Design the layout, generate the preview (user runs the script), evaluate visually, iterate.

Tile legend (from tileMap.ts CHAR_TO_TILE):
  B=bamboo, G=grass, P=path, W=water, C=cooking, X=woodcutting, F=garden, A=gathering, H=hut marker (renders as grass)

Acceptance criteria:
- Preview PNG shows 50×30 grid with all zones correctly placed
- Paths form a connected network from gathering hub to each zone
- Hut H markers have 4-5 tile clearance (room for future medium/large sprites)
- Overall feel is organic/freeform, not grid-like
- Each zone is large enough for 2+ chore stations


## Notes

**2026-03-31T15:09:21Z**

Started by Kimberly Kost

**2026-03-31T15:12:22Z**

Approved approach: (1) Fix preview script W=30→50, H=23→30. (2) Design 50×30 village-layout.txt with zone arrangement per ticket. (3) Commit. Do NOT touch tileMap.ts (pa-3ze5 scope). First pass layout; user runs preview for visual iteration.
