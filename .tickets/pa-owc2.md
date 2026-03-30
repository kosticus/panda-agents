---
id: pa-owc2
status: closed
deps: []
links: []
created: 2026-03-30T00:51:17Z
type: task
priority: 2
assignee: Kimberly Kost
parent: pa-51zd
tags: [planned]
---
# Move build to woodcutting zone and fix plank colors

Build panda is in GATHERING zone (23,10) — should be in WOODCUTTING where chopping happens. Plank colors also blend with woodcutting ground.

## Design

Files to modify:
- webview-ui/src/village/choreSprites.ts — CHORE_PLACEMENTS.build, BUILD_PAL colors for T and D
- scripts/generate-chore-build-preview.mjs — mirror palette RGB changes

Placement: move from (23,10) to woodcutting area ~(11, 5). Woodcutting zone spans cols 4-13, rows 3-6. Chop panda is at (7,3). Position (11,5) gives ~4 col separation on the right side of the zone.

Color fix: plank T=#785032 nearly matches woodcutting ground (#645032, #786946). Shift planks to warmer golden tones — T to ~#C8A060, D to ~#A07840. Golden-amber is distinct from the gray-brown woodcutting earth.

Ground colors for reference (woodcutting): #786946, #B49B6E, #877D55 (earth tones), #645032 (dark bark)

Verification: npx tsc --noEmit, user runs build preview script, user visual check on woodcutting ground.


## Notes

**2026-03-30T15:42:56Z**

Started by Kimberly Kost

**2026-03-30T15:46:01Z**

Approved approach: (1) Move CHORE_PLACEMENTS.build from (23,10) to (11,5). (2) Update BUILD_PAL T #785032→#C8A060, D #5a3c23→#A07840 in choreSprites.ts. (3) Mirror RGB changes in generate-chore-build-preview.mjs: T [120,80,50]→[200,160,96], D [90,60,35]→[160,120,64]. (4) npx tsc --noEmit to verify.

**2026-03-30T15:52:33Z**

Moved build placement from (23,10) gathering zone to (11,5) woodcutting zone. Changed plank colors from brown (#785032/#5a3c23) to golden-amber (#C8A060/#A07840) for contrast against woodcutting ground. Mirrored RGB in preview script. tsc --noEmit passes.

**2026-03-30T15:54:09Z**

Done: moved build placement to (11,5) woodcutting zone, updated plank colors to golden-amber T=#C8A060 D=#A07840. TSC passed, user approved visual. Commit b709c35.
