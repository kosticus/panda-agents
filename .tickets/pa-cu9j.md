---
id: pa-cu9j
status: done
deps: []
links: []
created: 2026-03-29T01:31:29Z
type: task
priority: 2
parent: pa-udbx
tags: [planned]
---
# Fix cook animation: extend spoon upward + add steam puffs

The cook animation's two frames look identical — the only difference is a 2px dark-brown spoon handle (P) shifting sides on the pot rim. The spoon is nearly invisible against the dark red pot. Need to make the motion signal much more visible.

Source plan: ~/pkm/projects/pixel-agents/chore-animation-fixes-r5.synth.md

## Design

1. Add a new steam color to the C map (e.g., key `C` or `V`, RGB ~[200,210,220] blue-tinted light gray — must be distinct from W and G which are panda fur)
2. Extend spoon handle UP from pot: 3-4px visible above pot rim. Frame 1: spoon angles up-left from left side of pot. Frame 2: spoon angles up-right from right side of pot.
3. Add 2-3 steam puff pixels above the pot that shift position between frames (left-side puffs in frame 1, right-side in frame 2)
4. May need to reclaim 1 row from bottom padding (current layout has 2 pad rows at bottom) to fit the spoon extension row

Key file: scripts/generate-chore-cooking-preview.mjs
Current color map has no steam color — one must be added.
Reference canonical body: scripts/generate-panda-sheets.mjs DN_BODY

Acceptance: run `node scripts/generate-chore-cooking-preview.mjs`, open panda_cook_preview_8x.png — spoon and steam should be clearly visible and obviously different between the two frames.

