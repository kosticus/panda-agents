---
id: pa-3eaa
status: open
deps: [pa-x4zj]
links: []
created: 2026-04-04T15:58:07Z
type: task
priority: 2
assignee: Kimberly Kost
tags: [village, sprites, 32x64, planned]
---
# Scale dig animation to 32x64

Pixel-double the dig chore animation from 16x32 to 32x64 and refine. 2 frames: bent forward with shovel + shovel overhead.

Source: webview-ui/src/village/choreSprites.ts (DIG_PAL, DIG_1, DIG_2)
Reference: pa-x4zj (canonical 32x64 base panda)

Approach:
- Pixel-double existing 16x32 frames to 32x64
- Refine at new resolution using the canonical 32x64 panda body as reference
- Preserve 2-frame animation (dig down + lift)
- Update choreSprites.ts with new frames
- Update scripts/generate-chore-dig-preview.mjs for visual validation

