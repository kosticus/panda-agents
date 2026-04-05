---
id: pa-3dgg
status: open
deps: [pa-x4zj]
links: []
created: 2026-04-04T15:57:54Z
type: task
priority: 2
assignee: Kimberly Kost
tags: [village, sprites, 32x64]
---
# Scale chop animation to 32x64

Pixel-double the chop chore animation from 16x32 to 32x64 and refine. 2 frames: axe wind-up (widened shoulders) + chopping stump.

Source: webview-ui/src/village/choreSprites.ts (CHOP_PAL, CHOP_1, CHOP_2)
Reference: pa-x4zj (canonical 32x64 base panda)

Approach:
- Pixel-double existing 16x32 frames to 32x64
- Refine at new resolution using the canonical 32x64 panda body as reference
- Preserve 2-frame animation (wind-up + chop)
- Update choreSprites.ts with new frames
- Update scripts/generate-chore-chop-preview.mjs for visual validation

