---
id: pa-3eaa
status: closed
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


## Notes

**2026-04-06T15:57:49Z**

Session 2026-04-06: Initial 32x64 frames created. Frame 1: standard BASE_32 upright body, HH handle runs from shoulder through leg gap to blade/earth at bottom rows 55-56. Frame 2: blade overhead (rows 1-6), HH through entire head/face/band/upper-body, stops at belly row 41, standard legs below. Ears compressed to 4 rows and band to 5 rows in frame 2 to accommodate blade. Preview script updated to 32x64 format. Ready for visual review.

**2026-04-06T16:00:19Z**

Session 2026-04-06: First pass done. Remaining: arms need to look like they're actually holding the shovel and moving up between frames (currently arms are standard BASE_32 pose, not gripping the handle). Needs arm/hand refinement in both frames.

**2026-04-06T17:18:48Z**

Arm grip refinement done. Frame 1: arms converge 9K-12K rows 39-43, 3W paw pads at handle. Frame 2: grip at shoulder 11K-12K rows 37-39, taper to idle belly below. Preview script synced. Accepted for in-app validation.
