---
id: pa-3dgg
status: in_progress
deps: [pa-x4zj]
links: []
created: 2026-04-04T15:57:54Z
type: task
priority: 2
assignee: Kimberly Kost
tags: [village, sprites, 32x64, planned]
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


## Notes

**2026-04-06T17:20:14Z**

Started by Kimberly Kost

**2026-04-06T17:23:14Z**

Approved approach: Follow dig-sibling pattern exactly. (1) Create CHOP_BIG_PAL, CHOP_BIG_1, CHOP_BIG_2 in choreSprites.ts after CHOP_2 (~line 226). Pixel-double 16x32 frames then refine using canonical BASE_32 body template. Frame 1: axe wind-up. Frame 2: chopping stump. (2) Register in CHORE_SPRITES_BIG with toSpriteBig. (3) Create scripts/generate-chore-chop-32x64-preview.mjs following dig preview pattern (32x64 frames, 8x scale). Keep inline stump rows.
