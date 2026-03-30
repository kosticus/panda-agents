---
id: pa-njel
status: closed
deps: [pa-2h2w]
links: []
created: 2026-03-30T00:51:06Z
type: task
priority: 2
assignee: Kimberly Kost
parent: pa-51zd
tags: [planned]
---
# Redesign fish sprite and relocate to water edge

Current fish sprite has a flat second frame (side-profile cast/reel) and is placed on grass, not water. Redesign with pole in front of body and bobbing motion, relocate to water-adjacent position.

## Design

Files to modify:
- scripts/generate-chore-fish-preview.mjs — rewrite both frame character grids
- webview-ui/src/village/choreSprites.ts — update FISH_PAL (if palette changes), FISH_1, FISH_2, CHORE_PLACEMENTS.fish

New sprite design:
- Pole held vertically in front of body (extending downward in screen space), not off to the side
- Frame 1: bobber floating at sprite bottom (in water area), panda standing
- Frame 2: bobber dips/bobs, slight arm movement — gentle fishing motion
- Eliminates the flat silhouette of the current cast/reel second frame
- Existing palette colors work well against water — pole brown (#785032) against water blue (#4678AA), bobber red (#e6503c) pops on blue

Placement: move from (25,15) on GRASS to water-adjacent position. Candidates: ~(26, 17) where grass meets water zone, or ~(27, 16). The sprite's lower half should overlap with water ground tiles. Choose based on visual result.

Key file refs:
- webview-ui/src/village/groundTiles.ts — water tile palette (blues: #4678AA, #5A91C3, #325F8C) for contrast
- Current fish data at choreSprites.ts FISH_PAL (~line 232), FISH_1/FISH_2 (~lines 240-310)

Verification: npx tsc --noEmit, user runs fish preview script, user visual check near water.


## Notes

**2026-03-30T16:24:20Z**

Started by Kimberly Kost

**2026-03-30T16:31:54Z**

Approved approach: (1) Move CHORE_PLACEMENTS.fish from (25,15) to (27,16) — grass-water boundary. (2) Redesign both frame grids: standing panda, pole vertical in front extending down, frame 1 calm bobber, frame 2 bobber dips with arm movement. Bottom rows = water instead of sandy bank. (3) Remove dead L entry, remove P if unused. (4) Edit preview script first, mirror to choreSprites.ts. (5) npx tsc --noEmit, user visual check.

**2026-03-30T16:41:21Z**

Redesigned fish sprite: standing panda (not seated) with fishing rod vertical at col 7 in front of body. Rod passes through ear gap and extends to water. Frame 1: calm bobber (BBB at cols 6-8). Frame 2: subtle arm tug (arms in 1px on rows 17-18) + bobber dipped with DDD splash ring. Removed dead palette entries L and P. Relocated placement from col:25,row:15 to col:27,row:16 (water edge). Both choreSprites.ts and generate-chore-fish-preview.mjs updated in sync.

**2026-03-30T16:57:00Z**

Fixed fish sprite: (1) Added visible paw grip at band area (rows 15-17) using W paw pads flanking the F rod — replaces solid K band that hid the grip. (2) Frame 2 is now a lean-back tug: entire upper body + rod shifts right 2px (rod moves col 7→9), legs stay anchored at original position, creating a visible rod bend between body (col 9) and legs/water (col 7). (3) Bobber dips with D splash ring in frame 2. Both choreSprites.ts and generate-chore-fish-preview.mjs updated with identical frame data.

**2026-03-30T17:28:10Z**

Iteration 3: fixed rod split (1px shift not 2, smooth flex at legs), added visible KFK grip at body rows, fixed water U to #4678AA

**2026-03-30T17:46:35Z**

Iteration 4: rod moved to col 4 (left side), asymmetric arm grip, transparent water rows (ground tiles show through), bobber+splash only, rod tip bows in frame 2

**2026-03-30T18:11:34Z**

Iteration 5 (v5): Canonical body from SWEEP_2 shifted 1px left, rod at col 15 (rightmost pixel alongside body edge). Frame 2: rod tip bows 2px left, 5px-wide DDDDD splash around bobber, body static. D color lightened to #A0D0F0. Both choreSprites.ts and preview script updated in sync.

User feedback on v5:
- Splash direction is better but feels CUT OFF at the right edge — needs room to extend or be repositioned
- PREVIOUS BOBBER (v4, centered BBB at cols 3-5) was preferred over v5 bobber (BB/BBB at cols 13-15)
- Rod movement still too subtle — 2px bow doesn't read
- Panda has NO movement between frames — needs some body animation (arm shift, lean, something)

Key lessons from all 5 iterations:
1. Rod must NOT pass through the body — col 4 (v4) cut into face/ears, center cols split the body
2. Rod at col 15 (v5) keeps canonical body intact but leaves no room for splash/bobber to breathe on the right
3. Transparent water rows work well — ground tiles show through
4. Body must have SOME animation between frames — fully static reads as broken
5. Splash size/lightness (D=#A0D0F0, 5px wide) is on the right track but placement needs work
6. The canonical body (from SWEEP_2) must be preserved — non-canonical pandas look wrong

**2026-03-30T18:31:37Z**

Approved approach v6: (1) Use canonical SWEEP_2 body UNSHIFTED (revert v5's 1px left shift). Col 0 free on all rows. (2) Rod at col 0 (panda's right / screen-left), vertical alongside body. Right arm (cols 1-4, rows 17-21) adjacent = implied grip. (3) Bobber at cols 0-2 directly below rod. (4) Splash asymmetric RIGHTWARD from bobber (~cols 0-5), extending into open water. (5) Frame 2: rod tip bows LEFTWARD (panda resists fish pull), subtle arm animation. (6) Water rows transparent. (7) Remove dead U palette entry.

**2026-03-30T18:53:08Z**

v6 implemented: canonical SWEEP_2 body unshifted, rod at col 0 (screen-left), 3px rod bow rightward in frame 2, arm animation on rows 22-24, bobber at cols 0-2, splash extends rightward (cols 0-5). Removed dead U palette entry. Both files verified character-for-character identical. npx tsc --noEmit passes.

**2026-03-30T19:25:02Z**

Approved approach v7: (1) Rod centered at col 7-8 (ear gap), vertical through/in-front-of face and body. Arms explicitly grip the rod at body rows. (2) Frame 1: neutral stance, rod straight, bobber below in water. (3) Frame 2: panda leans LEFT (screen-left) ~2px on upper body, rod shifts left with the body, feet anchored. Bobber dips with splash. (4) Rod overlapping face pixels is OK — brown on white reads as 'in front'. (5) Water rows transparent. (6) Keep dead U removed, D=#A0D0F0.

**2026-03-30T19:45:53Z**

v7: rod centered at col 7 (ear gap), Frame 1 canonical SWEEP_2 body with rod overlay + W paw grip on band rows, Frame 2 upper body shifts left 2px (rod to col 5) with smooth 1px transition at row 22 and anchored feet. Fixed two bugs from v6: row 16 rod drift (was col 6, now col 7), row 14 chin too narrow in Frame 2. Both files verified character-for-character identical, tsc --noEmit passes.

**2026-03-30T19:58:08Z**

v7b: rod moved from col 7 to col 9 in frame 1; frame 2 lean increased from 2px to 3px (rod col 9→6); transition rows 3→2→1→0 smoothing; splash expanded from 2 rows to 3 rows (DFD / DDDDD / DBBBBBD) centered on col 9; WFW paw grip preserved at new positions; both files verified identical grids, all rows 16 chars, tsc clean

**2026-03-30T20:04:18Z**

v7c: curved rod in frame 2 — tip at col 3 (row 0), col 4 (rows 1-2), col 5 (ear rows 3-5), col 6 (body rows 6-21), then 7→8→9 transition to anchored feet. Row 27 splash removed (rod only). Full arc visible from top to bottom.
