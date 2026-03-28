---
id: pa-h3ca
status: closed
deps: [pa-ilil, pa-io8r, pa-ee5d, pa-pmsk, pa-18cp, pa-zfhy]
links: []
created: 2026-03-28T02:39:23Z
type: feature
priority: 2
tags: [planned]
---
# Hut and sleeping panda rendering POC

Create a minimal village/ module in webview-ui/src/ that renders a basic village scene: ground tiles, a hut with back/front Z-sorted layers, and a sleeping panda cycling between 2 animation frames. All fresh village-native code — zero office dependencies.

Source plan: ~/pkm/projects/pixel-agents/village-scaffold-plan.synth.md
Data sources: scripts/generate-ground-preview.mjs, generate-hut-preview.mjs, generate-sleep-preview.mjs, village-layout.txt

This is a POC to validate hut rendering and sleeping panda animation before the village module grows. Side quest toward moving to its own repo.

## Design

6 tasks creating ~7 files in webview-ui/src/village/ (flat structure):
- types.ts — village-native types (TileType, SpriteData, Structure, Drawable)
- groundTiles.ts — grass/path/bamboo patterns from generate-ground-preview.mjs
- hutSprites.ts — back/front hut layers from generate-hut-preview.mjs
- sleepSprite.ts — 2 sleeping panda frames from generate-sleep-preview.mjs
- tileMap.ts — embedded village-layout.txt parsed into tile grid
- renderer.ts — ground grid + Z-sorted hut layers + sleeping panda animation
- index.ts — barrel export for module boundary

Execution order: types first → ground tiles, hut sprites, sleep sprite, layout parser (parallel) → renderer + barrel last.

Verification: tsc --noEmit from webview-ui/ must pass with zero errors.

To visually test: temporarily swap OfficeCanvas for VillageCanvas in App.tsx (not part of this POC scope).

