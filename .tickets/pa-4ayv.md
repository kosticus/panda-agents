---
id: pa-4ayv
status: closed
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

**2026-04-05T21:26:44Z**

Session 2026-04-05: Initial 32x64 frames created, body proportions partially fixed (centered body, band transition, W symmetry, consistent NNVV stalk). Remaining issues: (1) shoulders still off, (2) bamboo stalk looks transparent, (3) too much head bob between frames (head shifts 2px left/right — may need to reduce to 1px or keep head centered). Commits: b3610a8 initial, 55e8a46 revert bad refinement, a616077 hand-fixed proportions. Preview script and animation-test.html already updated.

**2026-04-05T22:10:32Z**

Session ended 2026-04-05. Handoff context at ~/.claude/projects/-Users-kimberlykost-Documents-Code-panda-agents/handoff.md

**2026-04-05**

Stalk pattern NNVV→NNNV (less transparent). Frame 1 body reverted to centered/symmetric (body shift looked wrong — thin right arm created thumb-like artifacts). Band transitions from shifted head to centered body. Frame 2 body kept shifted right (toward stalk). Tried several grip approaches (flush K, far-side wrap, near-side overlap) — all looked worse than the gap. Current: arm tapers 3K→3K→2K→1K with 1px gap before stalk. Still not perfect — will iterate in-app.
