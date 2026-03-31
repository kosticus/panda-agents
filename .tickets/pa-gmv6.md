---
id: pa-gmv6
status: closed
deps: [pa-hwry, pa-3ze5, pa-bolk]
links: []
created: 2026-03-31T01:55:15Z
type: feature
priority: 2
assignee: Kimberly Kost
tags: [planned]
---
# Village layout R3 — 50×30 grid with multi-station placements

Redesign village from 40×23 to 50×30 with new zone clustering, connected path network, and multi-station chore placements. Supersedes the r2 layout (pa-1xtp). Source plan: village-layout-r3-plan.synth.md

## Design

Orchestration plan — three tasks in sequence:

1. Design 50×30 layout (scripts/generate-layout-preview.mjs + scripts/village-layout.txt)
   - Fix preview script dimensions, design the layout iteratively with visual preview feedback
   - This is creative/iterative work — best run via /execute (interactive), not ralph

2. Update runtime tile map (webview-ui/src/village/tileMap.ts)
   - Mechanical translation: update VILLAGE_COLS/ROWS, replace LAYOUT_ROWS, update HUT_POSITIONS
   - Depends on approved layout from task 1

3. Convert chore placements to multi-station arrays (webview-ui/src/village/choreSprites.ts + renderer.ts)
   - Type change + coordinate update + renderer loop update
   - Depends on tile map being at 50×30 so coordinates are valid

Integration verification after all tasks complete:
- npx tsc --noEmit (full type check)
- Visual check in browser: tiles render at 50×30, zones placed correctly, chore sprites appear at all stations
- Generate layout preview and compare to runtime rendering

Dependency rewiring: pa-4srm and pa-cq4d gain a dep on the tile map task (task 2) so they run against the r3 layout. pa-aua3 gains a dep on this feature.

