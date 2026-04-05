---
id: pa-yilb
status: open
deps: [pa-x4zj]
links: []
created: 2026-04-04T15:58:11Z
type: task
priority: 2
assignee: Kimberly Kost
tags: [village, sprites, 32x64, planned]
---
# Scale attention animation to 32x64

Pixel-double the attention (needs-attention) animation from 16x32 to 32x64 and refine. 2 frames: red ! visible with paw raised + ! gone with paw lowered. Not a chore — this is the alert/waving indicator.

Source: scripts/generate-chore-attention-preview.mjs (wave1, wave2)
Reference: pa-x4zj (canonical 32x64 base panda)

Approach:
- Pixel-double existing 16x32 frames to 32x64
- Refine at new resolution using the canonical 32x64 panda body as reference
- Preserve 2-frame animation (! + wave high, no ! + wave low)
- Add to choreSprites.ts or appropriate location
- Update scripts/generate-chore-attention-preview.mjs for visual validation

