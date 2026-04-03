---
id: pa-v04a
status: open
deps: [pa-ee7g, pa-hm38, pa-ckg8, pa-s7kv]
links: []
created: 2026-04-03T20:44:10Z
type: feature
priority: 2
assignee: Kimberly Kost
tags: [planned]
---
# 2x scale validation — 32px tiles and 32x64 pandas

Validate that 32px tiles and 32x64 pandas feel right for 4-6 pandas on a 14" laptop. Currently the village is designed for 25 pandas at 16px tiles — too small to read comfortably. This first increment proves the 2x scale before committing to redrawing all assets.

Source plan: /Users/kimberlykost/.claude/plans/eventual-riding-crayon.md
PKM decision doc: ~/pkm/projects/panda-agents/village-2x-rescale-decision.synth.md

## Design

#### Orchestration

Four child tasks build toward an atomic result on the setup branch:

1. **Scale foundation** — TILE_SIZE=32, 25x15 grid, new layout, renderer offsets. Everything else depends on this.
2. **Rough ground tiles** — 32x32 grass+path sprites, disable edge blending. Depends on foundation.
3. **Hut sprite scaling** — double all dimension constants + fix hardcoded values. Depends on foundation.
4. **Sleep sprite** — 32x64 panda + ZZZ overlays + preview script. Depends on foundation.

Tasks 2-4 touch different files (groundTiles.ts, hutSprites.ts, sleepSprite.ts) and can run in parallel after Task 1.

#### Integration verification

After all children complete, the user builds and views the village in the VS Code webview:
- Sleeping pandas visible in hut doorways at 32x64
- Grass/path ground tiles render at 32x32
- Scene density feels right for 4-6 pandas on 14" laptop
- Key question: is 25x15 the right grid size?

#### Constraints
- User runs builds and preview scripts (don't run build commands)
- All changes must be coherent together — intermediate states on the branch are expected to look wrong
- This is a validation pass — rough art is acceptable

