---
id: pa-twcm
status: open
deps: [pa-x4zj]
links: []
created: 2026-04-04T15:57:57Z
type: task
priority: 2
assignee: Kimberly Kost
tags: [village, sprites, 32x64, planned]
---
# Scale fish animation to 32x64

Pixel-double the fish chore animation from 16x32 to 32x64 and refine. 2 frames: casting rod + reeling in water.

Source: webview-ui/src/village/choreSprites.ts (FISH_PAL, FISH_1, FISH_2)
Reference: pa-x4zj (canonical 32x64 base panda)

Approach:
- Pixel-double existing 16x32 frames to 32x64
- Refine at new resolution using the canonical 32x64 panda body as reference
- Preserve 2-frame animation (cast + reel)
- Update choreSprites.ts with new frames
- Update scripts/generate-chore-fish-preview.mjs for visual validation

