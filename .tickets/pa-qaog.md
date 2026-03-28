---
id: pa-qaog
status: open
deps: []
links: []
created: 2026-03-28T01:04:25Z
type: task
priority: 2
parent: pa-x3tb
tags: [planned, migrated]
---
# Integrate panda sprites into pixel-agents app

70 panda PNGs committed but CHAR_COUNT=6 and PALETTE_COUNT=6 still. App loads only first 6 sprites, uses hue shifting for repeats. Need: update CHAR_COUNT to 70, PALETTE_COUNT to 70, rewrite pickDiversePalette() to use variant index, remove hue shift logic (useless for black/white pandas). Migrated from pixel-agents-standalone pas-s1m0.

## Design

Files: server/assetLoader.ts (CHAR_COUNT 6→70), constants.ts (PALETTE_COUNT 6→70), officeState.ts (pickDiversePalette rewrite, remove hueShift), spriteData.ts (bypass hueShiftSprites). Persistence format unchanged (palette becomes variant index, hueShift always 0). NOTE: design references office architecture — will need rescoping if village rewrite proceeds.

