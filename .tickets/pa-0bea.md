---
id: pa-0bea
status: closed
deps: []
links: []
created: 2026-03-29T01:33:26Z
type: task
priority: 2
parent: pa-udbx
tags: [planned]
---
# Fix build animation: plank-placing motion

Redesigned from mallet swing to plank-placing. The mallet/hammer approach had unsolvable problems at 16×32: arm routing through face, floating tools, asymmetric silhouettes. Plank-placing keeps props at body level where they read clearly.

Source plan: ~/pkm/projects/pixel-agents/chore-animation-fixes-r5.synth.md

## Design

Frame 1 (standing, holding plank):
- Panda positioned 2 rows higher (head near top of frame)
- Canonical ears, face, band
- Full 8-row body with plank held across belly (2 rows of KKTTTTDDDDTTTTKK — K paws gripping 12px plank)
- Canonical legs, 2-row wall below

Frame 2 (crouched, plank placed):
- Panda drops 3 rows (5 empty at top vs 2) — visible vertical motion
- Canonical ears, face, band
- Compressed 5-row body (crouching), no plank
- Shorter legs (2 rows), wall grows to 3 rows (placed plank on top)
- Wall rows all same width (TTTTDDDDTTTT pattern)

Key file: scripts/generate-chore-build-preview.mjs
Also: scripts/animation-test.html updated to support per-animation frame counts.

Acceptance: run `node scripts/generate-chore-build-preview.mjs`, open panda_build_preview_8x.png — 2 frames: standing panda with visible brown plank at belly, crouched panda with taller wall.


## Notes

**2026-03-29T01:46:44Z**

Replaced build frame 1 ear/face/band/body rows with canonical patterns from generate-panda-sheets.mjs. Removed KK arm column (cols 14-15) from all head rows. Switched from 7 asymmetric body rows to 8 canonical symmetric body rows (KKKK arms on both sides). Frame 2 reviewed — all rows 16 chars, no stray pixels found.

**2026-03-29T14:15:43Z**

Redesigned from 2 to 3 frames. Frame 1: mallet raised above head, arm in header rows only, canonical body. Frame 2: mid-swing, mallet at chest height. Frame 3: impact, lean forward with mallet at wall. Updated COLS to 3, renders 3 frames side by side.

**2026-03-29T14:30:50Z**

Fixed frame 1: right arm K pixels removed from body (arm is raised), added arm KK through ear rows connecting body to mallet. Fixed frame 3: restored 6th ear row so ground stays level, reviewed for stray pixels.

**2026-03-29T15:28:00Z**

Final design: switched from mallet swing to plank-placing. Mallet approach failed at 16x32 (arm routing, floating tools, asymmetry). Plank-placing works: frame 1 holds plank at belly (full-width brown band with K paws), frame 2 crouches 3 rows and wall grows. Animation viewer updated with per-animation frame counts.
