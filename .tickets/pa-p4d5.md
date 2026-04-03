---
id: pa-p4d5
status: open
deps: []
links: []
created: 2026-04-03T01:42:52Z
type: task
priority: 2
assignee: Kimberly Kost
parent: pa-hkbf
tags: [planned]
---
# Woodcutting zone log pile landmark sprite

Design and implement a readable wood_logs landmark sprite for the woodcutting zone.

pa-hkbf established the wiring infrastructure. User wants all zone sprites individually reviewed.

Key file: webview-ui/src/village/groundTiles.ts

## Design

Base texture: trampled grass with sawdust (E=#5A3E18, F=#4A3210, J=#6B4E28, g=#5A8C3A)

Existing landmark: wood2 (stump) at lines ~317-334 — dark bark outline (r=#4A2E14) around bright heartwood (u=#D4A858) with ring detail (z=#8C5E28). This works well and must NOT be modified.

wood_logs sits alongside wood2 in woodLandmarks array — variantIndex picks between them.

Reference: scripts/generate-landmark-chopping-preview.mjs has a log pile design (3 stacked cut rounds with end-grain circles).

### Sprite to replace

1. `wood_logs` — current design attempted stacked rounds but may not read clearly

Palette: currently reuses stump palette (r/u/z). May add new entries if needed.

#### Acceptance criteria

- Sprite is 16x16 character grid via toSprite()
- Reads as stacked logs at rendered scale
- Consistent with wood2's palette style
- Dark-outline + bright-interior pattern
- References the chopping preview script design
