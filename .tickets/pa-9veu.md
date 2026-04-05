---
id: pa-9veu
status: closed
deps: [pa-03lk, pa-qit2, pa-h6x3, pa-05xz, pa-4961, pa-o7r0]
links: []
created: 2026-04-03T22:55:00Z
type: feature
priority: 2
assignee: Kimberly Kost
tags: [planned]
---
# Village zone layout at 32px

Add three anchor zones (fishing pond, gathering clearing, building/woodcutting area) to the 25x15 village grid at 32px scale. Redesign the path as an organic worn trail instead of the current T-shape. Zones define the village's character; other activities (cooking, gardening, etc.) can fill in organically later. Source plan: ~/.claude/plans/quiet-enchanting-tower.md

## Design

#### Orchestration

Two child tasks build the zone layout:

1. **Layout + colorblock sprites** — new tile map grid, hut positions, path, and simple colorblock zone sprites for visual validation. This is the layout decision — the user evaluates zone placement, path feel, and hut positions before investing in detailed art.

2. **Detailed zone ground tiles** — replace colorblocks with textured 32x32 sprite variants for gathering, water, and woodcutting zones. This is the art pass after layout is confirmed.

#### Integration verification

After both tasks complete, the user builds and views the village in the VS Code webview:
- Three distinct zone regions visible (gathering center, fishing pond SE, building area NE)
- Four small huts in new positions (NW, NE, W, SE)
- Organic path from NW hut into gathering center
- Zone ground tiles have visual texture and variety
- No runtime errors

#### Related tickets (not blocking)
- pa-0hto, pa-f1px, pa-p4d5 (landmark sprites at 16px) — will need 32px updates separately
- pa-hkbf (landmark wiring) — blocked by its children, no conflict on setup branch
- pa-okh6 (edge blending) — separate concern, can be wired after zones render

