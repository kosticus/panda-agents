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

## Completion notes (2026-03-29)

Final design diverged significantly from original plan after iterative prototyping:

1. **Spoon**: 2px-wide diagonal crossing the panda's body (in front). Frame 1: upper-right to lower-left into pot. Frame 2: mirrored. 7 rows of visible handle (body row 3 through feet), entering pot at rim.
2. **Arm**: Arm on the spoon side extends 1px inward on 2 rows (row 18: W→K, row 19: W→K wrapping the handle). Creates "holding" read.
3. **Steam**: V color key added. 2-3 puffs (VV) at cols 13-14, right side of frame. Bobs vertically between frames (rows 24-25 in frame 1, rows 23-24 in frame 2).
4. **Steam color TODO**: Currently debug blue `[80, 140, 255]`. Needs to be tuned against the in-game background — not the preview gray.
5. **Body**: Static between frames (spoon swing carries the motion).

