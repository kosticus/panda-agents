---
id: pa-3xew
status: closed
deps: [pa-eyhx]
links: []
created: 2026-04-04T14:57:33Z
type: task
priority: 2
assignee: Kimberly Kost
parent: pa-okh6
tags: [sprite, edge-blend]
---
# Tune edge blend parameters at 32x32 scale

Visual tuning pass on edge blending after blendEdges is fixed and wired in. Iterative — user runs the app and reports back.

## Design

#### Scope
- Review transition depth (may need more or less than 6px depending on visual result)
- Review per-depth density probabilities — current values (38%/19%/6%) were tuned for 16px
- Review BLEND_DENSITY overrides (cooking↔gathering at 0.55, garden↔water at 2.0) — may need retuning
- Review SPECIAL_PALETTE entries — garden↔water dark transition may need adjustment
- Review chunk skip probability (line 1088-1089) — controls clumpiness of blending
- Check narrow path corridors (1-2 tile wide) blend correctly on both sides
- Check groundskeeping↔grass boundary (should be invisible since both use grass base)

#### Key file
webview-ui/src/village/groundTiles.ts — BLEND_PALETTE, SPECIAL_PALETTE, BLEND_DENSITY records and blendEdges internals

#### Verification
- Visual inspection of all zone boundary pairs in running app
- Natural-looking graduated transitions, no harsh lines or obvious patterns

## Notes

**2026-04-04T15:06:38Z**

Started by Kimberly Kost
