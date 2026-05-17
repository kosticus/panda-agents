---
id: pa-3dgg
status: closed
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

**2026-04-06T17:38:49Z**

Implementation complete. CHOP_BIG_PAL + CHOP_BIG_1 (wind-up) + CHOP_BIG_2 (chop-down) added to choreSprites.ts after CHOP_2. Registered in CHORE_SPRITES_BIG. Created scripts/generate-chore-chop-32x64-preview.mjs. Verification: both frames 64 rows x 32 chars, all palette chars valid, TypeScript compiles clean, preview script frame data matches choreSprites.ts exactly.

**2026-04-07T01:45:15Z**

Session 6 ended 2026-04-06. Iteration 11 coded (not previewed). Handoff at ~/.claude/projects/-Users-kimberlykost-Documents-Code-panda-agents/handoff.md

**2026-04-09T01:24:44Z**

Session ended 2026-04-08. Committed chop frame 1 polish (75c68bd). Handoff at ~/.claude/projects/-Users-kimberlykost-Documents-Code-panda-agents/handoff.md

**2026-04-10T22:22:42Z**

Session ended 2026-04-10. Handoff at ~/.claude/projects/-Users-kimberlykost-Documents-Code-panda-agents/handoff.md
