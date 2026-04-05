---
id: pa-gcqh
status: open
deps: [pa-x4zj]
links: []
created: 2026-04-04T15:58:03Z
type: task
priority: 2
assignee: Kimberly Kost
tags: [village, sprites, 32x64]
---
# Scale sweep animation to 32x64

Pixel-double the sweep chore animation from 16x32 to 32x64 and refine. 2 frames: broom sweeping motion.

Source: webview-ui/src/village/choreSprites.ts (SWEEP_PAL, SWEEP_1, SWEEP_2)
Reference: pa-x4zj (canonical 32x64 base panda)

Approach:
- Pixel-double existing 16x32 frames to 32x64
- Refine at new resolution using the canonical 32x64 panda body as reference
- Preserve 2-frame animation (sweep left + sweep right)
- Update choreSprites.ts with new frames
- Update scripts/generate-chore-sweep-preview.mjs for visual validation

