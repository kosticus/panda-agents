---
id: pa-lp40
status: closed
deps: []
links: []
created: 2026-03-29T01:32:03Z
type: task
priority: 2
parent: pa-udbx
tags: [planned]
---
# Fix fish animation: rod angle change + bigger body lean

Both frames show a straight vertical rod at col 15 with only a 2px body lean difference. The animation reads as "panda shimmying by water" rather than fishing. Need more dramatic frame differentiation.

Source plan: ~/pkm/projects/pixel-agents/chore-animation-fixes-r5.synth.md

## Design

This is the most complex fix. Three motion signals need strengthening:

1. Rod angle change (secondary signal):
   - Frame 1: rod tip at col 13-14 (angled outward/forward), base at col 14-15 at grip. The rod passes through different columns at different heights.
   - Frame 2: rod pulled back, tip at col 15 (straight up or angled back).
   - CONSTRAINT: at 16px width, only 1-2 columns of angle deviation is feasible in the top half (rows 0-9). Body fills lower columns. Consider shortening the rod (fewer rows above head) to make angle more visible per pixel.
   - The rod will overwrite some edge pixels of ears/head where it passes.

2. Body lean (primary signal):
   - Increase from 2px to 3-4px between frames. Frame 1 centered or slightly forward, frame 2 leaned back 3-4px.
   - Seated body stays at same row, only horizontal shift changes.

3. Splash/bobber (tertiary signal):
   - Frame 1: small bobber floating (2-3px), calm water
   - Frame 2: large splash area (4-5px wide), bobber submerged, splash pixels (D) around it

Key file: scripts/generate-chore-fish-preview.mjs
Both frames need substantial rewrite (~40+ lines of pixel data).

Acceptance: run `node scripts/generate-chore-fish-preview.mjs`, open panda_fish_preview_8x.png — the two frames should be clearly distinguishable at a glance. Rod angle, body position, and water activity should all visibly differ.


## Notes

**2026-03-29T17:44:31Z**

Started by kimberlykost

**2026-03-29T18:01:14Z**

Redesigned both frames: Frame 1 has rod angled forward (tip col 13, base col 14) with centered body and calm water with floating bobber. Frame 2 has rod straight up (col 15) with body leaned back 3px, and bobber submerged with splash pixels. Rod tip moves 2 columns between frames, body shifts 3px. Legs, bank, and water rows stay anchored. 5-row compressed ears for seated posture. All rows verified at exactly 16 chars.
