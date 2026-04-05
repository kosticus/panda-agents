---
id: pa-4ayv
status: in_progress
deps: [pa-x4zj]
links: []
created: 2026-04-04T15:58:01Z
type: task
priority: 2
assignee: Kimberly Kost
tags: [village, sprites, 32x64, planned]
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


## Notes

**2026-04-05T19:48:34Z**

Started by Kimberly Kost

**2026-04-05T19:51:07Z**

Approved approach: Follow established pattern from water/sweep/build siblings. Add BAMBOO_BIG_PAL, BAMBOO_BIG_1, BAMBOO_BIG_2 to choreSprites.ts, add bamboo entry to CHORE_SPRITES_BIG, update preview script to 32x64 format.

**2026-04-05T20:12:37Z**

Scaled bamboo animation to 32x64. Added BAMBOO_BIG_PAL, BAMBOO_BIG_1 (grip), BAMBOO_BIG_2 (pull) to choreSprites.ts. Added bamboo to CHORE_SPRITES_BIG map. Updated preview script to 32x64 format outputting panda_bamboo_32x64_preview_8x.png. Body anatomy matches BASE_32 template. Frame 1: panda shifted left, stalk (NNVV 4px) planted in ground at right. Frame 2: panda shifted right, stalk pulled up ~8 rows with air gap. Ground (dirt D) at rows 55-56 in both frames. All rows verified 32 chars, 64 rows per frame, palette clean, TS compiles.

**2026-04-05T20:56:39Z**

Refinement: fixed band progression (now 24→26→28→30→32→32), arm widths, ear spacing, and body taper to match canonical BASE_32 template. Kept 2px left/right shift between frames.
