---
id: pa-n4ew
status: closed
deps: []
links: []
created: 2026-03-29T01:31:51Z
type: task
priority: 2
parent: pa-udbx
tags: [planned]
---
# Fix water animation: move water drops to pouring frame

Water drops (D pixels) currently appear in frame 1 crop rows. User feedback: they should be in the frame that more clearly represents active watering (frame 2).

Source plan: ~/pkm/projects/pixel-agents/chore-animation-fixes-r5.synth.md

## Design

- Remove D pixels from frame 1 crop rows (lines ~77-78). Replace with plain plant pixels matching frame 2's current dry crop pattern: `..L.NL..L...N.L.` and `..L.NL..L..N..L.`
- Add D pixels to frame 2 crop rows (lines ~118-119). Use a pattern similar to current frame 1: drops among plants + stream from spout area (DDDDD at right side where can spout is). E.g.: `..LDNL.DL..DDDDD` and `..LDNL.DL..DD.L.`
- Frame 1 crops = dry plants on soil (panda standing upright, can at hip)
- Frame 2 crops = wet plants with water stream (panda leaning, can extended)

Key file: scripts/generate-chore-water-preview.mjs
~6 lines changed total.

Acceptance: run `node scripts/generate-chore-water-preview.mjs`, open panda_water_preview_8x.png — frame 1 should show dry crops, frame 2 should show water drops on crops.


## Notes

**2026-03-29T17:04:32Z**

Started by kimberlykost
