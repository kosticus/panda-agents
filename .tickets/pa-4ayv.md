---
id: pa-4ayv
status: open
deps: [pa-x4zj]
links: []
created: 2026-04-04T15:58:01Z
type: task
priority: 2
assignee: Kimberly Kost
tags: [village, sprites, 32x64]
---
# Scale bamboo animation to 32x64

Pixel-double the bamboo chore animation from 16x32 to 32x64 and refine. 2 frames: gripping bamboo stalk + pulling.

Source: webview-ui/src/village/choreSprites.ts (BAMBOO_PAL, BAMBOO_1, BAMBOO_2)
Reference: pa-x4zj (canonical 32x64 base panda)

Approach:
- Pixel-double existing 16x32 frames to 32x64
- Refine at new resolution using the canonical 32x64 panda body as reference
- Preserve 2-frame animation (grip + pull)
- Update choreSprites.ts with new frames
- Update scripts/generate-chore-bamboo-preview.mjs for visual validation

