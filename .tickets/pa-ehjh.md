---
id: pa-ehjh
status: open
deps: [pa-x4zj]
links: []
created: 2026-04-04T15:57:52Z
type: task
priority: 2
assignee: Kimberly Kost
tags: [village, sprites, 32x64]
---
# Scale cook animation to 32x64

Pixel-double the cook chore animation from 16x32 to 32x64 and refine. 2 frames: stirring pot with spoon + steam.

Source: webview-ui/src/village/choreSprites.ts (COOK_PAL, COOK_1, COOK_2)
Reference: pa-x4zj (canonical 32x64 base panda)

Approach:
- Pixel-double existing 16x32 frames to 32x64
- Refine at new resolution using the canonical 32x64 panda body as reference for consistency
- Preserve 2-frame animation (stir motion + steam)
- Update choreSprites.ts with new frames
- Update scripts/generate-chore-cooking-preview.mjs for visual validation

