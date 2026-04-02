---
id: pa-ah18
status: closed
deps: []
links: []
created: 2026-03-28T19:36:46Z
type: task
priority: 3
parent: pa-aua3
tags: [village, sprites, deferred]
---
# Larger hut sprites

Design and implement medium (2-panda) and large (3-panda) hut sprites. Current POC has only small (1-panda) huts via createSmallHut() in hutSprites.ts.

Source design: ~/pkm/projects/pixel-agents/hut-sizes-medium-large-design.synth.md

Deferred — layout revision should leave room for these, but sprite creation is not blocking other work.


## Notes

**2026-04-02T16:39:24Z**

Started by Kimberly Kost

**2026-04-02T18:13:51Z**

Approved approach: (1) Create generate-medium-hut-preview.mjs (64x48, 4 tiles wide, 2 doorways) and generate-large-hut-preview.mjs (80x48, 5 tiles wide, 3 doorways) — elongated oval dome roof, side-by-side 16px arched doorways, same palette. (2) Add createMediumHut/createLargeHut to hutSprites.ts with parameterized width and doorway count. (3) Update renderer to switch on placement.size for hut creation and place N sleep sprites per hut. (4) Update tileMap layout to add HH pair and HHH triple clusters so all sizes render. (5) tsc --noEmit to verify.

**2026-04-02T18:38:03Z**

Implemented medium (64x48, 2 doorways) and large (80x48, 3 doorways) hut sprites. Refactored hutSprites.ts with parameterized builder (shared computeDoorways, buildBackSprite, buildFrontSprite). Added doorways field to Structure type. Renderer switches on cluster size (1=small, 2=medium, 3+=large) and places N sleep+zzz sprites per hut. Layout: converted (18,7) to HH medium cluster, (36,18) to HHH large cluster. Created preview scripts. tsc --noEmit passes clean. Deviated from plan: used (36,18) for HHH instead of (10,9) because col 12 row 9 is path.
